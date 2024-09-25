import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EventData } from '../../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  eventProcessed = new EventEmitter<EventData>(); 

  private apiUrl = '/proxy/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<EventData[]> {
    return this.http.get<EventData[]>(this.apiUrl);
  }

  saveEvent(event: EventData): Observable<any> {
    return this.http.post(this.apiUrl, event).pipe(
      catchError((error: any) => {
        console.error('Error saving event:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${eventId}`).pipe(
      catchError((error: any) => {
        console.error('Error deleting event:', error);
        return throwError(() => new Error(error));
      })
    );
  }
}
export { EventData };

