const express = require('express');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');  // Add axios for fetching the image
const app = express();
app.use(express.json());
const cors = require('cors');

require('dotenv-mono').load();

app.use(cors({
  origin: 'http://localhost:4200', // Your Angular app's origin
}));

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

// Endpoint to receive events
app.post('/send-email', async (req, res) => {

  // declared replacement ID
  const newId = "Kamsware";

  // Extract the values from the request body
  let { subject, eventType, siteId, timestamp } = req.body;

  // Replace the siteId with the newId
  siteId = newId;

  // Format the timestamp using moment
  const formattedTimestamp = moment(timestamp).format("lll");

  console.log('Received event:', { subject, eventType, siteId, timestamp: formattedTimestamp });

  try {
    // Fetch the image from the camera URL
    const response = await axios.get('http://192.168.1.70/display_pic.cgi?cam=1&res=hi&format=h264', { responseType: 'arraybuffer' });
    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');

    // Embed the image in the email
    const mailOptions = {
      from: `Kamsguard Support: ${process.env.EMAIL_USER}`,
      to: 'melvin.njuguna@kamsware.com',
      subject: subject || 'No Subject',
      html: `<table style="border:0" cellpadding="10px" cellspacing="0px" width="100%">
<tr>
   <td>
      <table style="border:0" cellpadding="10px" cellspacing="0px" width="800px">
         <tr>
         <p>${eventType} from ${siteId} on ${formattedTimestamp}.</p>
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
This is an automated email, and responses to this message are not monitored. For further assistance, please contact our support team at kamsguard.
</td>
</tr>
<tr>
      <td colspan="2">
         <p>Contact our support: <a href="https://devkamsware.atlassian.net/servicedesk/customer/portal/2">Kamsware Service Desk</a></p>
      </td>
</tr>
<tr>
      <td colspan="2">
         <p>Write us an E-Mail: <a href="mailto:servicedesk@kamsware.com">servicedesk@kamsware.com</a></p>
      </td>
</tr>
<tr>
   <td colspan="2">
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

    // Send the email notification
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ status: 'error', message: 'Error sending notification' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ status: 'success', message: 'Notification sent' });
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
