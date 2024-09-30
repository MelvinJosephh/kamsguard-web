import { Route } from '@angular/router';
import { ContactUsComponent } from './core/contact-us/contact-us.component';
import { HomeComponent } from './core/home/home.component';
import { SystemConfigComponent } from './core/system-config/system-config.component';
import { ClientsComponent } from './features/clients/clients.component';
import { ConnectedDevicesComponent } from './features/connected-devices/connected-devices.component';
import { DeviceManagementComponent } from './features/device-management/device-management.component';
import { EventsComponent } from './features/events/events.component';
import { LiveStreamComponent } from './features/live-stream/live-stream.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { RealTimeComponent } from './features/real-time/real-time.component';
import { UserManagementComponent } from './features/user-management/user-management.component';
// import { authGuard } from './features/services/auth-guard.service';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { LoginComponent } from './core/authentication/login/login.component';
import { RegisterComponent } from './core/authentication/register/register.component';
import { DashboardComponent } from './features/dashboard.component';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'dashboard', component: DashboardComponent, data: { authGuardPipe: redirectUnauthorizedToLogin }, canActivate: [AuthGuard] },

  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard]},
  { path: 'device-management', component: DeviceManagementComponent, data: { showSidebar: true } },
  { path: 'real-time', component: RealTimeComponent, data: { showSidebar: true } },
  { path: 'user-management', component: UserManagementComponent, data: { showSidebar: true } },
  // { path: 'support', component: SupportComponent, data: { showSidebar: true } },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'system-config', component: SystemConfigComponent },
  { path: 'live-stream', component: LiveStreamComponent, data: { showSidebar: true } },
  { path: 'events', component: EventsComponent, data: { showSidebar: true } },
  { path: 'connected-devices', component: ConnectedDevicesComponent },
  { path: 'clients', component: ClientsComponent },

];
