// index.js
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const mqttClient = require('./mqttClient');
const cors = require('cors');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.EVENTSMONGOURL);
    console.log('MongoDB connected for events');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Call connectDB before starting the server
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware configuration
const corsOptions = {
  origin: [
    'https://kamsguard-server.vercel.app',
    'https://kamsguard-web.vercel.app',
    'http://localhost:4200'
  ],
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with the HTTP server
const io = new Server(server, {
  cors: corsOptions,
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('message', { message: 'Welcome to the Socket.io server' });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

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

// MQTT logic to emit events via Socket.io
mqttClient.on('message', (topic, message) => {
  try {
    const eventData = JSON.parse(message.toString());
    console.log('Received MQTT message:', eventData);
    io.emit('MQTT_EVENT', eventData);
  } catch (error) {
    console.error('Error parsing MQTT message:', error);
  }
});

// Start the HTTP server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
