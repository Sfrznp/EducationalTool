# backend/transcript_fetcher.py
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound


# This will:
# - Return the full transcript as a string (if available)
# - Return an empty string if transcript is disabled or not found
def fetch_transcript(video_id: str) -> str:
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        full_text = " ".join([entry["text"] for entry in transcript])
        return full_text
    except (TranscriptsDisabled, NoTranscriptFound):
        return ""
