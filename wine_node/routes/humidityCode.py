#from inside Thonny

from machine import I2C, Pin
import time

#setting up i2c (need to define scl and sda pins)
i2c = I2C(0, scl=Pin(1), sda=Pin(0))
ADDR = 0x44  # sensor address

#need the addresses and tell sensor to take measurements
i2c.writeto(ADDR, b'\x24\x00')
time.sleep(0.05)  # small delay

#read 6 bytes from the sensor (can adjust)
data = i2c.readfrom(ADDR, 6)

#calculate temperature in Celsius to get fahrenheit
temp_raw = data[0] * 256 + data[1]
temp_c = -45 + (175 * temp_raw / 65535)
#switching temp

temp_f = temp_c * 9/5 +32

# Calculate humidity in percent
hum_raw = data[3] * 256 + data[4]
humidity = 100 * hum_raw/ 65535

# Print results
print("Temperature:", temp_f, "°F")
print("Humidity:", humidity, "%")
