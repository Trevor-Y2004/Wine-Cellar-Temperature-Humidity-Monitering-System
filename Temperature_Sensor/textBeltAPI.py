import requests
import secrets

def close_window(threshold):
    message = f'\nTemperature has reached above {threshold} degrees.\n'
    resp = requests.post(
        'https://textbelt.com/text',
        json={
            'phone': '(619) 597-4032',
            'message': message,
            'key': MY_API_KEY
        }
    )
    print(resp.json())
    print(message)

def open_window(threshold):
    message = f'\nTemperature has reached below {threshold} degrees.\n'
    resp = requests.post(
        'https://textbelt.com/text',
        json={
            'phone': '(619) 597-4032',
            'message': message,
            'key': MY_API_KEY
        }
    )
    print(resp.json())
    print(message)
