// services/detector.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from '../../models/detector.model';

@Injectable({
  providedIn: 'root',
})
export class DetectorService {
  private apiUrl = 'https://kamsguard-server.vercel.app/connected-devices'; // Update if different

  constructor(private http: HttpClient) {}

  // Fetch connected devices from the server
  getConnectedDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl);
  }
}
export { Device };

