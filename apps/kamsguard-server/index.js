const express = require('express');
const http = require('http');
const https = require('https');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const mqttClient = require('./mqttClient');
const configRoute = require('./routes/config');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

const app = express();
const port = process.env.PORT;

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.EVENTSMONGOURL);
    console.log('MongoDB connected for events');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if connection fails
  }
};

// Call connectDB before starting the server
connectDB();

// Import routes
const notificationRoute = require('./routes/notifications');
const eventsRoute = require('./routes/events');
const connectedDevicesRoute = require('./routes/connected-devices');


app.use(
  cors({
    origin: ['http://localhost:4200', 'http://212.2.246.131', 'http://kamsguard-web.vercel.app'], 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);


// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to use routes
app.use('/notifications', notificationRoute);
app.use('/events', eventsRoute);

app.use('/notifications', createProxyMiddleware({
  target: 'http://212.2.246.131',
  changeOrigin: true,
  secure: false,
}));

app.use('/events', createProxyMiddleware({
  target: 'http://212.2.246.131',
  changeOrigin: true,
  secure: false,
}));

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket logic
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  // Send an initial message to the client
  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server' }));

  // Handle messages received from the client
  ws.on('message', (message) => {
    console.log('Received message from client:', message);

    // Optionally, process the received message
    // For now, we'll echo it back to the client
    ws.send(`Server received: ${message}`);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  // Handle WebSocket errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Function to broadcast messages to all connected WebSocket clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// MQTT logic to broadcast messages to WebSocket clients
mqttClient.on('message', (topic, message) => {
  try {
    const eventData = JSON.parse(message.toString());
    console.log('Received MQTT message:', eventData);

    // You can customize the broadcast data structure as needed
    broadcast({ type: 'MQTT_EVENT', event: eventData });
  } catch (error) {
    console.error('Error parsing MQTT message:', error);
  }
});

// Start the HTTP server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
