// routes/connected-devices.js
const express = require('express');
const cors = require('cors');
const ConnectedDevice = require('../models/connectedDevice');
const mqttClient = require('../mqttClient'); // Ensure this path is correct



module.exports = (io) => {
  const router = express.Router();

  // Apply CORS middleware specific to this route
  router.use(
    cors({
      origin: [
        'https://kamsguard-server.vercel.app',
        'https://kamsguard-web.vercel.app',
      ],
      methods: ['GET', 'POST'],
    })
  );

  // GET route to fetch all connected devices
  router.get('/', async (req, res) => {
    try {
      const devices = await ConnectedDevice.find({});
      res.status(200).json(devices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // POST route to save a new connected device (Optional)
  router.post('/save-device', async (req, res) => {
    const { deviceId, siteId, lastActiveTime } = req.body;

    if (!deviceId || !siteId || !lastActiveTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Check if the device with the same deviceId already exists
      const existingDevice = await ConnectedDevice.findOne({ deviceId });

      if (existingDevice) {
        // Update the existing device's lastActiveTime
        existingDevice.lastActiveTime = new Date(lastActiveTime);
        await existingDevice.save();

        // Emit an event to update the frontend in real-time
        io.emit('deviceUpdated', existingDevice);

        return res.status(200).json({ message: 'Device updated', device: existingDevice });
      }

      // Create and save the new device
      const newDevice = new ConnectedDevice({
        deviceId,
        siteId,
        lastActiveTime: new Date(lastActiveTime),
      });

      await newDevice.save();

      // Emit an event to notify the frontend of the new device
      io.emit('deviceAdded', newDevice);

      res.status(201).json({ message: 'Device added', device: newDevice });
    } catch (error) {
      console.error('Error saving device:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // MQTT message handling within the route
  mqttClient.on('message', async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`Received MQTT message on topic ${topic}:`, JSON.stringify(data, null, 2));
      // Extract the necessary fields: siteId, deviceId, lastActiveTime
      if (!data.extended || !Array.isArray(data.extended)) {
        console.warn('No extended array found in MQTT message:', data);
        return;
      }

      for (const outerDevice of data.extended) {
        const { site_id: siteId, time: lastActiveTime } = outerDevice;

        if (!siteId || !lastActiveTime) {
          console.warn('Incomplete outer device data:', outerDevice);
          continue;
        }

        // Iterate over keys to find nested 'extended' arrays
        for (const key in outerDevice) {
          if (['event', 'site_id', 'channel', 'type', 'time', 'unixtime'].includes(key)) {
            continue;
          }

          const nestedObj = outerDevice[key];

          if (nestedObj && typeof nestedObj === 'object' && Array.isArray(nestedObj.extended)) {
            const nestedExtended = nestedObj.extended;

            for (const nestedDevice of nestedExtended) {
              const { site_id: deviceId, time } = nestedDevice;

              if (!deviceId || !time) {
                console.warn('Incomplete nested device data:', nestedDevice);
                continue;
              }

              const parsedTime = new Date(time);

              // Upsert the device in the database
              const updatedDevice = await ConnectedDevice.findOneAndUpdate(
                { deviceId },
                {
                  siteId,
                  lastActiveTime: parsedTime,
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
              );

              console.log(`Processed device ${deviceId}: LastActiveTime=${parsedTime.toISOString()}`);

              // Emit real-time event to frontend
              io.emit('deviceUpdated', updatedDevice);
            }
          } else {
            console.warn(`No nested extended array found for key '${key}' in outerDevice:`, outerDevice);
          }
        }
      }
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  });

  return router;
};
