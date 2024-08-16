import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
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

  constructor(private mqttService: NgxMqttService) {
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
    });

    this.mqttService.observe('NetVu/Kamsware-FV3//report').subscribe((message: IMqttMessage) => {
      this.processReportMessage(message.payload.toString());
    });
  }

  private processCamFailMessage(payload: string) {
    try {
      const data = JSON.parse(payload);
      console.log('Parsed CAMFAIL data:', data);
      // Ensure correct type
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
      
      this.reportSubject.next(reportData as ConnectedDevice);
    } catch (e) {
      console.error('Failed to process report message:', e);
    }
  }

  private parseReportData(data: string): any {
    const reportLines = data.split('\n');
    const reportData: { [key: string]: string } = {};

    reportLines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        reportData[key.trim()] = value.trim();
      }
    });

    // Map to ConnectedDevice type
    return {
      siteId: reportData['Site-Id'],
      localIp: reportData['Local-IP'],
      responseArea: reportData['Response-Area'],
      systemCamera: reportData['System-Camera']
    } as ConnectedDevice;
  }
}
