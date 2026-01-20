const axios = require('axios');


//configuration

const TEXTBELT_API_KEY = 'KEY GOES HERE FOR TESTING'; 
const PHONE_NUMBER = 'INSERT PHONE NUMBER';


// sends SMS messages using the Textbelt api
async function sendSMS(message) {
    try {
        const response = await axios.post('https://textbelt.com/text', {
            phone: PHONE_NUMBER,
            message,
            key: TEXTBELT_API_KEY
        });
        console.log('[Textbelt response]', response.data);
        return response.data;
    } catch (err) {
        console.error('[Textbelt error]', err.message);
        throw err;
    }
}


//checking thresholds and alert

async function checkAndAlert(deviceId, tempF, humidity = null) {
    const LOW_THRESH = 40;
    const HIGH_THRESH = 90;

    const now = new Date();
    const timestamp = now.toLocaleString();

    console.log(`[Check] Device=${deviceId}, Temp=${tempF}, Humidity=${humidity}`);

    let alerted= false;

    if (tempF < LOW_THRESH || tempF > HIGH_THRESH) {
        const thresholdType = tempF < LOW_THRESH ? 'LOW' : 'HIGH';
        const alertMessage =
            `Wine Cellar Alert!\n` +
            `Device: ${deviceId}\n` +
            `Temp in fahrenheit: ${tempF}°F\n` +
            (humidity !== null ? `Humidity: ${humidity}%\n` : '') +
            `Threshold exceeded: ${thresholdType}\n` +
            `Time: ${timestamp}`;

        await sendSMS(alertMessage);
        alerted = true;
    } else {
        console.log(`[Alert] Temperature is normal: ${tempF}°F`);
    }

    return { alerted };
}

module.exports = {
    checkAndAlert
};
