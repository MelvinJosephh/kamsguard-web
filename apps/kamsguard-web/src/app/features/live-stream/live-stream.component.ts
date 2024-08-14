import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss']
})
export class LiveStreamComponent implements OnInit, OnDestroy {
  private ws!: WebSocket;
  private video!: HTMLVideoElement;
  private videoSourceURL!: string;

  ngOnInit(): void {
    this.video = document.getElementById('liveVideo') as HTMLVideoElement;
    if (!this.video) {
      console.error('Video element not found');
      return;
    }

    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.binaryType = 'arraybuffer'; // Set binary type for video data

    this.ws.onmessage = (event) => {
      const arrayBuffer = event.data as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: 'video/mp2t' }); // Use 'video/mp2t' for MPEG-TS format
      const url = URL.createObjectURL(blob);

      // Only update video source if it's different
      if (this.video.src !== url) {
        this.video.src = url;
        this.video.play().catch(error => {
          console.error('Error attempting to play video:', error);
        });
      }
    };

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  startStream() {
    // Ensure video is visible and attempt to play
    if (this.video) {
      this.video.style.display = 'block'; // Show the video element
      this.video.play().catch(error => {
        console.error('Error attempting to play video:', error);
      });
    }
  }

  ngOnDestroy() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
