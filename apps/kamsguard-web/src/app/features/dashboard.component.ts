import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SidebarService } from './services/sidebar/sidebar.service';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, RouterModule, MatIconModule],
  // animations: [
  //   trigger('fadeInOut', [
  //     state('void', style({ opacity: 0 })),
  //     transition(':enter, :leave', [
  //       animate(300, style({ opacity: 1 })),
  //     ]),
  //   ]),
  // ],
})
export class DashboardComponent implements OnInit {
  isSidebarVisible = true;
  isSubmenuOpen = false;
  isDashboardSelected = false;
  isDashboardSubmenuOpen = false;
  isDeviceManagementSubmenuOpen = false;

  constructor(private sidebarService: SidebarService, private auth: Auth, private router: Router) {}

 
  ngOnInit() {
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      this.isSidebarVisible = isVisible;
      this.checkUserAuthentication();
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

  checkUserAuthentication(){
  const user = this.auth.currentUser;
  if (!user) {
    this.router.navigate(['/login']);
  }
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
