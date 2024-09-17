import { EventEmitter, Injectable } from '@angular/core';
import { IClientSubscribeOptions } from 'mqtt/*';
import { MqttService as NgxMqttService, IMqttMessage } from 'ngx-mqtt';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Notification {
  timestamp: string;
  eventType: string;
  siteId: string;
  notificationType: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class MqttService {

  client: MqttService;
  eventProcessed = new EventEmitter<Notification>();
  notifications: Notification[] = [];
  private processedEvents: Set<string> = new Set();

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>('http://localhost:3000/notifications');
  }

  constructor(private mqttService: NgxMqttService, private http: HttpClient) {
    this.client = this;
  }

  public createConnection() {
    try {
      console.log('Connecting to MQTT broker...');
      this.mqttService.connect();
    } catch (error) {
      console.log('MQTT connect error:', error);
    }
    this.mqttService.onConnect.subscribe(() => {
      console.log('Connection succeeded!');
      this.doSubscribe();
    });
    this.mqttService.onError.subscribe((error: any) => {
      console.log('Connection failed', error);
    });
    this.mqttService.onMessage.subscribe((packet: IMqttMessage) => {
      // console.log(`Received message ${packet.payload.toString()} from topic ${packet.topic}`);
      this.processMessage(packet.payload.toString());
    });
  }

  doSubscribe() {
    const topic = '#';
    this.mqttService.observe(topic, { qos: 0 } as IClientSubscribeOptions).subscribe((message: IMqttMessage) => {
      this.processMessage(message.payload.toString());
    });
  }

  processMessage(message: string) {
    try {
      const data = JSON.parse(message);
      const { value, extended } = data;

      if (value === 1 && extended && extended.length) {
        extended.forEach((event: any) => {
          const { event: eventName, site_id, time, ...details } = event;

          for (const key in details) {
            if (details[key]?.extended) {
              details[key].extended.forEach((nestedEvent: any) => {
                const nestedDetails = { ...nestedEvent, parentEvent: eventName };
                this.processEvent(nestedEvent.event, nestedEvent.site_id, nestedEvent.time, nestedDetails);
              });
            }
          }

          // this.processEvent(eventName, site_id, time, details);
        });
      } else {
        // console.log('Ignoring message with value other than 1');
      }
    } catch (e) {
      // console.error('Error processing message', e);
    }
  }

  processEvent(eventName: string, siteId: string, time: string, details: any) {
    const eventIdentifier = `${eventName}-${siteId}-${time}`;

    if (this.processedEvents.has(eventIdentifier)) {
      // console.log(`Event already processed: ${eventIdentifier}`);
      return;
    }

    this.processedEvents.add(eventIdentifier);

    const existingNotification = this.notifications.find(
      e => e.eventType === eventName && e.siteId === siteId && e.timestamp === time
    );

    if (!existingNotification) {
      const newNotification: Notification = {
        timestamp: time,
        eventType: eventName,
        siteId: siteId,
        notificationType: 'Email',
        status: 'Pending',
      };

      this.notifications.push(newNotification);
      // this.eventProcessed.emit(newNotification);
      this.sendEmailNotification(newNotification, details);
    } else {
      // console.log(`Notification already exists for event: ${eventName}`);
    }
  }



  updateNotificationStatus(notification: Notification, status: string) {

    const index = this.notifications.findIndex(
      n => n.timestamp === notification.timestamp && n.eventType === notification.eventType && n.siteId === notification.siteId
    );

    if (index !== -1) {
      this.notifications[index].status = status;
      this.eventProcessed.emit(this.notifications[index]);
    }
  }

  sendEmailNotification(notification: Notification, details: any) {
    const emailData = {
      subject: `Alarm Alert!`,
      eventType: notification.eventType,
      timestamp: notification.timestamp,
      siteId: notification.siteId,
      details: details // Include nested details if necessary
    };

    this.http.post('http://localhost:3001/notifications/send-email', emailData, { responseType: 'text' })
      .subscribe({
        next: (response: any) => {
          // console.log('Email sent successfully:', response);
          this.updateNotificationStatus(notification, 'Sent');
          // this.eventProcessed.emit(notification);
        },
        error: (error) => {
          console.error('Error sending email:', error);
          this.updateNotificationStatus(notification, 'Failed');
        }
      });
  }


  destroyConnection() {
    try {
      this.mqttService.disconnect(true);
      console.log('Successfully disconnected!');
    } catch (error: any) {
      console.log('Disconnect failed', error.toString());
    }
  }
}
