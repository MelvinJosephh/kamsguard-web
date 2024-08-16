import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { IClientSubscribeOptions } from 'mqtt/*';
import { MqttService as NgxMqttService, IMqttMessage, MqttService } from 'ngx-mqtt';

export interface EventData {
  timestamp: string;
  eventType: string;
  siteId: string;
  details: string;
  isCritical?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  eventProcessed = new EventEmitter<EventData>(); // Use this name consistently

  client: MqttService;

  constructor(private mqttService: NgxMqttService, private http: HttpClient) {
    this.client = this.mqttService;
  }

  private topic = 'NetVu/Kamsware-FV3/event/#'; // Change to the topic you want to subscribe to

  public createConnection() {
    try {
      console.log('Connecting to MQTT broker...');
      this.client.connect();
    } catch (error) {
      console.log('MQTT connect error:', error);
    }
    this.client.onConnect.subscribe(() => {
      console.log('Connection succeeded!');
      this.doSubscribe();
    });
    this.client.onError.subscribe((error: any) => {
      console.log('Connection failed', error);
    });
    this.client.onMessage.subscribe((packet: IMqttMessage) => {
      console.log(`Received message ${packet.payload.toString()} from topic ${packet.topic}`);
      this.processMessage(packet.payload.toString());
    });
  }

  doSubscribe() {
    const { topic } = this;
    this.client
      .observe(topic, { qos: 0 } as IClientSubscribeOptions)
      .subscribe((message: IMqttMessage) => {
        console.log('Received message:', message.payload.toString());
        this.processMessage(message.payload.toString());
      });
  }

  processMessage(message: string) {
    try {
      const data = JSON.parse(message);
      const { value, extended } = data;

      if (value === 1 && extended && extended.length) {
        extended.forEach((event: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { event: eventName, site_id, time,  isCritical, ...alarmDetails } = event;

          // Check and process nested extended events
          for (const key in alarmDetails) {
            if (alarmDetails[key]?.extended) {
              alarmDetails[key].extended.forEach((nestedEvent: any) => {
                const nestedDetails = { ...nestedEvent, parentEvent: eventName };
                this.eventProcessed.emit({
                  eventType: nestedEvent.event,
                  siteId: nestedEvent.site_id,
                  timestamp: nestedEvent.time,
                  details: nestedDetails,
                  ...nestedDetails,
                });
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
}
