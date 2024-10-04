const express = require('express');
const { Router } = require('express');
const cors = require('cors');
const mqttClient = require('../mqttClient');
const connectedDevices = require('../models/connectedDevice'); // Import the model
require('dotenv').config(); // If needed for environment variables

const route = Router();

// Apply CORS middleware
route.use(
  cors({
    origin: ['https://kamsguard-server.vercel.app', 'https://kamsguard-web.vercel.app'],
  })
);

// POST route to save a new connected device
route.post('/save-device', async (req, res) => {
  const { systemCamera, ipAddress, location, siteId, channel, eventType } = req.body;

  if (!systemCamera || !ipAddress || !location || !siteId || !channel || !eventType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if the device with the same systemCamera and siteId already exists
    const existingDevice = await connectedDevices.findOne({ systemCamera, siteId });

    if (existingDevice) {
      return res.status(200).json({ message: 'Device already exists', device: existingDevice });
    }

    // Create a new device since the siteId has changed or it's a new device
    const newDevice = new connectedDevices({
      systemCamera,
      ipAddress,
      location,
      siteId,
      channel,
      eventType,
    });

    // Save the device to MongoDB
    await newDevice.save();

    res.status(201).json({ message: 'Device added', device: newDevice });
  } catch (error) {
    console.error('Error saving device:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Optional: GET route to fetch all connected devices
route.get('/', async (req, res) => {
  try {
    const devices = await connectedDevices.find();
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// MQTT message handler for connected devices
mqttClient.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    // Assuming the MQTT message contains device details
    const { systemCamera, ipAddress, location, siteId, channel, eventType } = data;

    if (!systemCamera || !ipAddress || !location || !siteId || !channel || !eventType) {
      console.warn('Incomplete device data received via MQTT:', data);
      return;
    }

    // Check if the device with the same systemCamera and siteId already exists
    const existingDevice = await connectedDevices.findOne({ systemCamera, siteId });

    if (existingDevice) {
      console.log(`Device ${systemCamera} with siteId ${siteId} already exists. Skipping save.`);
      return;
    }

    // Create and save the new device since siteId is different
    const newDevice = new connectedDevices({
      systemCamera,
      ipAddress,
      location,
      siteId,
      channel,
      eventType,
    });

    await newDevice.save();
    console.log(`New device ${systemCamera} with siteId ${siteId} saved via MQTT.`);
  } catch (error) {
    console.error('Error processing MQTT message for connected devices:', error);
  }
});

module.exports = route;
