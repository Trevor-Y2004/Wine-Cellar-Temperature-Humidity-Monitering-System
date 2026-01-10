from simple import MQTTClient
import ubinascii
import machine

#replace server ip with the ip of your machine on the LAN
def mqtt_client():
    client_id = b"pico-" + ubinascii.hexlify(machine.unique_id())
    client = MQTTClient(client_id= client_id,
    server = b"192.168.86.34",
    port = 1883,
    user = None,
    password = None,
    keepalive = 60,
    ssl = False,
    ssl_params = None)
    
    client.connect()
    return client

def publish(client, topic,value):
    print(f"{topic}, {value}")
    client.publish(topic,value)
    print("Published")
    
    
#ips
    # - Mine: 192.168.86.34
    # - Annas: 192.168.1.238
