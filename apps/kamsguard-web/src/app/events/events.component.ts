import { Component, OnInit } from '@angular/core';
import { IMqttMessage, IMqttServiceOptions, IPublishOptions, MqttService } from 'ngx-mqtt';
// import { MqttService } from '../services/mqtt/mqtt.service';
import { CommonModule } from '@angular/common';
import { IClientSubscribeOptions } from 'mqtt/*';


@Component({
  standalone: true,
  selector: 'app-events',
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  messages: string[] = [];
  private topic = 'NetVu/#'; // Ensure this matches the topic in your service
  client:MqttService;
  subscription = {
    topic: 'topic/mqttx',
    qos: 0,
 };
 publish = {
  topic: 'topic/browser',
  qos: 0,
  payload: '{ "msg": "Hello, I am browser." }',
};


  constructor(private mqttService: MqttService) { 
    this.client = this.mqttService
  }

  ngOnInit(): void {
    // this.mqttService.getMessages(this.topic).subscribe((message: IMqttMessage) => {
    //   console.log(message);
    //   this.messages.push(message.payload.toString());
    // });
    // this.mqttService.observe('my/topic').subscribe((message: IMqttMessage) => {
    //   // this.message = message.payload.toString();
    //   console.log(message);
    // });
   
    this.createConnection()
  }

  createConnection(){
    
    try {
     
      console.log('connecting');
      // this.client?.connect(
      //     {
      //   hostname: 'whale.rmq.cloudamqp.com',
      //   port: 443, // Use 8883 for TLS
      //   path: '/ws/mqtt', // Typically empty for non-TLS
      //   username: 'rdctgbmb:rdctgbmb',
      //   password: 'Q38RMeaEo3vuHEY5-swfp8O_qwSJ5n5N',
      //   protocol: 'wss',
      // }as IMqttServiceOptions
    // )
   } catch (error) {
      console.log('mqtt.connect error>>>>>>>>>>>>>>', error);
   }
    this.client?.onConnect.subscribe(() => {
      // this.isConnection = true
      // this.doSubscribe()
      console.log('Connection succeeded!');
   });
    this.client?.onError.subscribe((error: any) => {
      // this.isConnection = false
      console.log('Connection failed', error);
   });
    this.client?.onMessage.subscribe((packet: any) => {
      // this.receiveNews = this.receiveNews.concat(packet.payload.toString())
      console.log(`Received message ${packet.payload.toString()} from topic ${packet.topic}`)
   })
  }

  // publishTestMessage() {
  //   this.mqttService.publishMessage(this.topic, 'Test message');
  // }

  doSubscribe() {
    const { topic, qos } = this.subscription
    this.client?.observe(topic, { qos } as IClientSubscribeOptions).subscribe((message: IMqttMessage) => {
      // this.subscribeSuccess = true
      console.log('Subscribe to topics res', message.payload.toString())
   })
   }

   doPublish() {
    const { topic, qos, payload } = this.publish
    console.log(this.publish)
    this.client?.unsafePublish(topic, payload, { qos } as IPublishOptions)
   }

   destroyConnection() {
    try {
      this.client?.disconnect(true)
      // this.isConnection = false
      console.log('Successfully disconnected!')
   } catch (error: any) {
      console.log('Disconnect failed', error.toString())
   }
   }



}
