import './App.css';
import { useDeviceSocket } from './hooks/useDeviceSocket';

export default function Layout() {
  const devices = useDeviceSocket(); // ← LIVE data from backend
  
  return (
    <div className="layout">
      <header className="left_col">

        <div className="temp_card">
          <h1>Temperature</h1>
        </div>
        
        <div className="list">
          <h1>Sensors</h1>

          {Object.values(devices).map(device => (
            <h3 key={device.deviceID}>
              {device.deviceID}: {device.tempF}°F
            </h3>
          ))}
        </div>

      </header>

      <div className="right_col">
        <div className="humid_card">Humidity</div>
        <div className="controls">Controls</div>
      </div>
    </div>
  );
}
