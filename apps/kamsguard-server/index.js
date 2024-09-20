const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const mqttClient = require('./mqttClient'); // Import the MQTT client
const configRoute = require('./routes/config');

const cors = require('cors');

dotenv.config();


const app = express();
const port = process.env.PORT
const MONGO_URL = process.env.MONGOURL


mongoose.connect(MONGO_URL).then (()=>{
  console.log("Database connection established")
  app.listen(port, ()=>{
    console.log(`Server listening on ${port}`);
  })
}).catch((error)=> console.log(error));

// Import routes
const notificationRoute = require('./routes/notifications');
const eventsRoute = require('./routes/events');
const connectedDevicesRoute = require('./routes/connected-devices');
const filteredEventsRoute = require('./routes/filtered-events');

//import route
app.use('/api', configRoute);

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to use routes
app.use('/notifications', notificationRoute);
app.use('/events', eventsRoute);
app.use('/connected-devices', connectedDevicesRoute);
app.use('/filtered-events', filteredEventsRoute);

app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);



// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');

  // Send a welcome message to the new client
  ws.send(JSON.stringify({ message: 'Connected to WebSocket server' }));

  // Handle incoming WebSocket messages from clients
  ws.on('message', (message) => {
    console.log(`Received message from WebSocket client: ${message}`);
    // Handle client messages (e.g., subscribe to MQTT topics or send commands)
  });

  // Forward MQTT messages to WebSocket clients
  mqttClient.on('message', (topic, message) => {
    ws.send(JSON.stringify({ topic, message: message.toString() }));
  });

  // Clean up when WebSocket connection closes
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Start the HTTP and WebSocket server
// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
