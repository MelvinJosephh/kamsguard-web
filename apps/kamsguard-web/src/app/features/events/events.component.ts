import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { IClientSubscribeOptions } from 'mqtt';

@Component({
  standalone: true,
  selector: 'app-events',
  imports: [CommonModule, MatExpansionModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers: []
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  private topic = 'NetVu/Kamsware-FV3/event/#'; // Change to the topic you want to subscribe to
  client: MqttService;

  constructor(private mqttService: MqttService) {
    this.client = this.mqttService;
  }

  ngOnInit(): void {
    this.createConnection();
  }

  createConnection() {
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
      console.log(
        `Received message ${packet.payload.toString()} from topic ${
          packet.topic
        }`
      );
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

  // processMessage(message: string) {
  //   try {
  //     const data = JSON.parse(message);
  //     const { expression, value, extended } = data;

  //     if (value === 1 && extended && extended.length) {
  //       extended.forEach((event: any) => {
  //         const { event: eventName, site_id, time, ...alarmDetails } = event;

  //         // Check if this event already exists in the array
  //         const eventId = `${eventName}-${site_id}-${time}`;
  //         if (
  //           !this.events.some(
  //             (e) => `${e.event}-${e.siteId}-${e.time}` === eventId
  //           )
  //         ) {
  //           // Add to events array with all details
  //           this.events.push({
  //             expression,
  //             event: eventName,
  //             siteId: site_id,
  //             time,
  //             details: alarmDetails,
  //           });
  //         }
  //       });
  //     }
  //   } catch (e) {
  //     console.error('Error processing message', e);
  //   }
  // }
  processMessage(message: string) {
    try {
      const data = JSON.parse(message);
      const { expression, value, extended } = data;
  
      if (value === 1 && extended && extended.length) {
        extended.forEach((event: any) => {
          const { event: eventName, site_id, time, ...alarmDetails } = event;
  
          // Add primary event details
          // this.addEvent({
          //   expression,
          //   event: eventName,
          //   siteId: site_id,
          //   time,
          //   details: alarmDetails,
          // });
  
          // Check and process nested extended events
          for (const key in alarmDetails) {
            if (alarmDetails[key]?.extended) {
              alarmDetails[key].extended.forEach((nestedEvent: any) => {
                const nestedDetails = { ...nestedEvent, parentEvent: eventName };
                this.addEvent({
                  expression,
                  event: nestedEvent.event,
                  siteId: nestedEvent.site_id,
                  time: nestedEvent.time,
                  details: nestedDetails,
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
  
  // Helper function to add events to the array
  addEvent(event: any) {
    const eventId = `${event.event}-${event.siteId}-${event.time}`;
    if (!this.events.some(e => `${e.event}-${e.siteId}-${e.time}` === eventId)) {
      this.events.push(event);
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
