import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DetectorService } from '../services/detector/detector.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { CamFailEvent, ConnectedDevice } from '../models/detector.model';
import { Subscription } from 'rxjs';


@Component({
  standalone: true,
  selector: 'app-connected-devices',
  imports: [MatCardModule, CommonModule, MatTableModule],
  templateUrl: './connected-devices.component.html',
  styleUrls: ['./connected-devices.component.scss']
})
export class ConnectedDevicesComponent implements OnInit, OnDestroy {
  connectedDevices: MatTableDataSource<ConnectedDevice> = new MatTableDataSource<ConnectedDevice>([]);
  camFailEvents: MatTableDataSource<CamFailEvent> = new MatTableDataSource<CamFailEvent>([]);
  private subscriptions: Subscription = new Subscription();

  constructor(private detectorService: DetectorService) {}

  ngOnInit(): void {
    this.subscribeToCamFail();
    this.subscribeToReportData();
  }

  private subscribeToCamFail(): void {
    this.detectorService.camFail$.subscribe(data => {
      this.updateCamFailEvents(data);
    });
  }

  private subscribeToReportData(): void {
    this.subscriptions.add(
      this.detectorService.report$.subscribe(data => {
        this.updateConnectedDevices(data);
      })
    );
  }  

  private updateConnectedDevices(device: ConnectedDevice): void {
    this.connectedDevices.data = [...this.connectedDevices.data, device];
  }

  private updateCamFailEvents(event: CamFailEvent): void {
    this.camFailEvents.data = [...this.camFailEvents.data, event];
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}