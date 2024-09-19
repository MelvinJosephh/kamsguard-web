// In a new file, e.g., `routes/config.js`
const express = require('express');
const router = express.Router();
const environment = require('../environment');

router.get('/config', (req, res) => {
    console.log('Config route accessed');
  res.json({
    mqtt: environment.mqtt
  });
});

module.exports = router;
