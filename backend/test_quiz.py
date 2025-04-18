import requests

url = "http://127.0.0.1:8000/generate_quiz/"

payload = {
    "transcript": "Binary search is an algorithm for searching in a sorted list...",
    "topic": "binary search",
    "user_level": "beginner"
}

response = requests.post(url, json=payload)
print(response.json())
