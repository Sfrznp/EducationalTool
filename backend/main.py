# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import OPENAI_API_KEY, YOUTUBE_API_KEY  # this will validate keys at startup
from video_fetcher import search_youtube_videos
from transcript_fetcher import fetch_transcript
from openai_evaluator import evaluate_video
from video_ranker import find_top_videos
from quiz_generator import generate_quiz




app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/search_videos/")
def search_videos(query: str):
    results = search_youtube_videos(query)
    return {"videos": results}


@app.get("/get_transcript/")
def get_transcript(video_id: str):
    text = fetch_transcript(video_id)
    if text:
        return {"transcript": text}
    else:
        return {"transcript": "", "error": "Transcript not available"}


from pydantic import BaseModel

class EvaluationRequest(BaseModel):
    transcript: str
    topic: str
    user_level: str
    details: str


@app.post("/evaluate_video/")
def evaluate(req: EvaluationRequest):
    result = evaluate_video(req.transcript, req.topic, req.user_level, req.details)
    return result

class VideoRequest(BaseModel):
    topic: str
    user_level: str
    details: str

@app.post("/recommend_videos/")
def recommend_videos(req: VideoRequest):
    top_videos = find_top_videos(req.topic, req.user_level, req.details)
    return {"videos": top_videos}

class QuizRequest(BaseModel):
    transcript: str
    topic: str
    user_level: str
    details: str

@app.post("/generate_quiz/")
def generate_quiz_endpoint(req: QuizRequest):
    return generate_quiz(req.transcript, req.topic, req.user_level, req.details)



@app.get("/")
def root():
    return {"message": "AI Learning Tool Backend is running"}