import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

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

  constructor(
    private http: HttpClient
  ) {
    
  }

getNotifications(): Observable<Notification[]> {
  const url = 'https://kamsguard-server.vercel.app/notifications'; // Use the external URL
  return this.http.get<Notification[]>(url).pipe(
    catchError((error) => {
      console.error('Error fetching notifications:', error);
      return of([]); // Return an empty array in case of an error
    })
  );
}

}
