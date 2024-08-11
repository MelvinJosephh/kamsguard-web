import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { DeviceManagementComponent } from './device-management/device-management.component';
import { RealTimeComponent } from './real-time/real-time.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { HomeComponent } from './home/home.component';
import { SupportComponent } from './support/support.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SystemConfigComponent } from './system-config/system-config.component';
import { LiveStreamComponent } from './live-stream/live-stream.component';
import { EventsComponent } from './events/events.component';
import { ClientsComponent } from './clients/clients.component';
import { ConnectedDevicesComponent } from './connected-devices/connected-devices.component';
import { AuthComponent } from './authentication/authentication.component';

export const appRoutes: Route[] = [
    { path: 'dashboard', component: DashboardComponent, data: { showSidebar: true } },
    { path: 'notifications', component: NotificationsComponent, data: { showSidebar: true } },
    { path: 'device-management', component: DeviceManagementComponent, data: { showSidebar: true } },
    { path: 'real-time', component: RealTimeComponent, data: { showSidebar: true } },
    { path: 'user-management', component: UserManagementComponent, data: { showSidebar: true } },
    { path: 'home', component: HomeComponent, data: { showSidebar: true } },
    { path: 'support', component: SupportComponent, data: { showSidebar: true } },
    { path: 'contact-us', component: ContactUsComponent },
    { path: 'system-config', component: SystemConfigComponent },
    { path: 'live-stream', component: LiveStreamComponent, data: { showSidebar: true } },
    { path: 'events', component: EventsComponent, data: { showSidebar: true } },
    { path: 'connected-devices', component: ConnectedDevicesComponent, data: { showSidebar: true } },
    { path: 'clients', component: ClientsComponent },
    { path: 'auth', component: AuthComponent },
];
