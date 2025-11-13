from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class JournalEntryCreate(BaseModel):
    title: str
    content: str
    mood_level: Optional[int] = 0

class JournalEntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood_level: Optional[int] = None

class JournalEntryResponse(BaseModel):
    id: int
    title: str
    content: str
    sentiment_score: float
    keywords: str
    mood_level: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class AgentFollowupResponse(BaseModel):
    id: int
    prompt: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class PatternResult(BaseModel):
    trigger: str
    confidence: float
    frequency: int
    avg_sentiment_impact: float

class AnalyticsResponse(BaseModel):
    avg_sentiment: float
    mood_distribution: dict
    total_entries: int
    most_common_keywords: List[str]
    patterns: List[PatternResult]
