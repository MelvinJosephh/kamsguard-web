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
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  private topic = '#'; // Change to the topic you want to subscribe to
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
      console.log(`Received message ${packet.payload.toString()} from topic ${packet.topic}`);
      this.processMessage(packet.payload.toString());
    });
  }

  doSubscribe() {
    const { topic } = this;
    this.client.observe(topic, { qos: 0 } as IClientSubscribeOptions).subscribe((message: IMqttMessage) => {
      console.log('Received message:', message.payload.toString());
      this.processMessage(message.payload.toString());
    });
  }

  processMessage(message: string) {
    try {
      const data = JSON.parse(message);
      const { expression, value, extended } = data;
  
      if (value === 1 && extended && extended.length) {
        extended.forEach((event: any) => {
          // Extract common properties
          const { event: eventName, site_id, time } = event;
  
          // Create a unique identifier for this event
          const eventId = `${eventName}-${site_id}-${time}`;
  
          // Check if this event already exists in the array
          if (!this.events.some(e => `${e.event}-${e.siteId}-${e.time}` === eventId)) {
            // Check for specific alarms and handle them
            const alarmTypes = ['HIGH_MOVEMENT_ALARM', 'FLAME_ALARM', 'SMOKE_ALARM', 'THERMAL1_ALARM'];
            const alarmDetails: any = {};
  
            alarmTypes.forEach((type) => {
              if (event[type]) {
                alarmDetails[type] = event[type];
              }
            });
  
            // Add to events array
            this.events.push({
              expression,
              event: eventName,
              siteId: site_id,
              time,
              details: alarmDetails
            });
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
