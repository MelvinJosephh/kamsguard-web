const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(
    cors({
      origin: 'http://localhost:4200', // Your Angular app's origin
    })
  );

app.post('/save-device', (req, res) => {
    const newDevice = req.body;

    // Read the existing file or create an empty array
    let devices = [];
    if (fs.existsSync('connected-devices.json')) {
        devices = JSON.parse(fs.readFileSync('connected-devices.json', 'utf8'));
    }

    // Check if the device is already in the list
    const existingDevice = devices.find(device => device.systemCamera === newDevice.systemCamera);
    if (!existingDevice) {
        devices.push(newDevice);
        fs.writeFileSync('connected-devices.json', JSON.stringify(devices, null, 2));
        return res.status(201).json({ message: 'Device added', devices });
    }

    return res.status(200).json({ message: 'Device already exists', devices });
});

app.listen(3600, () => {
    console.log('Server running on http://localhost:3600');
});
