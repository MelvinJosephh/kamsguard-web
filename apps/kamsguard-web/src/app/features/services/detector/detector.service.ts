import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MqttService as NgxMqttService, IMqttMessage } from 'ngx-mqtt';
import { CamFailEvent, ConnectedDevice } from '../../models/detector.model';

@Injectable({
  providedIn: 'root'
})
export class DetectorService {

  private camFailSubject = new Subject<CamFailEvent>();
  private reportSubject = new Subject<ConnectedDevice>();

  camFail$ = this.camFailSubject.asObservable();
  report$ = this.reportSubject.asObservable();
  private connectedDevices: ConnectedDevice[] = [];

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
    this.mqttService.observe('NetVu/Kamsware-FV3/event/W_camFail_01').subscribe((message: IMqttMessage) => {
      this.processCamFailMessage(message.payload.toString());
      console.log(message.payload.toString());
    });

    this.mqttService.observe('NetVu/Kamsware-FV3//report').subscribe((message: IMqttMessage) => {
      this.processReportMessage(message.payload.toString());
    });
  }

  private processCamFailMessage(payload: string) {
    try {
      const data = JSON.parse(payload);
      console.log('Parsed CAMFAIL data:', data);
      const event: CamFailEvent = data.extended[0];
      this.camFailSubject.next(event);
    } catch (e) {
      console.error('Failed to parse CAMFAIL message:', e);
    }
  }

  private processReportMessage(payload: string) {
    try {
      const reportData = this.parseReportData(payload);
      console.log('Parsed report data:', reportData);
      this.updateConnectedDevices(reportData);
    } catch (e) {
      console.error('Failed to process report message:', e);
    }
  }

  private parseReportData(data: string): ConnectedDevice {
    const reportLines = data.split('\n');
    const reportData: { [key: string]: string } = {};

    reportLines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        reportData[key.trim()] = value.trim();
      }
    });

    return {
      siteId: reportData['Site-Id'],
      localIp: reportData['Local-IP'],
      responseArea: reportData['Response-Area'],
      systemCamera: reportData['System-Camera']
    } as ConnectedDevice;
  }

  private saveDeviceData(device: ConnectedDevice) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.httpClient.post('http://localhost:3600/save-device', device, { headers })
      .subscribe(response => {
        console.log('Device saved:', response);
      }, error => {
        console.error('Failed to save device:', error);
      });
  }

  private updateConnectedDevices(device: ConnectedDevice): void {
    const existingDevice = this.connectedDevices.find(d => d.systemCamera === device.systemCamera);
    if (!existingDevice) {
      this.connectedDevices.push(device); // Use push instead of reassigning the array
      this.saveDeviceData(device);
    }
  }
}
