from isodate import parse_duration

def title_match_score(title, description, topic):
    topic = topic.lower()
    score = 0
    if topic in title.lower():
        score += 6
    if topic in description.lower():
        score += 4
    return min(score, 10)

def duration_score(duration_str):
    try:
        seconds = parse_duration(duration_str).total_seconds()
        if 300 <= seconds <= 1500:
            return 10
        elif seconds < 180 or seconds > 1800:
            return 3
        else:
            return 6
    except:
        return 5  # fallback neutral

def engagement_score(views, likes):
    if views == 0:
        return 0
    ratio = likes / views
    if views >= 100000 and ratio >= 0.03:
        return 10
    elif views >= 50000:
        return 8
    elif views >= 10000:
        return 6
    else:
        return 4

def caption_quality_score(transcript):
    if not transcript:
        return 3
    length = len(transcript.split())
    if length >= 300:
        return 10
    elif length >= 100:
        return 6
    else:
        return 4

def comment_sentiment_score(comments):
    if not comments:
        return 5
    positive_keywords = ["helpful", "clear", "understand", "great", "explained", "best", "thanks"]
    score = sum(any(kw in comment.lower() for kw in positive_keywords) for comment in comments)
    ratio = score / len(comments)
    return min(int(ratio * 10), 10)
