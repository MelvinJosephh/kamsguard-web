import { Component, OnInit, ViewChild } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IClientSubscribeOptions } from 'mqtt';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HttpClient } from '@angular/common/http';

interface Notification {
  timestamp: string;
  eventType: string;
  siteId?: string;
  notificationType: string; // e.g., email, SMS
  status: string; // e.g., sent, pending, failed
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.component.html',
  imports: [CommonModule, SharedModule],
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  displayedColumns: string[] = ['timestamp', 'eventType', 'notificationType', 'status'];
  dataSource = new MatTableDataSource<Notification>(this.notifications);
  private topic = '#'; // Change to the specific topic for notifications
  client: MqttService;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, { static: false }) sort: MatSort | null = null;

  constructor(private mqttService: MqttService, private http: HttpClient) {
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
      const { value, extended } = data;

      if (value === 1 && extended && extended.length) {
        extended.forEach((event: any) => {
          // Extract properties
          const { event: eventName, site_id, time } = event;

          // Create a unique identifier for this event
          const eventId = `${eventName}-${site_id}-${time}`;

          // Check if this event already exists in the array
          if (!this.notifications.some(e => `${e.eventType}-${e.siteId}-${e.timestamp}` === eventId)) {
            // Add to notifications array
            const newNotification: Notification = {
              timestamp: time,
              eventType: eventName,
              siteId: site_id,
              notificationType: 'Email', 
              status: 'Pending', // Or determine based on logic
            };

            this.notifications.push(newNotification);
            this.dataSource.data = this.notifications;

            // Send email notification
            this.sendEmailNotification(newNotification);
          }
        });
      }
    } catch (e) {
      console.error('Error processing message', e);
    }
  }

  sendEmailNotification(notification: Notification) {
    const emailData = {
      subject: `Notification: ${notification.eventType}`,
      text: `Event Type: ${notification.eventType}\nTimestamp: ${notification.timestamp}\nSite ID: ${notification.siteId}`,
    };
  
    this.http.post('http://localhost:3000/send-email', emailData)
      .subscribe({
        next: (response: any) => {
          console.log('Email sent successfully:', response);
          notification.status = 'Sent'; // Set status to 'Sent' on success
          this.updateDataSource(); // Update the data source to reflect changes
        },
        error: (error) => {
          console.error('Error sending email:', error);
          notification.status = 'Failed'; // Set status to 'Failed' on error
          this.updateDataSource(); // Update the data source to reflect changes
        }
      });
  }
  
  updateDataSource() {
    this.dataSource.data = [...this.notifications]; // Update the data source with the latest data
  }
  

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.dataSource.filter = input.value.trim().toLowerCase();
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Sent':
        return 'primary';
      case 'Pending':
        return 'warn';
      case 'Failed':
        return 'accent'; // Using 'accent' color for failed status
      default:
        return 'basic';
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
