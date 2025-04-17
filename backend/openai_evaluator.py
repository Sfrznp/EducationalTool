# backend/openai_evaluator.py
from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def evaluate_video(transcript: str, topic: str, user_level: str) -> dict:
    system_prompt = f"""You are an expert tutor in computer science, helping learners find videos that match their current level.

User level: {user_level}
Topic: {topic}

Given a video transcript, your task is to:
1. Evaluate if this video is suitable for the user.
2. Explain *why* or *why not* in simple terms.
3. Give it a relevance score from 1 to 10.
Respond in this exact format:
{{"score": X, "reason": "..."}}"""

    if len(transcript.strip()) == 0:
        return {"score": 0, "reason": "Transcript is missing or unavailable."}

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": transcript[:4000]}
            ]
        )

        content = response.choices[0].message.content
        if content.startswith("{") and "score" in content:
            return eval(content)  # Safe here in prototype
        else:
            return {"score": 0, "reason": "Response format was unexpected."}
    except Exception as e:
        return {"score": 0, "reason": f"Error from OpenAI: {e}"}
