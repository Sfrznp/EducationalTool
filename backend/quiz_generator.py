from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_quiz(transcript: str, topic: str, user_level: str) -> dict:
    if len(transcript.strip()) == 0:
        return {"questions": [], "error": "Transcript is empty"}

    system_prompt = f"""
You are a helpful CS tutor. Your job is to create quiz questions to help learners test their understanding of a concept.

Topic: {topic}
User Level: {user_level}

Based on the following transcript, generate 3 short multiple-choice quiz questions. Each question should have:
1. The question text
2. 4 answer options (a-d)
3. The correct answer letter (e.g. "b")
4. A short explanation

Respond in JSON format as:
{{
  "questions": [
    {{
      "question": "...",
      "options": ["a) ...", "b) ...", "c) ...", "d) ..."],
      "answer": "b",
      "explanation": "..."
    }},
    ...
  ]
}}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": transcript[:4000]}
            ]
        )
        return eval(response.choices[0].message.content)
    except Exception as e:
        return {"questions": [], "error": str(e)}
