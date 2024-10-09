// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Device } from '../../models/detector.model';


@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://kamsguard-server.vercel.app'); // Adjust the URL if necessary
  }

  // Listen for device updates
  onDeviceUpdated(): Observable<Device> {
    return new Observable((observer) => {
      this.socket.on('deviceUpdated', (device: Device) => {
        observer.next(device);
      });

      // Clean up when unsubscribed
      return () => {
        this.socket.off('deviceUpdated');
      };
    });
  }

  // Optionally, handle connection errors
  onError(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('connect_error', (error) => {
        observer.next(error);
      });

      return () => {
        this.socket.off('connect_error');
      };
    });
  }
}
