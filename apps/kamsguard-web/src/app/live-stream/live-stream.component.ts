import { Component, OnInit } from '@angular/core';
import Hls from 'hls.js';

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss']
})
export class LiveStreamComponent implements OnInit {
  ngOnInit(): void {
    const video = document.getElementById('liveVideo') as HTMLVideoElement;
    const videoSrc = 'http://localhost/live/stream.m3u8'; // Adjust URL if needed

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    } else {
      console.error('This browser does not support HLS.');
    }
  }
}
