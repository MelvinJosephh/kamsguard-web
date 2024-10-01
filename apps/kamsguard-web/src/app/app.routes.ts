import { Route } from '@angular/router';

import { authGuard } from './features/services/auth-guard.service';
import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './core/authentication/login/login.component';
import { RegisterComponent } from './core/authentication/register/register.component';
import { DashboardComponent } from './features/dashboard.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { DeviceManagementComponent } from './features/device-management/device-management.component';
import { RealTimeComponent } from './features/real-time/real-time.component';
import { UserManagementComponent } from './features/user-management/user-management.component';
import { EventsComponent } from './features/events/events.component';
import { ConnectedDevicesComponent } from './features/connected-devices/connected-devices.component';
import { ClientsComponent } from './features/clients/clients.component';
import { ContactUsComponent } from './core/contact-us/contact-us.component';
import { SystemConfigComponent } from './core/system-config/system-config.component';
import { LiveStreamComponent } from './features/live-stream/live-stream.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent, 
    canActivate: [authGuard],      
    children: [             
      { path: 'notifications', component: NotificationsComponent, canActivate: [authGuard] },
      { path: 'device-management', component: DeviceManagementComponent, canActivate: [authGuard] },
      { path: 'real-time', component: RealTimeComponent, canActivate: [authGuard] },
      { path: 'user-management', component: UserManagementComponent, canActivate: [authGuard] },
      { path: 'events', component: EventsComponent, canActivate: [authGuard] },
      { path: 'connected-devices', component: ConnectedDevicesComponent, canActivate: [authGuard] },
      { path: 'clients', component: ClientsComponent, canActivate: [authGuard] },
    ]
  },

  { path: 'contact-us', component: ContactUsComponent },
  { path: 'system-config', component: SystemConfigComponent },
  { path: 'live-stream', component: LiveStreamComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
