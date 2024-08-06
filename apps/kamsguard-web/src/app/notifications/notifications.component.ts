import { Component, OnInit, ViewChild } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IClientSubscribeOptions } from 'mqtt';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { eventMapping } from '../events.mapping';

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

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
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

  // Subscribe to the specified mqtt topic and process incoming messages
  doSubscribe() {
    const { topic } = this;
    this.client.observe(topic, { qos: 0 } as IClientSubscribeOptions).subscribe((message: IMqttMessage) => {
      this.processMessage(message.payload.toString());
    });
  }

  processMessage(message: string) {
    try {
      const data = JSON.parse(message);
      const { value, extended } = data;
  
      if (value === 1 && extended && extended.length) {
        extended.forEach((event: any) => {
          const { event: eventName, site_id, time } = event;
          const eventId = `${eventName}-${site_id}-${time}`;
          const mappedEventName = eventMapping[eventName] || eventName;
  
          // Check if notification already exists based on unique combination
          const existingNotification = this.notifications.find(
            e => e.eventType === mappedEventName && e.siteId === site_id && e.timestamp === time
          );
  
          if (!existingNotification) {
            const newNotification: Notification = {
              timestamp: time,
              eventType: mappedEventName,
              siteId: site_id,
              notificationType: 'Email',
              status: 'Pending', // Set to 'Pending' initially
            };
  
            this.notifications.push(newNotification);
            this.updateDataSource();
  
            this.sendEmailNotification(newNotification);
          } else {
            console.log(`Notification already exists for event: ${eventId}`);
          }
        });
      }
    } catch (e) {
      console.error('Error processing message', e);
    }
  }
  

  sendEmailNotification(notification: Notification) {
    const emailData = {
      subject: `Pre-Alarm Notification: ${notification.eventType}`,
      eventType: `${notification.eventType}`,
      timestamp: `${notification.timestamp}`,
      siteId: `${notification.siteId}`
    };
  
    this.http.post('http://localhost:3000/send-email', emailData, { responseType: 'text' }) // Expecting text response
      .subscribe({
        next: (response: any) => {
          console.log('Email sent successfully:', response);
          this.updateNotificationStatus(notification, 'Sent');
        },
        error: (error) => {
          console.error('Error sending email:', error);
          this.updateNotificationStatus(notification, 'Failed');
        }
      });
  }
  

  updateNotificationStatus(notification: Notification, status: string) {
    const index = this.notifications.findIndex(
      n => n.timestamp === notification.timestamp && n.eventType === notification.eventType && n.siteId === notification.siteId
    );
    if (index !== -1) {
      this.notifications[index].status = status;
      this.updateDataSource();
    }
  }

  updateDataSource() {
    this.dataSource.data = [...this.notifications];
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
        return 'status-sent';
      case 'Pending':
        return 'status-pending';
      case 'Failed':
        return 'status-failed';
      default:
        return 'status-default';
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
