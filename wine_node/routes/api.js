// routes/products.js
const express = require('express');
const router = express.Router();

// Define a route
router.get('/', (req, res) => {
    res.send('this is an api route');// this gets executed when user visit http://localhost:3000/api
});

router.get('/telemetry', (req, res) => {
    res.send('this is api telemtry route');// this gets executed when user visit http://localhost:3000/api/telemetry
});

router.get('/threshold', (req, res) => {
    res.send('this is api threshold route');// this gets executed when user visit http://localhost:3000/api/threshold
});

router.get('/status', (req, res) => {
    res.send('this is api status route');// this gets executed when user visit http://localhost:3000/api/status
});

// export the router module so that server.js file can use it
module.exports = router;