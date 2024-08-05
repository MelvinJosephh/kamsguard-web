import { Component, OnInit } from '@angular/core';
import { DetectorService } from '../services/detector/detector.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-connected-devices',
  imports: [SharedModule],
  templateUrl: './connected-devices.component.html',
  styleUrls: ['./connected-devices.component.scss']
})
export class ConnectedDevicesComponent implements OnInit {
  cameras: any[] = [];  // Define the type according to your API response
  targetPhysCameraNum: number | undefined;  // Replace with your target number or dynamically set

  constructor(private connectedDevicesService: DetectorService) {}

  ngOnInit(): void {
    this.loadCameras();
  }
  
  loadCameras(): void {
    this.connectedDevicesService.getCameraList().subscribe(
      (data: any) => {
        this.cameras = data.cameras;
      },
      (error) => {
        console.error('Error loading cameras', error);
        console.error('Raw response:', error.error.text);
      }
    );
  }
  
  

  viewDetails(camera: any): void {
    // Implement view details logic here
  }
}
