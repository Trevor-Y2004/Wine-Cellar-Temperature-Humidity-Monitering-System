const express = require('express');
const app = express();
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