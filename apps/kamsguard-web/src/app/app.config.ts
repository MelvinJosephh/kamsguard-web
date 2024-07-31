import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { environment } from '../environments/environment.development';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    importProvidersFrom(CommonModule, SharedModule,
      MqttModule.forRoot({
        // hostname:'broker.emqx.io',
        // port: 8083, // Use 8883 for TLS
        // path: '/mqtt', // Typically empty for non-TLS
        // protocol: 'ws',

        hostname: environment.mqtt.hostname,
        port: environment.mqtt.port,
        path: environment.mqtt.path,
        protocol: environment.mqtt.protocol as 'ws' | 'wss',
        // username: 'rdctgbmb:rdctgbmb',
        // password: 'Q38RMeaEo3vuHEY5-swfp8O_qwSJ5n5N',
      } as IMqttServiceOptions),
    ),
  ],
};
