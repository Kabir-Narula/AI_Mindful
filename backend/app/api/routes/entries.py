from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import JournalEntry, User
from app.schemas import JournalEntryCreate, JournalEntryUpdate, JournalEntryResponse
from app.auth import get_current_user
from app.services.nlp_service import analyze_sentiment_and_keywords
from typing import List

router = APIRouter()

@router.post("/", response_model=JournalEntryResponse)
async def create_entry(
    entry_data: JournalEntryCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sentiment_score, keywords = analyze_sentiment_and_keywords(entry_data.content)
    
    db_entry = JournalEntry(
        user_id=current_user["user_id"],
        title=entry_data.title,
        content=entry_data.content,
        sentiment_score=sentiment_score,
        keywords=keywords,
        mood_level=entry_data.mood_level
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/", response_model=List[JournalEntryResponse])
async def get_entries(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 50,
    offset: int = 0
):
    entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user["user_id"]
    ).order_by(desc(JournalEntry.created_at)).offset(offset).limit(limit).all()
    return entries

@router.get("/{entry_id}", response_model=JournalEntryResponse)
async def get_entry(
    entry_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user["user_id"]
    ).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return entry

@router.put("/{entry_id}", response_model=JournalEntryResponse)
async def update_entry(
    entry_id: int,
    entry_data: JournalEntryUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user["user_id"]
    ).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    if entry_data.title is not None:
        entry.title = entry_data.title
    if entry_data.content is not None:
        entry.content = entry_data.content
        sentiment_score, keywords = analyze_sentiment_and_keywords(entry_data.content)
        entry.sentiment_score = sentiment_score
        entry.keywords = keywords
    if entry_data.mood_level is not None:
        entry.mood_level = entry_data.mood_level
    
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{entry_id}")
async def delete_entry(
    entry_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user["user_id"]
    ).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    db.delete(entry)
    db.commit()
    return {"status": "deleted"}
