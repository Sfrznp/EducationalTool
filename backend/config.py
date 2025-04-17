# backend/config.py
from dotenv import load_dotenv
import os

load_dotenv()  # Load from .env

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

if not OPENAI_API_KEY or not YOUTUBE_API_KEY:
    raise ValueError("Missing API keys in .env file")
