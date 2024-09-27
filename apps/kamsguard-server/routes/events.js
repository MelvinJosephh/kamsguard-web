const express = require('express');
const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const Event = require('../models/events');
const mqttClient = require('../mqttClient'); 

const route = Router();

route.use(
  cors({
    origin: ['http://kamsguard-web.vercel.app', 'http://localhost:4200', 'https://kamsguard-server.vercel.app'],
  })
);


// GET route to fetch events from MongoDB
route.get('/', async (req, res) => {
  try {
    const events = await Event.find(); // Fetch all events from MongoDB
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST route to create a new event
route.post('/', async (req, res) => {
  try {
    const { timestamp, eventType, siteId, details } = req.body;

    if (!timestamp || !eventType || !siteId) {
      return res.status(400).json({ error: 'Invalid event data' });
    }

    const newEvent = new Event({
      id: uuidv4(),  // If you want to retain custom id
      timestamp,
      eventType,
      siteId,
      details,
    });

    await newEvent.save();  // Save event to MongoDB

    // WebSocket broadcast after event is saved
    broadcast({ type: 'NEW_EVENT', event: newEvent });

    res.status(201).json({ message: 'Event saved successfully', event: newEvent });
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// DELETE route to remove an event by ID
route.delete('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await Event.findOneAndDelete({ id: eventId }); // Delete event by ID from MongoDB

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

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

mqttClient.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const { value, extended } = data;

    if (value === 1 && extended && extended.length) {
      extended.forEach(async (event) => {
        const { event: eventName, site_id, time, isCritical, regions, ...alarmDetails } = event;

        for (const key in alarmDetails) {
          if (alarmDetails[key]?.extended) {
            alarmDetails[key].extended.forEach(async (nestedEvent) => {
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
              }

              const eventData = new Event({
                id: eventId,
                eventType: nestedEvent.event,
                siteId: nestedEvent.site_id,
                timestamp: nestedEvent.time,
                details: { ...nestedDetails, thresholds },
                thresholds,
              });

              await eventData.save(); // Save the event data directly to MongoDB
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
