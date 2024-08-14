import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';


@Component({
  selector: 'app-real-time',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatListModule, MatChipsModule],
  templateUrl: './real-time.component.html',
  styleUrl: './real-time.component.scss',
})
export class RealTimeComponent {

  systemStatus = 'Operational'; // Example status
  connectivityStatus = 'Online'; // Example status
  lastChecked = new Date().toLocaleString();
  services = [
    { name: 'Service A', status: 'Online' },
    { name: 'Service B', status: 'Offline' },
  ];
  logs = [
    'Log entry 1',
    'Log entry 2',
  ];
  alerts = [
    { message: 'Alert 1', timestamp: new Date().toLocaleString() },
    { message: 'Alert 2', timestamp: new Date().toLocaleString() },
  ];
  maintenances = [
    { task: 'Maintenance 1', date: '2024-08-15' },
  ];
  connectedCameras = 12; // Example number of connected cameras

  // constructor() {}

  // ngOnInit(): void {
  //   // Initialize component data here
  // }

  runDiagnostics() {
    // Add diagnostics logic here
  }

  restartServices() {
    // Add service restart logic here
  }
}
