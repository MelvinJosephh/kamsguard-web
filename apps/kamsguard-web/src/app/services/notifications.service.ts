import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/send-notification'; // URL to your backend server

  constructor(private http: HttpClient) {}

  sendNotification(to: string, subject: string, text: string): Observable<any> {
    return this.http.post(this.apiUrl, { to, subject, text });
  }
}
