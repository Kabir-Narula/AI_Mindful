from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import JournalEntry, AgentFollowup
from app.schemas import AgentFollowupResponse
from app.auth import get_current_user
from app.services.agent_service import generate_followup_prompt
from typing import List
from pydantic import BaseModel

router = APIRouter()

class FollowupRequest(BaseModel):
    entry_id: int

@router.post("/followup", response_model=AgentFollowupResponse)
async def request_followup(
    request: FollowupRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == request.entry_id,
        JournalEntry.user_id == current_user["user_id"]
    ).first()
    
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    
    prompt = generate_followup_prompt(entry)
    
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
