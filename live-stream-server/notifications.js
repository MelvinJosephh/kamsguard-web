const express = require('express');
const nodemailer = require('nodemailer');
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
  port : 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint to receive events
app.post('/send-email', (req, res) => {
  // const event = req.body;
  const { subject, eventType, siteId, timestamp } = req.body;

  // Log the received event
  // console.log('Received event:', event);
  console.log('Received event:', { subject, eventType, siteId, timestamp });

  // Define the email content based on the event
  const mailOptions = {
    from: `Kamsguard Support: ${process.env.EMAIL_USER}`,
    to: 'melvin.njuguna@.com, elijah.mwangi@kamsware.com',
    subject: subject || 'No Subject',
    html: ` <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pre-Alarm Alert!</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 90%;
                    max-width: 400px;
                    margin: 20px auto;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                }
              
                .details span {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="content">
                    <p>${eventType} at ${siteId} on ${timestamp}.</p>
                    
                    <p>Please take appropriate action if necessary.</p>
                </div>
                <div class="footer">
                    <p>This is an automated email, and responses to this message are not monitored. 
                    For further assistance, 
                    please contact our support team at kamsguard.support</p>
                    <p>&copy; 2024, Kamsguard</p>
                </div>
            </div>
        </body>
        </html>
    `,
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
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Notification server running on port ${port}`);
});
