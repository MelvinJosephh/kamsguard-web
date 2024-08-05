const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:4200', // Your Angular app's origin
  }));


// Email configuration
const transporter = nodemailer.createTransport({
  service: 'kamsware',
  host: 'mail.kamsware.com',
  port : 465,
  secure: true,
  auth: {
    user: 'melvin.njuguna@kamsware.com',
    pass: 'Password100!!',
  },
});

// Endpoint to receive events
app.post('/send-email', (req, res) => {
  const event = req.body;

  // Log the received event
  console.log('Received event:', event);

  // Define the email content based on the event
  const mailOptions = {
    from: 'Melvin Test',
    to: 'melvin.njuguna@kamsware.com',
    subject: `Event Notification: ${event.eventType}`,
    text: `Details of the event: ${JSON.stringify(event)}`,
  };

  // Send the email notification
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending notification');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Notification sent');
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Notification server running on port ${port}`);
});
