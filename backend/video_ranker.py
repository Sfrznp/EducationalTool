# backend/video_ranker.py
from video_fetcher import search_youtube_videos
from transcript_fetcher import fetch_transcript
from openai_evaluator import evaluate_video

def find_top_videos(topic: str, user_level: str, max_results: int = 5):
    video_candidates = search_youtube_videos(topic, max_results=max_results)

    ranked = []
    for video in video_candidates:
        transcript = fetch_transcript(video["video_id"])
        if not transcript.strip():
            continue
        evaluation = evaluate_video(transcript, topic, user_level)
        ranked.append({
            "video_id": video["video_id"],
            "title": video["title"],
            "description": video["description"],
            "thumbnail": video["thumbnail"],
            "score": evaluation["score"],
            "reason": evaluation["reason"],
            "transcript": transcript
        })

    # Sort by score, highest first
    ranked.sort(key=lambda x: x["score"], reverse=True)

    # Return top 3
    return ranked[:3]
