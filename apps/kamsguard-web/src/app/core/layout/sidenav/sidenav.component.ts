import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SidebarService } from '../../../features/services/sidebar/sidebar.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  imports: [CommonModule, RouterModule, MatIconModule],
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
    this.sidebarService.toggleSidebar(); 
  }

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  toggleDashboardSubmenu() {
    this.isDashboardSubmenuOpen = !this.isDashboardSubmenuOpen;
    if (this.isDashboardSubmenuOpen) {
      this.isDeviceManagementSubmenuOpen = false; 
    }
  }

  toggleDeviceManagementSubmenu() {
    this.isDeviceManagementSubmenuOpen = !this.isDeviceManagementSubmenuOpen;
    if (this.isDeviceManagementSubmenuOpen) {
      this.isDashboardSubmenuOpen = false;
    }
  }

  selectDashboard() {
    this.isDashboardSelected = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
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
