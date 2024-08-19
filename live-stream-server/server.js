const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3001; // Correct port

app.use(cors({
  origin: 'http://localhost:4200', // Your Angular app's origin
}));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files if needed
app.use(express.static(path.join(__dirname, 'public')));

// // In-memory storage for events
// let events = [];

// Load existing events from events.json if it exists
const dbPath = path.join(__dirname, 'events.json');
if (fs.existsSync(dbPath)) {
  events = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// Route to get all events
app.get('/events', (req, res) => {
  res.json(events);
});

// Route to save an event
app.post('/events', (req, res) => {
  try {
    const event = req.body;

    // Validate the event object
    if (!event.timestamp || !event.eventType || !event.siteId) {
      return res.status(400).json({ error: 'Invalid event data' });
    }

    // // Add the new event to the in-memory array
    // events.push(event);

    // Save to db.json file
    fs.writeFileSync(dbPath, JSON.stringify(events, null, 2));

    res.status(201).json({ message: 'Event saved successfully' });
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
