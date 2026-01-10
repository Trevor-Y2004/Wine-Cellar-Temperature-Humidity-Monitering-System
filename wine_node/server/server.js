const express = require('express');
const mqtt = require('mqtt');

const app = express();
const PORT = 3000;
//replace ip with the ip of your machine on the LAN
const MQTT_BROKER_URL = 'mqtt://192.168.86.34:1883';
//const MQTT_BROKER_URL = 'mqtt://mqtt:1883';

const client = mqtt.connect(MQTT_BROKER_URL);

//connect to mqtt broker
client.on('connect', () => {
    console.log('I connected')
    client.subscribe('iot/telemetry', (e) => {
        if (e) {
            console.error(e);
        }
    });

});

//listen for messages
client.on('message', (topic, message) => {
    //pico passes an encoded byte-string 
    const payload = JSON.parse(message.toString('utf-8'));

    console.log(`Recieved message on ${topic} from ${payload.deviceID}: tempF=${payload.tempF}`);
});


//-----------everything below this is express and http - needs substantial iteration-------

app.use(express.json()); //data will be sent as json objects from the pico to the server

app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!<h1>');
});

//Pico endpoints
const latestDevice = {};

app.post("/api/telemetry", (req, res) => {
    //brevity check
    console.log("Raw Telemetry: ", req.body);

    const { deviceId, tempF, humidity } = req.body;
    //preliminary error checks
    if (!deviceId) return res.status(400).json({ error: "deviceId required" });
    if (tempF == undefined) return res.status(400).json({ error: "tempF required" });

    //allow humidity to be an optional field(one device doesnt measure humidity)
    latestDevice[deviceId] = {
        deviceId,
        tempF,
        ...(humidity !== undefined ? { humidity } : {}),
        ts: Date.now()
    };
    res.sendStatus(200);
});

//will handle the API calls
app.post("/api/threshold", (req, res) => {
    console.log("I will handle API calls.")
})

app.get("/api/status", (req, res) => {
    res.json(Object.values(latestDevice));
    console.log("I really hope this shit works")
});

//scaffolding for future routes
// Include route files
const usersRoute = require('../routes/users');
const productsRoute = require('../routes/products');
const API_Routes = require('../routes/api')

// User routes
app.use('/users', usersRoute);
app.use('/products', productsRoute);
app.use('/telemtry', API_Routes)
app.use('/threshold', API_Routes)
app.use('/status', API_Routes)


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})