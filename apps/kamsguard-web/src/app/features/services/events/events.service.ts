import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IClientSubscribeOptions } from 'mqtt/*';
import { MqttService as NgxMqttService, IMqttMessage, MqttService } from 'ngx-mqtt';
import { EventData } from '../../models/event.model';



@Injectable({
  providedIn: 'root'
})
export class EventsService {
  eventProcessed = new EventEmitter<EventData>(); 

  client: MqttService;
  private apiUrl = 'http://localhost:3001/events'; 

  constructor(private mqttService: NgxMqttService, private http: HttpClient) {
    this.client = this.mqttService;
  }

  private topic = 'NetVu/Kamsware-FV3/event/#'; 

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

          for (const key in alarmDetails) {
            if (alarmDetails[key]?.extended) {
              alarmDetails[key].extended.forEach((nestedEvent: any) => {
                const nestedDetails = { ...nestedEvent, parentEvent: eventName };
                const eventId = `${nestedEvent.event}-${nestedEvent.site_id}-${nestedEvent.time}`;
                let thresholds = [];

                if (nestedEvent.event === 'THERMAL1' || nestedEvent.event === 'THERMAL2') {
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

                  this.eventProcessed.emit({
                    id: eventId,
                    eventType: nestedEvent.event,
                    siteId: nestedEvent.site_id,
                    timestamp: nestedEvent.time,
                    details: { ...nestedDetails, thresholds },
                    thresholds 
                  });
                } else {
                  this.eventProcessed.emit({
                    id: eventId,
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

  getEvents(): Observable<EventData[]> {
    return this.http.get<EventData[]>(this.apiUrl);
  }

  saveEvent(event: EventData): Observable<any> {
    return this.http.post(this.apiUrl, event).pipe(
      catchError((error: any) => {
        console.error('Error saving event:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${eventId}`).pipe(
      catchError((error: any) => {
        console.error('Error deleting event:', error);
        return throwError(() => new Error(error));
      })
    );
  }
  
  
}
export { EventData };

