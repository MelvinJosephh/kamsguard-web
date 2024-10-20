import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { SidebarService } from './services/sidebar/sidebar.service';
import { DashboardHeaderComponent } from '../core/layout/dashboard-header/dashboard-header.component';
import { SidebarComponent } from '../core/layout/sidenav/sidenav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    DashboardHeaderComponent,
    SidebarComponent,
  ],
})
export class DashboardComponent implements OnInit {
  isUserAuthenticated = false;
  isSidebarVisible = true;

  constructor(
    private sidebarService: SidebarService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      this.isSidebarVisible = isVisible;
    });

    this.checkUserAuthentication();
  }

  checkUserAuthentication() {
    const user = this.auth.currentUser;
    if (user) {
      this.isUserAuthenticated = true;
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
