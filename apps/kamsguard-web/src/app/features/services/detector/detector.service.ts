import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MqttService as NgxMqttService, IMqttMessage } from 'ngx-mqtt';
import { CamFailEvent, Device } from '../../models/detector.model';
// import { CamFailEvent, ConnectedDevice } from '../../models/detector.model';

@Injectable({
  providedIn: 'root'
})
export class DetectorService {

  private camFailSubject = new Subject<CamFailEvent>();
  private connectedDevicesSubject = new Subject<Device[]>();

  camFail$ = this.camFailSubject.asObservable();
  connectedDevices$ = this.connectedDevicesSubject.asObservable();

  private connectedDevices: { site: string, device: string, lastActivity: string }[] = [];

  constructor(private mqttService: NgxMqttService, private httpClient: HttpClient) {
    this.initializeMqtt();
  }

  private initializeMqtt() {
    this.mqttService.connect();
    this.mqttService.onConnect.subscribe(() => {
      console.log('Connected to MQTT broker');
      this.subscribeToTopics();
    });
  }

  private subscribeToTopics() {
    this.mqttService.observe('NetVu/#').subscribe((message: IMqttMessage) => {
      this.processDeviceMessage(message.payload.toString());
      console.log(message.payload.toString());
    });
  }

  private processDeviceMessage(payload: string) {
    try {
      const data = JSON.parse(payload);
      if (data.extended && data.extended.length) {
        const extended = data.extended[0];
        const site = extended.site_id;
        const device = extended.channel; 
        const lastActivity = extended.time;

        // Update or add new device entry
        this.updateConnectedDevices(site, device, lastActivity);
      }
    } catch (e) {
      console.error('Failed to parse device message:', e);
    }
  }


  private updateConnectedDevices(site: string, device: string, lastActivity: string): void {
    const existingDevice = this.connectedDevices.find(d => d.device === device);
    if (existingDevice) {
      existingDevice.lastActivity = lastActivity;
    } else {
      this.connectedDevices.push({ site, device, lastActivity });
    }

    // Notify subscribers
    this.connectedDevicesSubject.next(this.connectedDevices);
  }
}
