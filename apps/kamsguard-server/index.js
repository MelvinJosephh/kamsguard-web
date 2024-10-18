// index.js
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const mqttClient = require('./mqttClient');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.EVENTSMONGOURL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('MongoDB connected for events');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if connection fails
  }
};

// Call connectDB before starting the server
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply CORS middleware
app.use(
  cors({
    origin: [
      'https://kamsguard-server.vercel.app',
      'https://kamsguard-web.vercel.app',
      'http://localhost:4200'
    ],
    methods: ['GET', 'POST'],
  })
);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with the HTTP server
const io = new Server(server, {
  cors: {
    origin: [
      'https://kamsguard-server.vercel.app',
      'https://kamsguard-web.vercel.app',
      'http://localhost:4200'
    ],
    methods: ['GET', 'POST'],
  },
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Optionally, send a welcome message
  socket.emit('message', { message: 'Welcome to the Socket.io server' });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Handle custom events from clients if needed
  socket.on('clientEvent', (data) => {
    console.log('Received clientEvent:', data);
    // Process data or emit to other clients
  });
});

// Import routes, passing the Socket.io instance
const notificationRoute = require('./routes/notifications')(io);
const eventsRoute = require('./routes/events')(io);
const connectedDevicesRoute = require('./routes/connected-devices')(io);

console.log("Routes initialized");

// Use routes
app.use('/notifications', notificationRoute);
app.use('/events', eventsRoute);
app.use('/connected-devices', connectedDevicesRoute);

// Proxy middleware configurations
app.use('/notifications', createProxyMiddleware({
  target: 'https://kamsguard-server.vercel.app',
  changeOrigin: true,
  secure: false,
}));

app.use('/events', createProxyMiddleware({
  target: 'https://kamsguard-server.vercel.app',
  changeOrigin: true,
  secure: false,
}));

// app.use('/connected-devices', createProxyMiddleware({
//   target: 'https://kamsguard-server.vercel.app',
//   changeOrigin: true,
//   secure: false,
// }));

// MQTT logic to emit events via Socket.io
mqttClient.on('message', (topic, message) => {
  try {
    const eventData = JSON.parse(message.toString());
    console.log('Received MQTT message:', eventData);

    // Emit the MQTT event to all connected Socket.io clients
    io.emit('MQTT_EVENT', eventData);
  } catch (error) {
    console.error('Error parsing MQTT message:', error);
  }
});

// Start the HTTP server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
