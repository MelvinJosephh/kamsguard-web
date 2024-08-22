const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
const moment = require('moment');
const app = express();
const fs = require('fs');
const path = require('path');
app.use(express.json());
const cors = require('cors');

const notificationsFilePath = path.join(__dirname, 'db.json');

require('dotenv-mono').load();

app.use(
  cors({
    origin: 'http://localhost:4200', // Your Angular app's origin
  })
);

// Endpoint to get notifications
app.get('/notifications', (req, res) => {
  try {
    const notifications = readNotificationsFromFile();
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Error retrieving notifications' });
  }
});

// Helper function to read notifications from the JSON file
function readNotificationsFromFile() {
  if (fs.existsSync(notificationsFilePath)) {
    const data = fs.readFileSync(notificationsFilePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// Helper function to write notifications to the JSON file
function writeNotificationsToFile(notifications) {
  fs.writeFileSync(
    notificationsFilePath,
    JSON.stringify(notifications, null, 2),
    'utf8'
  );
}

// Email configuration
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

// Helper function to get HTTP client
function getHttpClient(ipAddress, userName, password) {
  return axios.create({
    baseURL: `http://${ipAddress}`,
    auth: {
      username: userName,
      password: password,
    },
    responseType: 'arraybuffer', // for binary data
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0)',
      Authorization:
        'Basic ' + Buffer.from(`${userName}:${password}`).toString('base64'),
    },
  });
}

// Endpoint to receive events and send email
app.post('/send-email', async (req, res) => {
  // console.log('Received request body:', req.body);
  const { subject, eventType, siteId, timestamp } = req.body;

  // Map siteId to a more readable value if needed
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

  // Map event types to camera IDs or URLs if needed
  const cameraId = 1;
  const ipAddress = '192.168.1.70';
  const userName = process.env.CAMERA_USER;
  const password = process.env.CAMERA_PASS;

  try {
    const client = getHttpClient(ipAddress, userName, password);
    const url = `/cgi-bin/display_pic.cgi?cam=${cameraId}&fields=1&res=hi`;

    // Fetch image stream and convert to base64
    const response = await client.get(url);
    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');

    // Prepare and send email with embedded image
    const formattedTimestamp = moment(timestamp).format('lll');
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
 <p>Contact us (Mo-Th 07:00 to 17:30, Fr 07:00 to 14:30): +254 88-99-909090</p>

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

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res
          .status(500)
          .json({ status: 'error', message: 'Error sending notification' });
      } else {
        console.log('Email sent:', info.response);

        // Save notification to the JSON file
        const notifications = readNotificationsFromFile();
        notifications.push({
          subject,
          eventType: eventType,
          siteId: mappedSiteId,
          timestamp: formattedTimestamp,
          notificationType: 'Email',
          status: 'Sent',
        });
        writeNotificationsToFile(notifications);

        res
          .status(200)
          .json({ status: 'success', message: 'Notification sent' });
      }
    });
  } catch (error) {
    console.error('Error fetching the image:', error);
    res.status(500).json({ status: 'error', message: 'Error fetching image' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Notification server running on port ${port}`);
});
