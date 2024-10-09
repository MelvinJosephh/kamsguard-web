// src/app/features/connected-devices/connected-devices.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Device } from '../models/detector.model'; // Correct import path
import { DetectorService } from '../services/detector/detector.service';
import { SocketService } from '../services/socket/socket.service';

interface Site {
  siteName: string;
  devices: Device[];
}

interface Company {
  companyName: string;
  sites: Site[];
}

@Component({
  selector: 'app-connected-devices',
  templateUrl: './connected-devices.component.html',
  styleUrls: ['./connected-devices.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
})
export class ConnectedDevicesComponent implements OnInit, OnDestroy {
  companies: Company[] = [];
  displayedColumns: string[] = ['siteId', 'deviceId', 'lastActiveTime'];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private detectorService: DetectorService,
    private socketService: SocketService // Inject the SocketService
  ) {}

  ngOnInit(): void {
    this.fetchConnectedDevices();
    // Refresh data every 60 seconds
    const timerSubscription = interval(60000).subscribe(() => this.fetchConnectedDevices());
    this.subscriptions.add(timerSubscription);

    // Listen for real-time device updates
    const socketSubscription = this.socketService.onDeviceUpdated().subscribe(
      (updatedDevice) => {
        this.updateDeviceInUI(updatedDevice);
      },
      (error) => {
        console.error('Error receiving device updates:', error);
      }
    );
    this.subscriptions.add(socketSubscription);
  }

  private fetchConnectedDevices(): void {
    const devicesSubscription = this.detectorService.getConnectedDevices().subscribe(
      (devices) => {
        this.processDevices(devices);
      },
      (error) => {
        console.error('Error fetching connected devices:', error);
      }
    );
    this.subscriptions.add(devicesSubscription);
  }

  private processDevices(devices: Device[]): void {
    const companyMap = new Map<string, Company>();

    devices.forEach((device) => {
      const siteIdParts = device.siteId.split('-');

      // Determine if siteId has a prefix (e.g., '1-Kamsware-FV3')
      let companyName: string;
      let siteName: string;

      if (siteIdParts.length > 2) {
        // Assume the first part is a prefix, and the rest form the company and site names
        companyName = siteIdParts.slice(1, siteIdParts.length - 1).join('-'); // e.g., 'Kamsware'
        siteName = siteIdParts[siteIdParts.length - 1]; // e.g., 'FV3'
      } else if (siteIdParts.length === 2) {
        companyName = siteIdParts[0]; // e.g., 'Kamsware'
        siteName = siteIdParts[1];    // e.g., 'FV3'
      } else {
        console.warn(`Invalid siteId format for device ${device.deviceId}: ${device.siteId}`);
        return;
      }

      if (!companyName || !siteName) {
        console.warn(`Invalid siteId format for device ${device.deviceId}: ${device.siteId}`);
        return;
      }

      // Initialize the company if not yet added
      if (!companyMap.has(companyName)) {
        companyMap.set(companyName, { companyName, sites: [] });
      }
      const company = companyMap.get(companyName)!;

      // Initialize the site if not yet added
      let siteObj = company.sites.find((s) => s.siteName === siteName);
      if (!siteObj) {
        siteObj = { siteName, devices: [] };
        company.sites.push(siteObj);
      }

      // Push the device to the respective site
      siteObj.devices.push(device);
    });

    this.companies = Array.from(companyMap.values());
  }

  private updateDeviceInUI(updatedDevice: Device): void {
    const siteIdParts = updatedDevice.siteId.split('-');
    let companyName: string;
    let siteName: string;

    if (siteIdParts.length > 2) {
      companyName = siteIdParts.slice(1, siteIdParts.length - 1).join('-');
      siteName = siteIdParts[siteIdParts.length - 1];
    } else if (siteIdParts.length === 2) {
      companyName = siteIdParts[0];
      siteName = siteIdParts[1];
    } else {
      console.warn(`Invalid siteId format for device ${updatedDevice.deviceId}: ${updatedDevice.siteId}`);
      return;
    }

    // Find the company
    const company = this.companies.find(c => c.companyName === companyName);
    if (!company) {
      // If company doesn't exist, fetch all devices again
      this.fetchConnectedDevices();
      return;
    }

    // Find the site
    const site = company.sites.find(s => s.siteName === siteName);
    if (!site) {
      // If site doesn't exist, fetch all devices again
      this.fetchConnectedDevices();
      return;
    }

    // Find the device
    const device = site.devices.find(d => d.deviceId === updatedDevice.deviceId);
    if (device) {
      // Update the device's lastActiveTime
      device.lastActiveTime = updatedDevice.lastActiveTime;
    } else {
      // If device doesn't exist, add it to the site
      site.devices.push(updatedDevice);
    }

    // Optionally, trigger change detection or other UI updates if necessary
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
