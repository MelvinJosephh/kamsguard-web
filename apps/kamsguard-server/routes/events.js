const express = require('express');
const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mqttClient = require('../mqttClient'); 

const route = Router();

route.use(
  cors({
    origin: 'http://localhost:4200',
  })
);

route.use(bodyParser.json());

let events = [];

const dbPath = path.join(__dirname, '../database/events.json');
if (fs.existsSync(dbPath)) {
  events = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

route.get('/', (req, res) => {
  res.json(events);
});

route.post('/events', (req, res) => {
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

route.delete('/events/:id', (req, res) => {
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

// MQTT configuration and event handling
mqttClient.on('connect', () => {
  console.log('MQTT connected');
  mqttClient.subscribe('NetVu/Kamsware-FV3/event/#', (err) => {
    if (err) {
      console.error('MQTT subscribe error:', err);
    }
  });
});

mqttClient.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const { value, extended } = data;

    if (value === 1 && extended && extended.length) {
      extended.forEach((event) => {
        const { event: eventName, site_id, time, isCritical, regions, ...alarmDetails } = event;

        for (const key in alarmDetails) {
          if (alarmDetails[key]?.extended) {
            alarmDetails[key].extended.forEach((nestedEvent) => {
              const nestedDetails = { ...nestedEvent, parentEvent: eventName };
              const eventId = `${nestedEvent.event}-${nestedEvent.site_id}-${nestedEvent.time}`;
              let thresholds = [];

              if (nestedEvent.event === 'THERMAL1' || nestedEvent.event === 'THERMAL2') {
                if (nestedEvent.regions) {
                  thresholds = nestedEvent.regions
                    .filter((region) => region.trigger === true)
                    .map((region) => ({
                      threshold: region.threshold,
                      peak: region.peak,
                      mean: region.mean,
                      topleft: region.topleft,
                      botright: region.botright,
                    }));
                }

                const eventData = {
                  id: eventId,
                  eventType: nestedEvent.event,
                  siteId: nestedEvent.site_id,
                  timestamp: nestedEvent.time,
                  details: { ...nestedDetails, thresholds },
                  thresholds,
                };
                events.push(eventData);
                fs.writeFileSync(dbPath, JSON.stringify(events, null, 2));
              } else {
                const eventData = {
                  id: eventId,
                  eventType: nestedEvent.event,
                  siteId: nestedEvent.site_id,
                  timestamp: nestedEvent.time,
                  details: nestedDetails,
                  ...nestedDetails,
                };
                events.push(eventData);
                fs.writeFileSync(dbPath, JSON.stringify(events, null, 2));
              }
            });
          }
        }
      });
    }
  } catch (e) {
    console.error('Error processing MQTT message', e);
  }
});

module.exports = route;
