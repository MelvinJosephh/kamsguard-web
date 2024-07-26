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

export const appRoutes: Route[] = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'device-management', component: DeviceManagementComponent },
    { path: 'real-time', component: RealTimeComponent },
    { path: 'user-management', component: UserManagementComponent },
    { path: 'home', component: HomeComponent },
    { path: 'support', component: SupportComponent },
    { path: 'contact-us', component: ContactUsComponent },
    { path: 'system-config', component: SystemConfigComponent },
    { path: 'live-stream', component: LiveStreamComponent },
    { path: 'events', component: EventsComponent },
    { path: 'clients', component: ClientsComponent },
];
