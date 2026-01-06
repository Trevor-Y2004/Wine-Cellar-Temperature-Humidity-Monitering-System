import urequests as requests
import ujson as json

#pass it the payload and URL
def http_push(url, payload):
    try:
        req = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            data = json.dumps(payload)
            )
        print("POST status: ", r.status_code)
        r.close
    except Exception as e:
        print('Post failed:', e)
        
def http_pull(x, y):
    x = y
    #will use this as a config file
    #will update thresholds and check correct URLS at full scale
    
    