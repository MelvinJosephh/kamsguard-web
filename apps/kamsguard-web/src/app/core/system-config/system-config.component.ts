import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-system-config',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatListModule, FormsModule, MatTableModule],
  templateUrl: './system-config.component.html',
  styleUrl: './system-config.component.scss',
})
export class SystemConfigComponent  {
  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }
  isConnected = false;
  lastChecked: string = new Date().toLocaleString();
  logs: string[] = ['Log entry 1', 'Log entry 2', 'Log entry 3'];
  networkConfig = { ipAddress: '', subnetMask: '', gateway: '' };
  detectors = [{ name: 'Smoke Detector 1', status: 'Online' }, { name: 'Flame Detector 1', status: 'Offline' }];
  config = { setting1: '', setting2: '' };
  maintenanceTasks = [{ description: 'Clean sensors', schedule: '2024-08-01' }];

  // constructor() {}

  // ngOnInit(): void {
  //   // Initialization logic here
  // }

  runDiagnostics() {
    console.log('Running diagnostics...');
    // Implement diagnostics logic here
  }

  restartServices() {
    console.log('Restarting services...');
    // Implement service restart logic here
  }

  updateFirmware() {
    console.log('Updating firmware...');
    // Implement firmware update logic here
  }

  clearLogs() {
    this.logs = [];
    console.log('Logs cleared.');
  }

  saveNetworkConfig() {
    console.log('Saving network configuration...', this.networkConfig);
    // Implement network configuration save logic here
  }

  saveConfig() {
    console.log('Saving configuration settings...', this.config);
    // Implement configuration save logic here
  }

  scheduleMaintenance() {
    console.log('Scheduling maintenance...');
    // Implement maintenance scheduling logic here
  }
}
