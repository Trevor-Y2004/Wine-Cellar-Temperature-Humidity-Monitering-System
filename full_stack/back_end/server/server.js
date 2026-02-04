require('dotenv').config();
const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors')
const http = require("http");
const { Server } = require("socket.io")

//handle node telemetry
const nodeTelemetry = require("../controllers/nodeTelemetry")
const apiRoutes = require("../routes/api");

//connect the express instance and web socket
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

// MQTT
const MQTT_BROKER_URL = 'mqtt://192.168.86.34:1883';
const client = mqtt.connect(MQTT_BROKER_URL);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('iot/telemetry');
});

client.on("message", (topic, MQTTmessage) => {
    nodeTelemetry.handleMQTTMessage(MQTTmessage, io);
});

app.use(cors()); //enables front end to talk to backend
app.use(express.json()); // for express use

app.use('/api', apiRoutes);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
