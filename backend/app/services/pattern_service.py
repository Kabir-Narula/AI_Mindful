from app.models import JournalEntry
from app.schemas import PatternResult
from typing import List
from collections import Counter
from datetime import datetime, timedelta

def find_mood_patterns(entries: List[JournalEntry]) -> List[PatternResult]:
    try:
        if len(entries) < 3:
            return []
        
        patterns = []
        
        patterns.extend(find_keyword_sentiment_correlation(entries))
        patterns.extend(find_temporal_patterns(entries))
        patterns.extend(find_mood_sequences(entries))
        
        patterns = sorted(patterns, key=lambda p: p.confidence, reverse=True)
        return patterns[:5]
    except Exception as e:
        print(f"Error finding patterns: {e}")
        return []

def find_keyword_sentiment_correlation(entries: List[JournalEntry]) -> List[PatternResult]:
    try:
        keyword_sentiments = {}
        keyword_counts = {}
        
        for entry in entries:
            if entry.keywords:
                keywords = [kw.strip() for kw in entry.keywords.split(",")]
                for kw in keywords:
                    if kw not in keyword_sentiments:
                        keyword_sentiments[kw] = []
                        keyword_counts[kw] = 0
                    keyword_sentiments[kw].append(entry.sentiment_score)
                    keyword_counts[kw] += 1
        
        patterns = []
        for keyword, sentiments in keyword_sentiments.items():
            if len(sentiments) >= 2:
                avg_sentiment = sum(sentiments) / len(sentiments)
                
                if avg_sentiment < -0.3:
                    confidence = min(len(sentiments) / len(entries), 1.0)
                    patterns.append(PatternResult(
                        trigger=f"Entries mentioning '{keyword}'",
                        confidence=confidence,
                        frequency=len(sentiments),
                        avg_sentiment_impact=round(avg_sentiment, 2)
                    ))
        
        return patterns
    except Exception as e:
        print(f"Error in keyword correlation: {e}")
        return []

def find_temporal_patterns(entries: List[JournalEntry]) -> List[PatternResult]:
    try:
        day_sentiments = {}
        day_counts = {}
        
        for entry in entries:
            day_of_week = entry.created_at.strftime("%A")
            if day_of_week not in day_sentiments:
                day_sentiments[day_of_week] = []
                day_counts[day_of_week] = 0
            day_sentiments[day_of_week].append(entry.sentiment_score)
            day_counts[day_of_week] += 1
        
        patterns = []
        for day, sentiments in day_sentiments.items():
            if len(sentiments) >= 2:
                avg_sentiment = sum(sentiments) / len(sentiments)
                
                if avg_sentiment < -0.2:
                    confidence = min(len(sentiments) / len(entries), 1.0)
                    patterns.append(PatternResult(
                        trigger=f"Mood pattern on {day}s",
                        confidence=confidence,
                        frequency=len(sentiments),
                        avg_sentiment_impact=round(avg_sentiment, 2)
                    ))
        
        return patterns
    except Exception as e:
        print(f"Error in temporal patterns: {e}")
        return []

def find_mood_sequences(entries: List[JournalEntry]) -> List[PatternResult]:
    try:
        sorted_entries = sorted(entries, key=lambda e: e.created_at)
        
        patterns = []
        for i in range(len(sorted_entries) - 2):
            window = [sorted_entries[i], sorted_entries[i+1], sorted_entries[i+2]]
            sentiments = [e.sentiment_score for e in window]
            
            if all(s < -0.3 for s in sentiments):
                common_keywords = extract_common_keywords(window)
                for keyword in common_keywords:
                    patterns.append(PatternResult(
                        trigger=f"Consecutive low mood with '{keyword}'",
                        confidence=0.7,
                        frequency=3,
                        avg_sentiment_impact=round(sum(sentiments) / len(sentiments), 2)
                    ))
        
        return patterns
    except Exception as e:
        print(f"Error in mood sequences: {e}")
        return []

def extract_common_keywords(entries: List[JournalEntry]) -> List[str]:
    try:
        all_keywords = []
        for entry in entries:
            if entry.keywords:
                all_keywords.extend([kw.strip() for kw in entry.keywords.split(",")])
        
        if not all_keywords:
            return []
        
        keyword_counts = Counter(all_keywords)
        return [kw for kw, count in keyword_counts.most_common(3) if count >= 2]
    except Exception as e:
        print(f"Error extracting keywords: {e}")
        return []
