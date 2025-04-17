# backend/test_recommend.py
import requests

url = "http://127.0.0.1:8000/recommend_videos/"

payload = {
    "topic": "binary search",
    "user_level": "beginner"
}

response = requests.post(url, json=payload)

print("Status:", response.status_code)
print("Response:")
for vid in response.json()["videos"]:
    print(f"- {vid['title']} ({vid['score']}/10)\n  Reason: {vid['reason']}\n")
