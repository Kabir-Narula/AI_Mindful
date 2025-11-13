from app.models import JournalEntry

FOLLOW_UP_PROMPTS = {
    "very_negative": [
        "I notice this entry reflects some difficult emotions. Can you tell me what triggered these feelings?",
        "It sounds like you're going through a challenging time. What would help you feel better right now?",
        "I'm here to listen. Would you like to share more about what's weighing on your mind?",
    ],
    "negative": [
        "I see you're feeling down today. What's the main thing on your mind?",
        "It looks like something is bothering you. Do you want to talk about it?",
        "What happened today that made you feel this way?",
    ],
    "neutral": [
        "How are you feeling about what you just shared?",
        "Is there something positive that happened today you'd like to note?",
        "What would make today better for you?",
    ],
    "positive": [
        "That's wonderful! What made today special?",
        "I'm glad you're feeling good. What contributed to this positive mood?",
        "Keep up the positive energy! What are you grateful for today?",
    ],
    "very_positive": [
        "You seem to be in a great place! What's bringing you this joy?",
        "That's excellent! How can you extend this positive momentum?",
        "This is wonderful to see. What are the key factors creating this happiness?",
    ]
}

def generate_followup_prompt(entry: JournalEntry) -> str:
    sentiment = entry.sentiment_score
    
    if sentiment <= -0.6:
        category = "very_negative"
    elif sentiment <= -0.2:
        category = "negative"
    elif sentiment <= 0.2:
        category = "neutral"
    elif sentiment <= 0.6:
        category = "positive"
    else:
        category = "very_positive"
    
    import random
    prompts = FOLLOW_UP_PROMPTS.get(category, FOLLOW_UP_PROMPTS["neutral"])
    return random.choice(prompts)

def evaluate_risk_level(entry: JournalEntry) -> dict:
    risk_indicators = {
        "very_low_sentiment": entry.sentiment_score <= -0.8,
        "repeated_negative": False,
        "mentions_harm": any(word in entry.content.lower() for word in ["hurt", "harm", "suicide", "die", "hopeless"]),
    }
    
    risk_score = sum(risk_indicators.values())
    
    return {
        "risk_level": "high" if risk_score >= 2 else "medium" if risk_score == 1 else "low",
        "indicators": risk_indicators,
        "needs_intervention": risk_score >= 2
    }
