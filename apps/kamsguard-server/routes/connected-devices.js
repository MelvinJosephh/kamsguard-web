const express = require('express');

const { Router } = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const route = Router();
app.use(express.json());

route.use(
    cors({
      origin: 'http://localhost:4200', 
    })
  );

route.post('/save-device', (req, res) => {
    const newDevice = req.body;

    let devices = [];
    if (fs.existsSync('connected-devices.json')) {
        devices = JSON.parse(fs.readFileSync('connected-devices.json', 'utf8'));
    }

    const existingDevice = devices.find(device => device.systemCamera === newDevice.systemCamera);
    if (!existingDevice) {
        devices.push(newDevice);
        fs.writeFileSync('connected-devices.json', JSON.stringify(devices, null, 2));
        return res.status(201).json({ message: 'Device added', devices });
    }

    return res.status(200).json({ message: 'Device already exists', devices });
});


module.exports = route;