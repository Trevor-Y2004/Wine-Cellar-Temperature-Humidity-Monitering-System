import { useEffect, useState } from "react";
import { io } from "socket.io-client";

//ndoe server address
const SOCKET_URL = "http://localhost:3000"; 

// { deviceID: deviceData } - custom react hook
export function useDeviceSocket() {
  const [devices, setDevices] = useState({});

  useEffect(() => {
    const socket = io(SOCKET_URL);

    //can remove when socket connection confirmed
    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    //listens for upates from backend
    socket.on("deviceUpdate", (device) => {
      setDevices((prevDeviceState) => ({
        ...prevDeviceState,
        [device.deviceID]: device //updates only current device
      }));
    });

    //disconnect when server unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  //lets the rest of front end see device state
  return devices;
}
