import requests
import time
import random

# =================================================================
# HiveShare IoT Hardware Uplink (Reference Implementation)
# =================================================================
# This script demonstrates how an ESP32 or Raspberry Pi would 
# authenticate and push real sensor data to the HiveShare platform.

# CONFIGURATION: Replace with your specific unit details
HIVE_ID = "101" 
IOT_KEY = "PASTE_YOUR_HARDWARE_KEY_HERE" # Get this from Admin Panel
API_ENDPOINT = "https://api.hiveshare.io/v1/uplink"

def read_load_cell():
    # Simulate real load cell reading (HX711)
    return round(35.0 + random.uniform(-0.5, 2.5), 2)

def read_dht_sensor():
    # Simulate DHT22 Temp/Humidity sensor
    temp = round(34.0 + random.uniform(-1, 1), 1)
    humidity = round(60 + random.uniform(-5, 5), 0)
    return temp, humidity

def push_payload():
    weight = read_load_cell()
    temp, humidity = read_dht_sensor()
    
    payload = {
        "hiveId": HIVE_ID,
        "iotKey": IOT_KEY,
        "data": {
            "weight": weight,
            "temp": temp,
            "humidity": humidity
        },
        "timestamp": time.time()
    }
    
    print(f"[NOMADIC_UPLINK] Deploying Payload: {weight}kg | {temp}C | {humidity}%")
    
    try:
        # NOTE: In the HiveShare Firebase implementation, this would 
        # normally be handled by a Cloud Function or direct secured SDK.
        # This is a RESTful representation of that logic.
        response = requests.post(API_ENDPOINT, json=payload, timeout=10)
        
        if response.status_code == 200:
            print(">>> Success: History Synchronized.")
        else:
            print(f">>> Error {response.status_code}: Uplink Rejected.")
            
    except Exception as e:
        print(f">>> CRITICAL_UPLINK_FAILURE: {str(e)}")

if __name__ == "__main__":
    print("--- HIVE_SHARE_IOT_NODE_ACTIVE ---")
    while True:
        push_payload()
        # Sleep for the refresh interval (3 days = 259200 seconds)
        # For testing, we recommend 5 seconds.
        print("Uplink hibernating for 5s (Simulation Mode)...")
        time.sleep(5)
