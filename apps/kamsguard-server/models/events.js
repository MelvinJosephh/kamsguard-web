const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
  id: { type: String, required: true },
  timestamp: { type: Date, required: true },
  eventType: { type: String, required: true },
  siteId: { type: String, required: true },
  details: { type: Object, required: true },
  thresholds: { type: Array, default: [] },
});

module.exports = mongoose.model('Event', eventSchema);
