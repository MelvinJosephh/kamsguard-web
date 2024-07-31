import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

interface Notification {
  timestamp: string;
  eventType: string;
  notificationType: string; // e.g., email, SMS
  status: string; // e.g., sent, pending
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.component.html',
  imports: [CommonModule, SharedModule],
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  displayedColumns: string[] = ['timestamp', 'eventType', 'notificationType', 'status'];
  dataSource = new MatTableDataSource<Notification>(this.notifications);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, { static: false }) sort: MatSort | null = null;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    // Fetch notifications from the server or service
    this.notifications = [
      { timestamp: '2024-07-29 14:32', eventType: 'Fire', notificationType: 'Email', status: 'Sent' },
      { timestamp: '2024-07-29 14:34', eventType: 'Smoke', notificationType: 'SMS', status: 'Pending' },
      // Add more example notifications as needed
    ];
    this.dataSource.data = this.notifications;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.dataSource.filter = input.value.trim().toLowerCase();
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Sent':
        return 'primary';
      case 'Pending':
        return 'warn';
      default:
        return 'basic';
    }
  }
}
