const mongoose = require('mongoose');
const { Schema } = mongoose;

const emailNotificationsSchema = new Schema({
    subject: String,
    eventType: String,
    siteId: String,
    timestamp: { type: Date, default: Date.now },
    notificationType: String,
    status: String,
});

module.exports = mongoose.model('emailNotifications', emailNotificationsSchema);
