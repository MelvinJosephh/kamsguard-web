
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
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
export class HeaderComponent {
  isMenuOpen = false;
  isHeaderVisible = true;
  private lastScrollTop = 0;

  constructor(private sidebarService: SidebarService) {}

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.isHeaderVisible = scrollTop <= this.lastScrollTop || scrollTop <= 100;
    this.lastScrollTop = scrollTop;
  }
}