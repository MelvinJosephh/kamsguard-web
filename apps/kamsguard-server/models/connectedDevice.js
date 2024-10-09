// models/connectedDevice.js
const mongoose = require('mongoose');

const connectedDeviceSchema = new mongoose.Schema({
  siteId: { type: String, required: true, index: true },          // Outer site identifier (e.g., "Kamsware-FV3")
  deviceId: { type: String, required: true, unique: true, index: true },        // Nested device identifier (e.g., "1-Kamsware-FV3")
  lastActiveTime: { type: Date, required: true },    // Timestamp of the last activity
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('ConnectedDevice', connectedDeviceSchema);
