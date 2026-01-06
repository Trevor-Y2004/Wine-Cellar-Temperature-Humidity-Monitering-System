from time import sleep, ticks_ms, ticks_diff
from machine import Pin
import onewire
import ds18x20
import network

from picozero import pico_temp_sensor
import my_network
import ap_config
import http_calls


LOW_THRESH = 50
HIGH_THRESH = 90

#addresses to pass to the REST API, should letter be passed in a config file so that the values are not hardcoded
URL_TELEM = 'http://localhost:3000/api/telemetry'
URL_THRESH = 'http://localhost:3000/api/threshold'
URL_STATUS = 'http://localhost:3000/api/status'

SSID = None
PASSWORD = None

WLAN_CHECK = 10  #check connection every 10 seconds

def url_decode(cred):
    cred = cred.replace('+', ' ')
    cred = cred.replace('%26', '&')    # &
    cred = cred.replace('%21', '!')    # !
    cred = cred.replace('%5F', '_')    # _
    cred = cred.replace('%28', '(')    # (
    cred = cred.replace('%29', ')')    # )
    return cred

def ensure_connection(sta_if, ssid, password, last_attempt):
    if sta_if.isconnected():
        return last_attempt
    else:
        my_network.connect(SSID, PASSWORD)
        return ticks_ms()
    
def run_thermo():
    #wlan object creation
    sta_if = network.WLAN(network.STA_IF) 
    #DS18B20 Setup
    #data line connected to digital pin 34, ow is now an object that can send data and power over a single data line
    #ds is a driver class for the wire object
    #roms gets the thermistors unique rom id
    one_wire = onewire.OneWire(Pin(28))
    ds = ds18x20.DS18X20(one_wire)
    roms = ds.scan()
    print('Found DS devices:', roms)
    
    high = False
    low = False
    
    last_wlan_check = 0
    
    #main loop to read temp and send
    while True:     
        #checks connection every 10 seconds, represented in miliseconds
        if ticks_diff(ticks_ms(), last_wlan_check) >= WLAN_CHECK * 1000:
            last_wlan_check_time = ticks_ms()
            last_wlan_check = ensure_connection(sta_if, SSID, PASSWORD, last_wlan_check_time)
        
        #sta_if.disconnect() - to test reconnection process
            
        
        ds.convert_temp() #tell sensor to measure
        sleep(750/1000)
    
        #read and convert temp
        for rom in roms:
            temp_c = ds.read_temp(rom)
            temp_f = celsius_to_faren(temp_c)
        
        #sleep every 5 seconds so data is checked and sent every 5 seconds to the node.js server
        sleep(5)
        
        if temp_f < LOW_THRESH or HIGH_THRESH < temp_f:
            if (HIGH_THRESH < temp_f and high == False):
                high = True
                
                payload = {
                    "deviceID": "pico-01",
                    "tempF": temp_f
                    }
                http_calls(URL_THRESH, payload)
                print('Temp threshold exceeded!', temp_f)
                
            elif (temp_f < LOW_THRESH and low == False):
                low = True
                
                payload = {
                    "deviceID": "pico-01",
                    "tempF": temp_f
                    }
                http_calls.http_push(URL_THRESH, payload)
                print('Temp threshold exceeded!', temp_f)
                
        else:
            high = False
            low = False
            print('Temp', temp_f)
        
        payload = {
                    "deviceID": "pico-01",
                    "tempF": temp_f
                    }
        http_calls.http_push(URL_TELEM, payload)
        http_calls.http_push(URL_STATUS, payload)
        
    
def celsius_to_faren(temp_c):
    temp_f = temp_c *1.8
    temp_f += 32
    return temp_f


def main ():

    global SSID
    global PASSWORD
    
    if not SSID or not PASSWORD:
        print("Running AP to get Credentials")
        
        ap_config.run_server()  # blocking, waits for POST
        SSID = ap_config.wifi_ssid
        PASSWORD = ap_config.wifi_password
    
    SSID = url_decode(ap_config.wifi_ssid)
    PASSWORD = url_decode(ap_config.wifi_password)
    
    sleep(2)
    print(f"creds: {SSID} {PASSWORD}")
    

    my_network.connect(SSID, PASSWORD)
    print('connected')
    
    ##run thermometer
    run_thermo()
    
if __name__ == "__main__":
    main()
    






