const express = require('express');
const mqtt = require('mqtt');

const app = express();
const PORT = process.env.PORT || 3000;

// MQTT
const MQTT_BROKER_URL = 'mqtt://192.168.86.34:1883';
const client = mqtt.connect(MQTT_BROKER_URL);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('iot/telemetry');
});

client.on('message', (topic, message) => {
    const payload = JSON.parse(message.toString('utf-8'));
    console.log(`Received ${topic}:`, payload);
});

// for express use
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

// in-memory device store
const latestDevice = {};

app.post('/api/telemetry', (req, res) => {
    const { deviceId, tempF, humidity } = req.body;

    if (!deviceId) return res.status(400).json({ error: 'deviceId required' });
    if (tempF === undefined) return res.status(400).json({ error: 'tempF required' });

    latestDevice[deviceId] = {
        deviceId,
        tempF,
        ...(humidity !== undefined ? { humidity } : {}),
        ts: Date.now()
    };

    res.sendStatus(200);
});

app.get('/api/status', (req, res) => {
    res.json(Object.values(latestDevice));
});

// Routes
const usersRoute = require('../routes/users');
const productsRoute = require('../routes/products');
const apiRoutes = require('../routes/api');

app.use('/users', usersRoute);
app.use('/products', productsRoute);
// DELETED THE OTHER LINES
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
