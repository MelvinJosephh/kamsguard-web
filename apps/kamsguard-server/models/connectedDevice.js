// models/connectedDevice.js
const mongoose = require('mongoose');

const connectedDeviceSchema = new mongoose.Schema({
  siteId: { type: String, required: true },          // Outer site identifier (e.g., "Kamsware-FV3")
  deviceId: { type: String, required: true },        // Nested device identifier (e.g., "1-Kamsware-FV3")
  status: { type: String, required: true },          // Device status: 'Online' or 'Offline'
  lastActiveTime: { type: string, required: true },    // Timestamp of the last activity
  // Add other fields if necessary
});

module.exports = mongoose.model('ConnectedDevice', connectedDeviceSchema);
