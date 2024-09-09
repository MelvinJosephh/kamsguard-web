import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MqttService } from '../services/mqtt/mqtt.service';

interface Notification {
  timestamp: string;
  eventType: string;
  siteId?: string;
  notificationType: string;
  status: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.component.html',
  imports: [CommonModule, MatToolbarModule, MatCardModule, MatFormFieldModule, MatTableModule, MatChipsModule, MatInputModule, MatPaginatorModule],
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, AfterViewInit {
  notifications: Notification[] = [];
  displayedColumns: string[] = ['timestamp', 'eventType', 'notificationType', 'status'];
  dataSource = new MatTableDataSource<Notification>(this.notifications);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, { static: false }) sort: MatSort | null = null;

  constructor(private mqttService: MqttService) {
    this.mqttService.eventProcessed.subscribe(event => {
      this.processEventInComponent(event.eventType, event.siteId, event.timestamp, event.status);
    });
  }
  

  ngOnInit(): void {
    this.mqttService.createConnection();
    this.loadNotifications();
  }
  
  
  loadNotifications(): void {
    this.mqttService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.updateDataSource();
      },
      error: (error) => console.error('Error loading notifications:', error)
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }


  processEventInComponent(eventName: string, siteId: string, time: string, status: string) {
    const newNotification: Notification = {
      timestamp: time,
      eventType: eventName,
      siteId: siteId,
      notificationType: 'Email',
      status: status, // set the initial status to pending
    };
    
    this.notifications.push(newNotification);
    console.log(this.notifications)
    this.updateDataSource();
  }
  
  // processEventInComponent(eventName: string, siteId: string, time: string, status: string) {
  //   const existingNotification = this.notifications.find(
  //     n => n.eventType === eventName && n.siteId === siteId && n.timestamp === time
  //   );
  
  //   if (!existingNotification) {
  //     const newNotification: Notification = {
  //       timestamp: time,
  //       eventType: eventName,
  //       siteId: siteId,
  //       notificationType: 'Email',
  //       status: 'Pending', // Initially set to 'Pending'
  //     };
      
  //     this.notifications.push(newNotification);
  //     this.updateDataSource();
  //   } else {
  //     // Update existing notification status if needed
  //     existingNotification.status = status;
  //     this.updateDataSource();
  //   }
  // }
  


  updateDataSource() {
    this.dataSource.data = [...this.notifications];
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
        return 'status-sent';
      case 'Pending':
        return 'status-pending';
      case 'Failed':
        return 'status-failed';
      default:
        return 'status-default';
    }
  }
}
