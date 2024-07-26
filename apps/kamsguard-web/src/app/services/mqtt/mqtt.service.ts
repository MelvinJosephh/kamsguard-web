import { Injectable } from '@angular/core';
import { MqttService as NgxMqttService, IMqttMessage } from 'ngx-mqtt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private topic = 'NetVu/#'; 

  constructor(private mqttService: NgxMqttService) {
    // Optionally initialize any connections or subscriptions here
  }

  // Method to publish messages
  public publishMessage(topic: string, message: string): void {
    this.mqttService.publish(topic, message);
  }

  // Method to get messages from a specific topic
  public getMessages(topic: string): Observable<IMqttMessage> {
    return this.mqttService.observe(topic);
  }
}
