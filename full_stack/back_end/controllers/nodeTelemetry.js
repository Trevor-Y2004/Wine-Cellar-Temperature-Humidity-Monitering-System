const { alertUser } = require("./textBelt");
//TODO:
//front end should have an alert feature where the ui changes if threshold is reached

//devicelist will hold an entry per device. 

//TODO:
//additionally, deviceID is passed in as a hardcoded value, should likely change to 
//its serial value
const latestDevice = {};

//TODO:
//these must be changed from hard coded later. This will likely be changed when device
//configuration can be set from the app

//leave slight offset for noisy device
//offset may not be desired for increidbly sensitive products
//TODO: 
//offset should be passed in with temp config
const TEMP_HIGH_THRESH = 90;
const TEMP_HIGH_RESET = 88;
const TEMP_LOW_THRESH = 40;
const TEMP_LOW_RESET = 42;



async function handleMQTTMessage(MQTTmessage, io){
    //handle UTF-encoded json from node and set appropriate variables
    payload = parseMQTTPayload(MQTTmessage);
    if (!payload){
        return
    }
    const { deviceID, tempF } = payload;
    console.log(`Received ${deviceID}:`, payload);

    //handle temperature
    if(!latestDevice[deviceID]){
        latestDevice[deviceID] = {
            deviceID,
            highViolation: false,
            lowViolation: false

        };
    }

    const device = latestDevice[deviceID];

    //update device readings and check for threshold violations
    device.tempF = tempF;

    if (tempF > TEMP_HIGH_THRESH && !device.highViolation) {
    device.highViolation = true;
    await alertUser({ deviceID, tempF, humidity, thresholdType: "High"});
    }

    if (tempF <= TEMP_HIGH_RESET && device.highViolation) {
        device.highViolation = false;
    }

    if (tempF < TEMP_LOW_THRESH && !device.lowViolation) {
        device.lowViolation = true;
        await alertUser({ deviceID, tempF, humidity, thresholdType: "low"});
    }

    if (tempF >= TEMP_LOW_RESET && device.lowViolation) {
        device.lowViolation = false;
    }

    //TODO:
    //establish web socket communication
    //TODO:
    //pass front end threhsold state

    io.emit("deviceUpdate", device);
};

function parseMQTTPayload(message){
    try{
        return JSON.parse(message.toString('utf-8'));

    }catch(err){
        console.error("Invalid MQTT JSON: ", err.message);
        return null;
    }
};

module.exports = {
    handleMQTTMessage
};