const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  subject: String,
  eventType: String,
  siteId: String,
  timestamp: { type: Date, default: Date.now },
  notificationType: String,
  status: String
});

module.exports = mongoose.model('Notification', notificationSchema);
