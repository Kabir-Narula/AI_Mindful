from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import JournalEntry, AgentFollowup
from app.schemas import AgentFollowupResponse
from app.auth import get_current_user
from app.services.agent_service import (
    generate_intelligent_followup,
    get_ai_companion_response,
    extract_and_analyze_patterns
)
from typing import List
from pydantic import BaseModel

router = APIRouter()

class FollowupRequest(BaseModel):
    entry_id: int

class AICompanionResponse(BaseModel):
    detected_emotions: list
    themes: list
    your_needs: list
    reflection: str
    followup_question: str
    encouragement: str
    timestamp: str

class PatternAnalysisResponse(BaseModel):
    recurring_emotions: list
    recurring_themes: list
    recurring_needs: list
    insight: str

@router.post("/followup", response_model=AgentFollowupResponse)
async def request_followup(
    request: FollowupRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Request AI followup question based on journal entry content"""
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == request.entry_id,
        JournalEntry.user_id == current_user["user_id"]
    ).first()
    
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    
    # Generate intelligent followup based on actual content
    prompt = generate_intelligent_followup(entry)
    
    db_followup = AgentFollowup(entry_id=entry.id, prompt=prompt)
    db.add(db_followup)
    db.commit()
    db.refresh(db_followup)
    return db_followup

@router.get("/followups/{entry_id}", response_model=List[AgentFollowupResponse])
async def get_followups(
    entry_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all AI followups for an entry"""
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user["user_id"]
    ).first()
    
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    
    followups = db.query(AgentFollowup).filter(
        AgentFollowup.entry_id == entry_id
    ).all()
    return followups

@router.get("/companion/{entry_id}", response_model=AICompanionResponse)
async def get_companion_response(
    entry_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get complete AI companion analysis of journal entry"""
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user["user_id"]
    ).first()
    
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    
    response = get_ai_companion_response(entry)
    return AICompanionResponse(**response)

@router.get("/patterns", response_model=PatternAnalysisResponse)
async def get_pattern_analysis(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI analysis of patterns across all user's entries"""
    entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user["user_id"]
    ).order_by(JournalEntry.created_at.desc()).all()
    
    if not entries:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No entries found for pattern analysis"
        )
    
    patterns = extract_and_analyze_patterns(entries)
    return PatternAnalysisResponse(**patterns)
