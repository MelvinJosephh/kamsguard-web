import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IClientSubscribeOptions } from 'mqtt/*';
import { MqttService as NgxMqttService, IMqttMessage, MqttService } from 'ngx-mqtt';

// export interface EventData {
//   timestamp: string;
//   eventType: string;
//   siteId: string;
//   details: string;
//   isCritical?: boolean;
//   threshold?: number;
//   trigger?: boolean;
//   thresholds: [];
// }

export interface EventData {
  timestamp: string;
  eventType: string;
  siteId: string;
  details: {
    [key: string]: any; // Adjust if needed
    thresholds?: Array<{
      botright: { x: number; y: number };
      topleft: { x: number; y: number };
      mean: any;
      peak: any; threshold: number
    }>;
  };
  isCritical?: boolean;
  threshold?: number; // If applicable
  trigger?: boolean;
  thresholds?: Array<{ threshold: number }>;
}


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  eventProcessed = new EventEmitter<EventData>(); // Use this name consistently

  client: MqttService;
  private apiUrl = 'http://localhost:3001/events'; // URL to the API

  constructor(private mqttService: NgxMqttService, private http: HttpClient) {
    this.client = this.mqttService;
  }

  private topic = 'NetVu/Kamsware-FV3/event/#'; // Change to the topic you want to subscribe to

  public createConnection() {
    try {
      this.client.connect();
    } catch (error) {
      console.log('MQTT connect error:', error);
    }
    this.client.onConnect.subscribe(() => {
      console.log('Mqtt connection succeeded!');
      this.doSubscribe();
    });
    this.client.onError.subscribe((error: any) => {
      console.log('Connection failed', error);
    });
    this.client.onMessage.subscribe((packet: IMqttMessage) => {
      this.processMessage(packet.payload.toString());
    });
  }

  doSubscribe() {
    const { topic } = this;
    this.client
      .observe(topic, { qos: 0 } as IClientSubscribeOptions)
      .subscribe((message: IMqttMessage) => {
        this.processMessage(message.payload.toString());
      });
  }

  processMessage(message: string) {
    try {
      const data = JSON.parse(message);
      const { value, extended } = data;

      if (value === 1 && extended && extended.length) {
        extended.forEach((event: any) => {
          const { event: eventName, site_id, time, isCritical, regions, ...alarmDetails } = event;

          // Check and process nested extended events
          for (const key in alarmDetails) {
            if (alarmDetails[key]?.extended) {
              alarmDetails[key].extended.forEach((nestedEvent: any) => {
                const nestedDetails = { ...nestedEvent, parentEvent: eventName };

                // Initialize thresholds array
                let thresholds = [];

                // Check if the event is a thermal event and has regions
                if (nestedEvent.event === 'THERMAL1' || nestedEvent.event === 'THERMAL2') {
                  // Capture the thresholds of triggered regions
                  if (nestedEvent.regions) {
                    thresholds = nestedEvent.regions
                      .filter((region: any) => region.trigger === true)
                      .map((region: any) => ({
                        threshold: region.threshold,
                        peak: region.peak,
                        mean: region.mean,
                        topleft: region.topleft,
                        botright: region.botright,
                      }));
                  }

                  // Emit event with thresholds
                  this.eventProcessed.emit({
                    eventType: nestedEvent.event,
                    siteId: nestedEvent.site_id,
                    timestamp: nestedEvent.time,
                    details: { ...nestedDetails, thresholds },
                    thresholds // Add threshold values
                  });
                } else {
                  // Emit event normally if it's not a thermal event
                  this.eventProcessed.emit({
                    eventType: nestedEvent.event,
                    siteId: nestedEvent.site_id,
                    timestamp: nestedEvent.time,
                    details: nestedDetails,
                    ...nestedDetails,
                  });
                }
              });
            }
          }
        });
      }
    } catch (e) {
      console.error('Error processing message', e);
    }
  }


  destroyConnection() {
    try {
      this.client.disconnect(true);
      console.log('Successfully disconnected!');
    } catch (error: any) {
      console.log('Disconnect failed', error.toString());
    }
  }

  // Method to fetch existing events from the backend
  getEvents(): Observable<EventData[]> {
    return this.http.get<EventData[]>(this.apiUrl);
  }

  // Method to save an event to the backend
  saveEvent(event: EventData): Observable<any> {
    return this.http.post(this.apiUrl, event).pipe(
      catchError((error: any) => {
        console.error('Error saving event:', error);
        return throwError(() => new Error(error));
      })
    );
  }

}
