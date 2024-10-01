import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthenticationService } from '../../../features/services/authentication.service';
import { SidebarService } from '../../../features/services/sidebar/sidebar.service';


@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent {
openChat() {
throw new Error('Method not implemented.');
}
openFAQs() {
throw new Error('Method not implemented.');
}
openNotifications() {
throw new Error('Method not implemented.');
}
unreadNotifications: any;
  constructor(private authService: AuthenticationService, private sidebarService: SidebarService) {}
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  logout() {
    this.authService.logout(); // Call your logout method
  }
}
