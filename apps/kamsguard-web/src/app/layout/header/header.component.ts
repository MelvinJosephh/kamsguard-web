
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserManagementComponent } from '../../user-management/user-management.component';
import { HomeComponent } from '../../home/home.component';


@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, SharedModule, RouterModule, DashboardComponent, UserManagementComponent, HomeComponent],
})
export class HeaderComponent  {

  constructor(private sidebarService: SidebarService) {}

  toggleSidebar() {
  // Check if the button click event is registered
    this.sidebarService.toggleSidebar();
    // Check if the visibility state is changing
  }
}
