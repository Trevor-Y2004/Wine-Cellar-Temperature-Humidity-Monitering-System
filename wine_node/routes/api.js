const express = require('express');
const router = express.Router();
const collections = require('../controllers/collections');


// Health check
// GET /api
router.get('/', (req, res) => {
    res.send('API is running');
});

// Trigger alert manually (curl demo)
// GET /api/check-alert?temp=95&humidity=65
router.get('/check-alert', async (req, res) => {
    try {
        const temp = req.query.temp ? Number(req.query.temp) : 95;
        const humidity = req.query.humidity
            ? Number(req.query.humidity)
            : null;

        const result = await collections.checkAndAlert(
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
