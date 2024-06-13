import requests
import time
from datetime import datetime

# URL of the server
url = 'http://localhost:7000/'

# Send requests indefinitely and measure response time
while True:
    start_time = time.time()  # Start time of the request
    response = requests.get(url)  # Send GET request
    end_time = time.time()  # End time of the request
    response_time = end_time - start_time  # Calculate response time

    # Get the current time for logging
    current_time = datetime.now().strftime('%H:%M:%S')

    # Log response and response time
    print(f'[{current_time}] Response: Status code - {response.status_code}, Response time - {response_time:.2f} seconds')

    # Optionally, print response content
    # print(f'Response content: {response.text}')

    # Optional delay between requests
    time.sleep(1)  # Adjust the delay as needed
