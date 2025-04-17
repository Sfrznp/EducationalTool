# backend/test_evaluate.py
import requests

url = "http://127.0.0.1:8000/evaluate_video/"

payload = {
    "transcript": "Binary search is an efficient algorithm for finding an item from a sorted list. It works by repeatedly dividing the search interval in half...",
    "topic": "binary search",
    "user_level": "beginner"
}

response = requests.post(url, json=payload)

print("Status:", response.status_code)
print("Response:", response.json())
