// mqttClient.js
const mqtt = require('mqtt');
const { mqtt: mqttConfig } = require('./environment'); // Corrected import

// Construct the WebSocket URL
const wsUrl = `${mqttConfig.protocol}://${mqttConfig.hostname}:${mqttConfig.port}${mqttConfig.path}`;

// Create an MQTT client instance
const client = mqtt.connect(wsUrl, {
  username: mqttConfig.mqttUser,
  password: mqttConfig.mqttPass,
  clientId: `server_${Math.random().toString(16).substr(2, 8)}`, // Generate a unique client ID
});

client.on('connect', () => {
  console.log('Connected to MQTT broker via WebSocket');
  // Subscribe to a topic (replace with your desired topic)
  client.subscribe('NetVu/#', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topic: NetVu/#');
    }
  });
});

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
  // You can process the message or emit it to WebSocket clients here
});

client.on('error', (err) => {
  console.error('MQTT Error:', err);
});

client.on('close', () => {
  console.log('MQTT connection closed');
});

module.exports = client;
