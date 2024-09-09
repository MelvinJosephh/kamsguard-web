import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonModule } from '@angular/common';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { environment } from '../environments/environment.development';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom(CommonModule,
      MqttModule.forRoot({
        hostname: environment.mqtt.hostname,
        port: environment.mqtt.port,
        path: environment.mqtt.path,
        protocol: environment.mqtt.protocol as 'ws' | 'wss',
        username: environment.mqtt.mqttUser,
        password: environment.mqtt.mqttPass,
      } as IMqttServiceOptions),
    ),
  ],
};
