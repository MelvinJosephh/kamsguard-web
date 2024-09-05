import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { IClientSubscribeOptions } from 'mqtt';

@Component({
  selector: 'app-device-management',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.scss'],
})
export class DeviceManagementComponent implements OnInit {
  devices: any[] = []; 
  private topic = 'NetVu/#'; 
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
      this.processMessage(packet.payload.toString());
    });
  }

  doSubscribe() {
    const { topic } = this;
    this.client.observe(topic, { qos: 0 } as IClientSubscribeOptions).subscribe((message: IMqttMessage) => {
      this.processMessage(message.payload.toString());
    });
  }

  processMessage(message: string) {
    try {
      const data = JSON.parse(message);
  
      if (data.extended && data.extended.length > 0) {
        data.extended.forEach((event: any) => {
          const { event: eventType, site_id, time, state } = event;
          const isOnline = state === 'active';
          const deviceIndex = this.devices.findIndex(device => device.location === site_id);
  
          if (deviceIndex !== -1) {
            this.devices[deviceIndex] = {
              ...this.devices[deviceIndex],
              status: isOnline ? 'online' : 'offline',
              lastActivity: time 
            };
          } else {
            this.devices.push({
              name: `Device for ${site_id}`,
              status: isOnline ? 'online' : 'offline',
              location: site_id,
              lastActivity: time
            });
          }
        });
      }
    } catch (e) {
      console.error('Error processing message', e);
    }
  }
  

  viewDetails(device: any): void {
    // Logic to view device details
    console.log('Viewing details for', device);
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
