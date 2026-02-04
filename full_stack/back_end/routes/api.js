const express = require('express');
const router = express.Router();
const textbelt = require('../controllers/textBelt');
const telemetry = require('../controllers/nodeTelemetry');


//TODO:
//This functionality was moved to controllers. Routes will be repurposed to scale with users
//and add user side config changes to the nodes. 

// Health check
// GET /api
router.get('/', (req, res) => {
    res.send('API is running'); 
});

router.get('/telemetry', (req, res) => {
    res.send("Calling telemetry");
    telemetry.amListening();
});


// Trigger alert manually (curl demo)
// GET /api/check-alert?temp=95&humidity=65
router.get('/check-alert', async (req, res) => {
    try {
        const temp = req.query.temp ? Number(req.query.temp) : 95;
        const humidity = req.query.humidity
            ? Number(req.query.humidity)
            : null;

        const result = await textbelt.checkAndAlert(
            'pico1',
            temp,
            humidity
        );

        res.json({
            success: true,
            input: {
                deviceId: 'pico1',
                tempF: temp,
                humidity
            },
            result
        });
    } catch (err) {
        console.error('[API ERROR]', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;
