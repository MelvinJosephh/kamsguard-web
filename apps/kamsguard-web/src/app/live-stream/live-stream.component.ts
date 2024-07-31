import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Hls from 'hls.js';

@Component({
  selector: 'app-live-stream',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss'],
})
export class LiveStreamComponent implements OnInit {
  ngOnInit(): void {
    const video = document.getElementById('liveVideo') as HTMLVideoElement;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // iOS or Safari
      video.src = 'http://192.168.1.70/display_pic.cgi?cam=1&res=hi&format=h264';
    } else if (Hls.isSupported()) {
      // Other browsers
      const hls = new Hls();
      hls.loadSource('http://192.168.1.70/display_pic.cgi?cam=1&res=hi&format=h264');
      hls.attachMedia(video);
    } else {
      console.error('This browser does not support HLS.');
    }
  }
}
