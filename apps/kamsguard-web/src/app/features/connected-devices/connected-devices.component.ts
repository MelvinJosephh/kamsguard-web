// src/app/features/connected-devices/connected-devices.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { DetectorService } from '../services/detector/detector.service';
import { Device } from '../models/detector.model'; // Correct import path

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
  displayedColumns: string[] = ['siteId', 'deviceId', 'status', 'lastActiveTime'];
  private subscriptions: Subscription = new Subscription();

  constructor(private detectorService: DetectorService) {}

  ngOnInit(): void {
    this.fetchConnectedDevices();
    // Refresh data every 60 seconds
    const timerSubscription = interval(60000).subscribe(() => this.fetchConnectedDevices());
    this.subscriptions.add(timerSubscription);
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
      const [companyName, siteName] = device.siteId.split('-');

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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
