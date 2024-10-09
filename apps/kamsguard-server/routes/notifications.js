const express = require('express');
const { Router } = require('express');
const moment = require('moment');
const nodemailer = require('nodemailer');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
// const route = Router();
require('dotenv').config();
const mqttClient = require('../mqttClient');
const Notification = require('../models/notifications');

module.exports = (io) => {
  const router = express.Router();


router.use(
  cors({
    origin: ['https://kamsguard-server.vercel.app', 'https://kamsguard-web.vercel.app', 'http://localhost:4200'],
  })
);


const transporter = nodemailer.createTransport({
  service: 'kamsware',
  host: 'mail.kamsware.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function getHttpClient(ipAddress, userName, password) {
  return axios.create({
    baseURL: `http://${ipAddress}`,
    auth: {
      username: userName,
      password: password,
    },
    responseType: 'arraybuffer',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0)',
      Authorization:
        'Basic ' + Buffer.from(`${userName}:${password}`).toString('base64'),
    },
  });
}

router.post('/send-email', async (req, res) => {
  const { subject, eventType, siteId, timestamp } = req.body;

  const mappedSiteId = siteId.replace('1-Kamsware-FV3', 'Kamsware');
  const eventMapping = {
    HIGH_MOVEMENT: 'High Movement Detected',
    SMOKE: 'Smoke Detected',
    FLAME: 'Flame Detected',
    THERMAL1: 'Thermal Warning',
    THERMAL2: 'Thermal Anomaly Detected',
    LOW_LIGHT: 'Low contrast alert',
    HIGH_LIGHT: 'High contrast alert',
  };

  const mappedEventType = eventMapping[eventType] || eventType;

  const cameraId = 1;
  const ipAddress = '192.168.1.70';
  const userName = process.env.CAMERA_USER;
  const password = process.env.CAMERA_PASS;

  try {
    const client = getHttpClient(ipAddress, userName, password);
    const url = `/cgi-bin/display_pic.cgi?cam=${cameraId}&fields=1&res=hi`;

    const response = await client.get(url);
    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');

    const formattedTimestamp = moment(timestamp).format('lll');

    console.log('sender', process.env.EMAIL_USER);
    const mailOptions = {
      from: `Kamsguard Support: ${process.env.EMAIL_USER}`,
      to: 'melvin.njuguna@kamsware.com',
      subject: subject || 'No Subject',
      html: `<table style="border:0" cellpadding="10px" cellspacing="0px" width="100%">
  <tr>
     <td>
        <table style="border:0" cellpadding="10px" cellspacing="0px" width="800px">
           <tr>
           <p>${mappedEventType} from Camera ${cameraId} at ${mappedSiteId} on ${formattedTimestamp}.</p>
           <p>Please take appropriate action if necessary.</p>
           </tr>
           <tr>
              <td><img src="data:image/jpeg;base64,${imageBase64}"></td>  <!-- Embedded image -->
           </tr>
        </table>
     </td>
  </tr>
  <tr>
  <td>
  <p>This is an automated email, and responses to this message are not monitored. For further assistance, please contact our support team at kamsguard.</p>
  <p>Contact our support: <a href="https://devkamsware.atlassian.net/servicedesk/customer/portal/2">Kamsware Service Desk</a></p>
  <p>Write us an E-Mail: <a href="mailto:servicedesk@kamsware.com">servicedesk@kamsware.com</a></p>
   <p>Contact us (Mo-Th 07:00 to 17:30, Fr 07:00 to 14:30): +49 5251 6868 372 </p>
  
  </td>
  </tr>
  <tr>
     <td> Kamsware Consult UG<br>  Brandenburger Weg 12 <br>  33102 Paderborn, Germany <br>
     </td>
  </tr>
  <tr>
     <td><img width="150" src="https://kamsware.com/wp-content/uploads/2024/04/Kamsware-Logo.png"></td>
  </tr>
  </table>`,
    };
    await transporter.sendMail(mailOptions);

    const newNotification = new Notification({
      subject,
      eventType: mappedEventType,
      siteId: mappedSiteId,
      timestamp: formattedTimestamp,
      notificationType: 'Email',
      status: 'Sent',
    });
    await newNotification.save();

    res.status(200).json({ status: 'success', message: 'Notification sent' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error sending notification or fetching image',
    });
  }
});

//Route to get all notifications from mongo
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find(); // Fetch from MongoDB
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Error retrieving notifications' });
  }
});

// MQTT message handler
mqttClient.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  const { value, extended } = data;

  if (value === 1 && extended && extended.length) {
    extended.forEach((event) => {
      const { event: eventName, site_id, time, ...details } = event;
      for (const key in details) {
        if (details[key]?.extended) {
          details[key].extended.forEach((nestedEvent) => {
            const nestedDetails = { ...nestedEvent, parentEvent: eventName };
            handleEvent(
              nestedEvent.event,
              nestedEvent.site_id,
              nestedEvent.time,
              nestedDetails
            );
          });
        }
      }
      // handleEvent(eventName, site_id, time, details);
    });
  }
});

// function handleEvent(eventName, siteId, time, nestedEvent, nestedDetails) {
//   Notification.findOne({
//     eventType: eventName,
//     siteId: siteId,
//     timestamp: time,
//   }).then((existingNotification) => {
//     if (!existingNotification) {
//       const newNotification = new Notification({
//         timestamp: nestedEvent.time,
//         eventType: nestedEvent.event,
//         siteId: nestedEvent.site_id,
//         notificationType: 'Email',
//         status: 'Pending',
//       });

//       newNotification.save().then(() => {
//         sendEmailNotification(newNotification, nestedDetails);
//       });
//     }
//   });
// }
// function sendEmailNotification(notification, details) {
//   const emailData = {
//     subject: `Alarm Alert!`,
//     eventType: notification.eventType,
//     timestamp: notification.timestamp,
//     siteId: notification.siteId,
//     details: details,
//   };

//   axios
//     .post('http://localhost:3200/notifications/send-email', emailData)
//     .then((response) => {
//       console.log('Email sent:', response.data);
//       Notification.findOneAndUpdate(
//         {
//           timestamp: notification.timestamp,
//           eventType: notification.eventType,
//           siteId: notification.siteId,
//         },
//         { status: 'Sent' },
//         { new: true }
//       );
//     })
//     .catch((error) => {
//       console.error('Error sending email:', error);
//       Notification.findOneAndUpdate(
//         {
//           timestamp: notification.timestamp,
//           eventType: notification.eventType,
//           siteId: notification.siteId,
//         },
//         { status: 'Failed' },
//         { new: true }
//       );
//     });
// }


function handleEvent(eventName, siteId, time, nestedEvent, nestedDetails) {
  Notification.findOne({
    eventType: eventName,
    siteId: siteId,
    timestamp: time,
  }).then((existingNotification) => {
    if (!existingNotification) {
      // No need to save here, we will do it after email is sent
      const newNotification = {
        timestamp: nestedEvent.time,
        eventType: nestedEvent.event,
        siteId: nestedEvent.site_id,
        notificationType: 'Email',
        status: 'Pending', // Initially set status to Pending
      };

      // Send email first, then save the notification
      sendEmailNotification(newNotification, nestedDetails);
    }
  });
}

function sendEmailNotification(notification, details) {
  const emailData = {
    subject: `Alarm Alert!`,
    eventType: notification.eventType,
    timestamp: notification.timestamp,
    siteId: notification.siteId,
    details: details,
  };

  axios
    .post('http://localhost:3200/notifications/send-email', emailData)
    .then((response) => {
      console.log('Email sent:', response.data);

      // Now save the notification with status 'Sent' after the email is successfully sent
      const notificationToSave = new Notification({
        ...notification,
        status: 'Sent', // Update status to Sent
      });

      notificationToSave.save();
    })
    .catch((error) => {
      console.error('Error sending email:', error);

      // Save with status 'Failed' if the email sending fails
      const notificationToSave = new Notification({
        ...notification,
        status: 'Failed', // Update status to Failed
      });

      notificationToSave.save();
    });
}



return router;
};