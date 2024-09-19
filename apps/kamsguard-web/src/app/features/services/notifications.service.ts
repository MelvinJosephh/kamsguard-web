import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
export class NotificationService {

  eventProcessed = new EventEmitter<Notification>();
  private notifications: Notification[] = [];
  private processedEvents: Set<string> = new Set();

  constructor(
    private http: HttpClient
  ) {
    
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>('http://localhost:3001/notifications');
  }

  private processMessage(message: string) {
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

          this.processEvent(eventName, site_id, time, details);
        });
      }
    } catch (e) {
      console.error('Error processing message', e);
    }
  }

  private processEvent(eventName: string, siteId: string, time: string, details: any) {
    const eventIdentifier = `${eventName}-${siteId}-${time}`;

    if (this.processedEvents.has(eventIdentifier)) {
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
      // No longer needed: this.sendEmailNotification(newNotification, details);
    }
  }

  private updateNotificationStatus(notification: Notification, status: string) {
    const index = this.notifications.findIndex(
      n => n.timestamp === notification.timestamp && n.eventType === notification.eventType && n.siteId === notification.siteId
    );

    if (index !== -1) {
      this.notifications[index].status = status;
      this.eventProcessed.emit(this.notifications[index]);
    }
  }

  destroyConnection() {
    try {
      // this.mqttService.disconnect(true); // Uncomment if you are still using MQTT
      // console.log('Successfully disconnected!');
    } catch (error: any) {
      console.log('Disconnect failed', error.toString());
    }
  }
}
