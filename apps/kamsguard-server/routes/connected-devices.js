// routes/connectedDevices.js
const express = require('express');
const { Router } = require('express');
const cors = require('cors');
const mqttClient = require('../mqttClient'); // Ensure this is correctly configured
const ConnectedDevice = require('../models/connectedDevice');

const route = Router();

// Apply CORS middleware
route.use(
  cors({
    origin: [
      'https://kamsguard-server.vercel.app',
      'https://kamsguard-web.vercel.app',
    ],
  })
);

// GET route to fetch all connected devices
route.get('/', async (req, res) => {
  try {
    const devices = await ConnectedDevice.find({});
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST route to save a new connected device
// (Not needed based on your requirements, but kept for completeness)
route.post('/save-device', async (req, res) => {
  const { systemCamera, deviceId, siteId, channel, status } = req.body;

  if (!deviceId || !siteId || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if the device with the same deviceId and siteId already exists
    const existingDevice = await ConnectedDevice.findOne({ deviceId, siteId });

    if (existingDevice) {
      return res.status(200).json({ message: 'Device already exists', device: existingDevice });
    }

    // Create and save the new device
    const newDevice = new ConnectedDevice({
      deviceId,
      siteId,
      status,
      lastActiveTime: new Date(),
    });

    await newDevice.save();

    res.status(201).json({ message: 'Device added', device: newDevice });
  } catch (error) {
    console.error('Error saving device:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// MQTT message handler for connected devices
// mqttClient.on('message', async (topic, message) => {
//   try {
//     const data = JSON.parse(message.toString());

//     // Ensure 'extended' is an array
//     if (!data.extended || !Array.isArray(data.extended)) {
//       console.warn('No extended array found in MQTT message:', data);
//       return;
//     }

//     for (const outerDevice of data.extended) {
//       const { site_id: outerSiteId } = outerDevice;

//       // Iterate through keys to find nested extended arrays
//       for (const key in outerDevice) {
//         if (
//           ['event', 'state', 'site_id', 'time', 'channel', 'type', 'unixtime'].includes(key)
//         ) {
//           continue; // Skip known non-nested fields
//         }

//         const nestedObj = outerDevice[key];

//         if (nestedObj && typeof nestedObj === 'object' && Array.isArray(nestedObj.extended)) {
//           const nestedExtended = nestedObj.extended;

//           for (const nestedDevice of nestedExtended) {
//             const { site_id: nestedSiteId, state: nestedState, time: nestedTime } = nestedDevice;

//             if (!nestedSiteId || !nestedState || !nestedTime) {
//               console.warn('Incomplete nested device data:', nestedDevice);
//               continue;
//             }

//             // Map nested site_id to deviceId
//             const deviceId = nestedSiteId;
//             const status = nestedState === 'active' ? 'Online' : 'Offline';
//             const lastActiveTime = new Date(nestedTime);

//             // Find and update the existing device or create a new one
//             const existingDevice = await ConnectedDevice.findOne({ deviceId });

//             if (existingDevice) {
//               existingDevice.status = status;
//               existingDevice.lastActiveTime = lastActiveTime;
//               await existingDevice.save();
//               console.log(`Updated device ${deviceId}.`);
//             } else {
//               const newDevice = new ConnectedDevice({
//                 siteId: outerSiteId, // Use outer site_id
//                 deviceId,
//                 status,
//                 lastActiveTime,
//               });

//               await newDevice.save();
//               console.log(`New device added: ${deviceId}.`);
//             }
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error processing MQTT message:', error);
//   }
// });

// Inside the MQTT message handler
// mqttClient.on('message', async (topic, message) => {
//   try {
//     const data = JSON.parse(message.toString());

//     console.log(`Received MQTT message on topic ${topic}:`, JSON.stringify(data, null, 2));

//     // Ensure 'extended' is an array
//     if (!data.extended || !Array.isArray(data.extended)) {
//       console.warn('No extended array found in MQTT message:', data);
//       return;
//     }

//     for (const outerDevice of data.extended) {
//       const { site_id: outerSiteId } = outerDevice;

//       if (!outerSiteId) {
//         console.warn('No outer site_id found in outerDevice:', outerDevice);
//         continue;
//       }

//       // Iterate through keys to find nested extended arrays
//       for (const key in outerDevice) {
//         if (
//           ['event', 'state', 'site_id', 'time', 'channel', 'type', 'unixtime'].includes(key)
//         ) {
//           continue; // Skip known non-nested fields
//         }

//         const nestedObj = outerDevice[key];

//         if (nestedObj && typeof nestedObj === 'object' && Array.isArray(nestedObj.extended)) {
//           const nestedExtended = nestedObj.extended;

//           for (const nestedDevice of nestedExtended) {
//             const { site_id: nestedSiteId, state: nestedState, time: nestedTime } = nestedDevice;

//             if (!nestedSiteId || !nestedState || !nestedTime) {
//               console.warn('Incomplete nested device data:', nestedDevice);
//               continue;
//             }

//             // Map nested site_id to deviceId
//             const deviceId = nestedSiteId;
//             const status = nestedState === 'active' ? 'Online' : 'Offline';
//             const lastActiveTime = new Date(nestedTime);

//             // Find and update the existing device or create a new one
//             const existingDevice = await ConnectedDevice.findOne({ deviceId });

//             if (existingDevice) {
//               existingDevice.status = status;
//               existingDevice.lastActiveTime = lastActiveTime;
//               await existingDevice.save();
//               console.log(`Updated device ${deviceId}.`);
//             } else {
//               const newDevice = new ConnectedDevice({
//                 siteId: outerSiteId, // Use outer site_id
//                 deviceId,
//                 status,
//                 lastActiveTime,
//               });

//               await newDevice.save();
//               console.log(`New device added: ${deviceId}.`);
//             }
//           }
//         } else {
//           console.warn(`No nested extended array found for key '${key}' in outerDevice:`, outerDevice);
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error processing MQTT message:', error);
//   }
// });


mqttClient.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log(`Received MQTT message on topic ${topic}:`, JSON.stringify(data, null, 2));

    if (!data.extended || !Array.isArray(data.extended)) {
      console.warn('No extended array found in MQTT message:', data);
      return;
    }

    for (const outerDevice of data.extended) {
      const { site_id: outerSiteId, state, time } = outerDevice;

      // Ensure outerDevice has required properties
      if (!outerSiteId || !state || !time) {
        console.warn('Incomplete outer device data:', outerDevice);
        continue;
      }

      for (const key in outerDevice) {
        const nestedObj = outerDevice[key];

        // Only process if the nested object is an array and has expected structure
        if (nestedObj && typeof nestedObj === 'object' && Array.isArray(nestedObj.extended)) {
          for (const nestedDevice of nestedObj.extended) {
            const { site_id: nestedSiteId, state: nestedState, time: nestedTime } = nestedDevice;

            // Ensure nested device has required properties
            if (!nestedSiteId || !nestedState || !nestedTime) {
              console.warn('Incomplete nested device data:', nestedDevice);
              continue;
            }

            const deviceId = nestedSiteId;
            const status = nestedState === 'active' ? 'Online' : 'Offline';
            const lastActiveTime = new Date(nestedTime);

            const existingDevice = await ConnectedDevice.findOne({ deviceId });

            if (existingDevice) {
              existingDevice.status = status;
              existingDevice.lastActiveTime = lastActiveTime;
              await existingDevice.save();
              console.log(`Updated device ${deviceId}.`);
            } else {
              const newDevice = new ConnectedDevice({
                siteId: outerSiteId,
                deviceId,
                status,
                lastActiveTime,
              });

              await newDevice.save();
              console.log(`New device added: ${deviceId}.`);
            }
          }
        } else {
          console.warn(`No valid nested structure found for key '${key}' in outerDevice:`, outerDevice);
        }
      }
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});





module.exports = route;
