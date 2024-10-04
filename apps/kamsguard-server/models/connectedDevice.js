// models/connectedDevice.js
const mongoose = require('mongoose');

const connectedDeviceSchema = new mongoose.Schema({
  systemCamera: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate devices
  },
  ipAddress: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  siteId: {
    type: String,
    required: true,
  },
  channel: {
    type: Number,
    required: true,
  },
  deviceStatus: {
    type: String,
    enum: ['active', 'inactive', 'error'], // Possible states of the device
    default: 'inactive',
  },
  subchannelStateMask: {
    type: String,
    default: '0x0000', // Example of realistic default state mask
  },
  subchannelChangedMask: {
    type: String,
    default: '0x0000', // Example of default change mask
  },
  eventType: {
    type: String,
    required: true, // Type of event associated with the device
  },
  lastEventTime: {
    type: Date,
    default: Date.now, // Tracks the last event occurrence
  },
  // Timestamps
}, { timestamps: true });

const ConnectedDevice = mongoose.model('ConnectedDevice', connectedDeviceSchema);

module.exports = ConnectedDevice;
