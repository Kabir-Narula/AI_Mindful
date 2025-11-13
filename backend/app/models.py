from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    entries = relationship("JournalEntry", back_populates="user", cascade="all, delete-orphan")

class JournalEntry(Base):
    __tablename__ = "journal_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String)
    content = Column(Text)
    sentiment_score = Column(Float, default=0.0)
    keywords = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    mood_level = Column(Integer, default=0)
    
    user = relationship("User", back_populates="entries")
    followups = relationship("AgentFollowup", back_populates="entry", cascade="all, delete-orphan")

class AgentFollowup(Base):
    __tablename__ = "agent_followups"
    
    id = Column(Integer, primary_key=True, index=True)
    entry_id = Column(Integer, ForeignKey("journal_entries.id"), index=True)
    prompt = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    entry = relationship("JournalEntry", back_populates="followups")
