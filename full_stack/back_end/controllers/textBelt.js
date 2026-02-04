const axios = require('axios');

//configuration
//TODO: 
//create and pass in .env file 

//TODO:
//create a mock .env file for github(perchance?)

const TEXTBELT_API_KEY = process.env.TEXTBELT_API_KEY; 
const PHONE_NUMBER = process.env.TEXTBELT_PHONE_NUM;


// sends SMS messages using the Textbelt api
async function sendTextbeltSMS(message) {
    try {
        const response = await axios.post('https://textbelt.com/text', {
            phone_num: PHONE_NUMBER,
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

//pass in the temp as a threshold
async function alertUser(deviceID, tempF, humidity = null, thresholdType) {
    const now = new Date();
    const timestamp = now.toLocaleString();

    console.log(`[Check] Device=${deviceID}, Temp=${tempF}, Humidity=${humidity}`);

    const alertMessage =
    `Wine Cellar Alert!\n` +
    `Device: ${deviceID}\n` +
    `Temp in fahrenheit: ${tempF}°F\n` +
    (humidity !== null ? `Humidity: ${humidity}%\n` : '') +
    `Threshold exceeded: ${thresholdType}\n` +
    `Time: ${timestamp}`;

    await sendTextbeltSMS(alertMessage);
}

module.exports = {
    alertUser
};
