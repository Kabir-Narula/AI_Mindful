from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import JournalEntry
from app.schemas import AnalyticsResponse, PatternResult
from app.auth import get_current_user
from app.services.pattern_service import find_mood_patterns
from collections import Counter
from typing import List

router = APIRouter()

@router.get("/summary", response_model=AnalyticsResponse)
async def get_analytics_summary(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user["user_id"]
    ).all()
    
    if not entries:
        return AnalyticsResponse(
            avg_sentiment=0.0,
            mood_distribution={},
            total_entries=0,
            most_common_keywords=[],
            patterns=[]
        )
    
    sentiments = [e.sentiment_score for e in entries]
    avg_sentiment = sum(sentiments) / len(sentiments)
    
    mood_counts = Counter([e.mood_level for e in entries])
    mood_distribution = {str(k): v for k, v in mood_counts.items()}
    
    all_keywords = []
    for entry in entries:
        if entry.keywords:
            all_keywords.extend(entry.keywords.split(","))
    
    most_common_keywords = [kw.strip() for kw, _ in Counter(all_keywords).most_common(10)]
    
    patterns = find_mood_patterns(entries)
    
    return AnalyticsResponse(
        avg_sentiment=round(avg_sentiment, 2),
        mood_distribution=mood_distribution,
        total_entries=len(entries),
        most_common_keywords=most_common_keywords,
        patterns=patterns
    )

@router.get("/trends")
async def get_mood_trends(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
    days: int = 30
):
    from datetime import datetime, timedelta
    
    start_date = datetime.utcnow() - timedelta(days=days)
    entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user["user_id"],
        JournalEntry.created_at >= start_date
    ).order_by(JournalEntry.created_at).all()
    
    trends = []
    for entry in entries:
        trends.append({
            "date": entry.created_at.isoformat(),
            "sentiment": entry.sentiment_score,
            "mood_level": entry.mood_level,
            "title": entry.title
        })
    
    return {"trends": trends}
