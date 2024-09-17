const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); 
const app = express();
const port = 3001; 
require('dotenv').config()
const notificationRoutes = require('./routes/notifications');

app.use(
  cors({
    origin: 'http://localhost:4200', 
  })
);


app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));


let events = [];


const dbPath = path.join(__dirname, 'events.json');
if (fs.existsSync(dbPath)) {
  events = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

app.get('/', (req, res) => {
  res.json({message:"Api works"});
});


app.use('/notifications',notificationRoutes)

app.get('/events', (req, res) => {
  res.json(events);
});




app.post('/events', (req, res) => {
  try {
    const event = req.body;

    if (!event.timestamp || !event.eventType || !event.siteId) {
      return res.status(400).json({ error: 'Invalid event data' });
    }

    event.id = uuidv4();

    events.push(event);

    fs.writeFileSync(dbPath, JSON.stringify(events, null, 2));

    res.status(201).json({ message: 'Event saved successfully', event });
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/events/:id', (req, res) => {
  try {
    const eventId = req.params.id;

    events = events.filter(event => event.id !== eventId);

    fs.writeFileSync(dbPath, JSON.stringify(events, null, 2));

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
