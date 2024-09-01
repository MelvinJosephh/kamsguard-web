import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {
  clients = [
    // Sample client data
    {
      name: 'Kamsware',
      location: 'Location 1',
      sites: [
        { name: 'Site 1', status: 'Online', networkSettings: 'WiFi', detectorConfiguration: 'Default' },
        { name: 'Site 2', status: 'Offline', networkSettings: 'Ethernet', detectorConfiguration: 'Custom' },
      ],
      status: 'Operational',
      contact: 'customer@kamsware.com',
      settings: { notifications: 'Email', alertThresholds: 'High' }
    },
    // Add more clients as needed
  ];
  selectedClient: any;

  onSearch(event: Event) {
    // Implement search functionality
  }

  viewDetails(client: any) {
    this.selectedClient = client;
  }

  viewSiteDetails(site: any) {
    // Implement site details view
  }
}
