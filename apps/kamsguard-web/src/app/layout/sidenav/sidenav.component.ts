import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  imports: [CommonModule, SharedModule, DashboardComponent, RouterModule],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter, :leave', [
        animate(300, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  isSidebarVisible = true;
  isSubmenuOpen = false;
  isDashboardSelected = false;
  isDashboardSubmenuOpen = false;
  isDeviceManagementSubmenuOpen = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      this.isSidebarVisible = isVisible;
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    this.sidebarService.toggleSidebar(); // Toggle sidebar state
  }

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  toggleDashboardSubmenu() {
    this.isDashboardSubmenuOpen = !this.isDashboardSubmenuOpen;
    if (this.isDashboardSubmenuOpen) {
      this.isDeviceManagementSubmenuOpen = false; // Close Device Management submenu if open
    }
  }

  toggleDeviceManagementSubmenu() {
    this.isDeviceManagementSubmenuOpen = !this.isDeviceManagementSubmenuOpen;
    if (this.isDeviceManagementSubmenuOpen) {
      this.isDashboardSubmenuOpen = false; // Close Dashboard submenu if open
    }
  }

  selectDashboard() {
    this.isDashboardSelected = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth > 768 && !this.isSidebarVisible) {
      this.isSidebarVisible = true;
    }
  }

  handleLinkClick() {
    if (window.innerWidth <= 768) {
      this.toggleSidebar();
    }
  }
}
