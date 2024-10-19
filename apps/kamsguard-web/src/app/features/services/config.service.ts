import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MqttConfig {
  hostname: string;
  port: number;
  path: string;
  mqttUser: string;
  mqttPass: string;
  protocol: 'ws' | 'wss';
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = 'http://localhost:3001/config'; // URL to your backend config route

  constructor(private http: HttpClient) {}

  getMqttConfig(): Observable<MqttConfig> {
    return this.http.get<MqttConfig>(this.configUrl);
  }
}
