const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors({
  origin: 'http://localhost:4200', 
}));
app.use(express.static('public')); // Serve static files if needed

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Start streaming from camera using ffmpeg
  const ffmpeg = exec('ffmpeg -f mjpeg -analyzeduration 1000000 -probesize 5000000 -i http://192.168.1.70/display_pic.cgi?cam=1&format=mjpeg -f mpegts -codec:v libx264 -preset ultrafast -tune zerolatency pipe:1');
  ffmpeg.stdout.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data, { binary: true });
    }
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg error: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg process closed with code ${code}`);
  });

  ws.on('message', (message) => {
    console.log('Received message:', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    ffmpeg.kill(); // Stop streaming when client disconnects
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(8080, () => {
  console.log('WebSocket server running on ws://localhost:8080');
});
