import { Route } from '@angular/router';
import { AuthComponent } from './core/authentication/authentication.component';
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


export const appRoutes: Route[] = [
    { path: '', component: HomeComponent },
    // { path: 'dashboard', component: DashboardComponent, data: { showSidebar: true } },
    { path: 'notifications', component: NotificationsComponent, data: { showSidebar: true } },
    { path: 'device-management', component: DeviceManagementComponent, data: { showSidebar: true } },
    { path: 'real-time', component: RealTimeComponent, data: { showSidebar: true } },
    { path: 'user-management', component: UserManagementComponent, data: { showSidebar: true } },
    // { path: 'support', component: SupportComponent, data: { showSidebar: true } },
    { path: 'contact-us', component: ContactUsComponent },
    { path: 'system-config', component: SystemConfigComponent },
    { path: 'live-stream', component: LiveStreamComponent, data: { showSidebar: true } },
    { path: 'events', component: EventsComponent, data: { showSidebar: true } },
    { path: 'connected-devices', component: ConnectedDevicesComponent, data: { showSidebar: true } },
    { path: 'clients', component: ClientsComponent },
    { path: 'auth', component: AuthComponent },
];
