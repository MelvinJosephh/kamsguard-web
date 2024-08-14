
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../../features/services/sidebar/sidebar.service';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from '../../../features/user-management/user-management.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule, UserManagementComponent, MatIconModule, MatToolbarModule],
})
export class HeaderComponent  {

  constructor(private sidebarService: SidebarService) {}

  toggleSidebar() {
  // Check if the button click event is registered
    this.sidebarService.toggleSidebar();
    // Check if the visibility state is changing
  }
}
