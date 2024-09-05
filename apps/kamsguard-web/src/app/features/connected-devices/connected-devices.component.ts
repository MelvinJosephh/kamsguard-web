import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DetectorService } from '../services/detector/detector.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Company, Site, Device } from '../models/detector.model';

@Component({
  standalone: true,
  selector: 'app-company-overview',
  imports: [MatCardModule, CommonModule, MatTableModule],
  templateUrl: './connected-devices.component.html',
  styleUrls: ['./connected-devices.component.scss']
})
export class ConnectedDevicesComponent implements OnInit, OnDestroy {
  companies: Company[] = [];
  displayedColumns: string[] = ['device', 'lastActivity'];
  private subscriptions: Subscription = new Subscription();

  constructor(private detectorService: DetectorService) {}

  ngOnInit(): void {
    this.subscribeToConnectedDevices();
  }

  private subscribeToConnectedDevices(): void {
    this.subscriptions.add(
      this.detectorService.connectedDevices$.subscribe(devices => {
        this.processDevices(devices);
      })
    );
  }

  private processDevices(devices: Device[]): void {
    const companyMap = new Map<string, Company>();

    devices.forEach(({ site, device, lastActivity }) => {
      // Assuming site has format like "CompanyName-SiteName"
      const [companyName, siteName] = site.split('-');

      if (!companyMap.has(companyName)) {
        companyMap.set(companyName, { companyName, sites: [] });
      }
      const company = companyMap.get(companyName)!;

      let siteObj = company.sites.find(s => s.siteName === siteName);
      if (!siteObj) {
        siteObj = { siteName, devices: [] };
        company.sites.push(siteObj);
      }

      siteObj.devices.push({ site: siteName, device, lastActivity });
    });

    this.companies = Array.from(companyMap.values());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
