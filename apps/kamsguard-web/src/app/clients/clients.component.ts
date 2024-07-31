import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent {
  clients = [
    // Sample client data
    {
      name: 'Client 1',
      location: 'Location 1',
      sites: [
        { name: 'Site 1', status: 'Online', networkSettings: 'WiFi', detectorConfiguration: 'Default' },
        { name: 'Site 2', status: 'Offline', networkSettings: 'Ethernet', detectorConfiguration: 'Custom' },
      ],
      status: 'Operational',
      contact: 'contact1@example.com',
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
