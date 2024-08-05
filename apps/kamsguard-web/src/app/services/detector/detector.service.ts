import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetectorService {

  constructor(private http: HttpClient) {}

  getCameraList(): Observable<any> {
    // Use the proxy URL to avoid CORS issues
    return this.http.get('/proxy/camlist.cgi?format=json');
  }
}
