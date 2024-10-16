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
  isMenuOpen = false;
  unreadNotifications: any;

  constructor(
    private authService: AuthenticationService,
    private sidebarService: SidebarService
  ) {}

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  openChat() {
    // Implement your method
  }

  openFAQs() {
    // Implement your method
  }

  openNotifications() {
    // Implement your method
  }

}