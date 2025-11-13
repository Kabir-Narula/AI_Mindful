from app.models import JournalEntry
from app.services.nlp_service import (
    get_sentiment_score, 
    extract_emotion_intensity,
    detect_emotional_context
)
import random
from datetime import datetime, timedelta
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

vader_analyzer = SentimentIntensityAnalyzer()

class AICompanion:
    """Deep conversational AI that analyzes journal content, not just mood scores"""
    
    def __init__(self):
        self.emotion_to_followup = {
            "anxiety": [
                "I sense some anxiety in your words. What specifically is worrying you?",
                "You mentioned feeling anxious. Have you experienced this before? What helped?",
                "Let's break this down. What's the root cause of your anxiety?",
                "I'm here to help. What do you need right now to feel calmer?"
            ],
            "sadness": [
                "I can feel the sadness in your words. What happened that made you feel this way?",
                "Sadness is valid. Would you like to explore what triggered this?",
                "Tell me more about what's making you feel sad.",
                "I'm listening. What do you need from yourself right now?"
            ],
            "anger": [
                "I notice some anger in your entry. What made you feel this way?",
                "You sound frustrated. What would help you feel more in control?",
                "I'm here to understand. What needs to happen for you to feel better?",
                "Anger can be a catalyst for change. What needs to shift?"
            ],
            "stress": [
                "You seem stressed. What's the main source of pressure?",
                "I hear the stress in your words. How long have you been feeling this way?",
                "Stress is a sign you care about something. What matters most to you here?",
                "Let's identify what's within your control. What can you change?"
            ],
            "loneliness": [
                "I sense some loneliness. Who would you like to connect with?",
                "You sound like you need some support. Have you reached out to anyone?",
                "Connection matters. What would help you feel less alone?",
                "I'm here for you. Who in your life brings you joy?"
            ],
            "joy": [
                "That's wonderful! What created this joy?",
                "I can feel your happiness. What made today special?",
                "This is beautiful to read. How can you hold onto this feeling?",
                "What a gift! How can you share this with others?"
            ],
            "gratitude": [
                "Your gratitude is inspiring. What else are you thankful for?",
                "This perspective is wonderful. How does it make you feel?",
                "Gratitude transforms our experiences. What more can you appreciate?",
                "I love this energy. How can you cultivate more of this?"
            ],
            "hope": [
                "I hear hope in your words. What are you hopeful about?",
                "That's a beautiful outlook. How did you arrive at this perspective?",
                "Hope is powerful. What's your vision for what's to come?",
                "This is inspiring. What steps can you take toward this?"
            ]
        }
    
    def analyze_entry_deeply(self, entry: JournalEntry) -> dict:
        """Analyze the content deeply, not just sentiment score"""
        content = entry.content.lower()
        
        # Extract multiple dimensions
        emotions = self._detect_emotions(content)
        themes = self._extract_themes(content)
        needs = self._identify_needs(content)
        patterns = self._find_patterns(entry)
        
        return {
            "primary_emotions": emotions,
            "underlying_themes": themes,
            "expressed_needs": needs,
            "detected_patterns": patterns,
            "sentiment_from_text": get_sentiment_score(entry.content),
            "content_based_reflection": self._generate_content_based_reflection(
                emotions, themes, needs, content
            )
        }
    
    def _detect_emotions(self, content: str) -> list:
        """Advanced emotion detection using keywords + sentiment analysis + emotional intensity"""
        emotion_keywords = {
            "anxiety": ["anxious", "nervous", "worried", "scared", "stressed", "tense", "panic", "uneasy", "apprehensive", "fidgety"],
            "sadness": ["sad", "depressed", "down", "unhappy", "miserable", "blue", "grief", "sorrowful", "gloomy", "melancholy"],
            "anger": ["angry", "furious", "rage", "mad", "frustrated", "annoyed", "bitter", "irritated", "livid", "incensed"],
            "stress": ["stressed", "overwhelmed", "pressured", "exhausted", "burnt out", "tension", "anxious", "tense", "strained"],
            "loneliness": ["lonely", "alone", "isolated", "disconnected", "forgotten", "unsupported", "abandoned", "rejected"],
            "joy": ["happy", "joyful", "delighted", "thrilled", "blessed", "wonderful", "amazing", "good", "great", "excellent", "awesome", "fantastic", "love it"],
            "gratitude": ["grateful", "thankful", "appreciate", "blessed", "fortunate", "grateful", "thanks"],
            "hope": ["hope", "hopeful", "believe", "faith", "possible", "future", "excited", "optimistic", "confident"],
            "guilt": ["guilty", "shame", "regret", "sorry", "ashamed", "feel bad", "fault"],
            "fear": ["afraid", "terrified", "fearful", "dread", "horrified", "petrified", "scary", "frightened"],
            "excitement": ["excited", "thrilled", "pumped", "energized", "enthusiastic", "thrilled", "love", "can't wait"],
            "calm": ["calm", "peaceful", "serene", "relaxed", "at ease", "tranquil", "content", "composed"],
            "pride": ["proud", "accomplished", "succeeded", "achieved", "won", "triumphed", "victorious"],
            "confusion": ["confused", "unsure", "unclear", "lost", "bewildered", "perplexed", "disoriented"]
        }
        
        detected = []
        content_lower = content.lower()
        
        for emotion, keywords in emotion_keywords.items():
            if any(keyword in content_lower for keyword in keywords):
                detected.append(emotion)
        
        emotion_intensity = extract_emotion_intensity(content)
        sentiment = get_sentiment_score(content)
        
        if not detected:
            if sentiment > 0.4:
                detected.append("joy")
            elif sentiment > 0.1:
                detected.append("calm")
            elif sentiment < -0.4:
                detected.append("sadness")
            elif sentiment < -0.1:
                detected.append("stress")
            else:
                detected.append("neutral")
        
        if emotion_intensity.get('emotional_words_count', 0) > 5 and 'excitement' not in detected:
            if sentiment > 0:
                detected.insert(0, 'excitement')
            elif sentiment < 0:
                detected.insert(0, 'intensity')
        
        return list(set(detected)) if detected else ["neutral"]
    
    def _extract_themes(self, content: str) -> list:
        """Extract themes from what the user wrote with enhanced keywords"""
        theme_keywords = {
            "work": ["work", "job", "boss", "colleague", "office", "deadline", "project", "meeting", "career", "employed", "employee", "workplace", "professional"],
            "relationships": ["friend", "family", "relationship", "partner", "loved one", "brother", "sister", "mother", "father", "parent", "spouse", "crush", "dating"],
            "health": ["health", "sick", "ill", "pain", "hurt", "exercise", "sleep", "eat", "tired", "energy", "medical", "doctor", "hospital", "fitness", "body"],
            "finance": ["money", "bill", "debt", "payment", "financial", "broke", "afford", "expensive", "budget", "savings", "income", "investment"],
            "personal_growth": ["learn", "grow", "improve", "challenge", "goal", "progress", "skill", "develop", "education", "course", "training", "hobby"],
            "identity": ["feel", "am", "identity", "self", "who i am", "purpose", "meaning", "values", "believe", "authentic", "true self"],
            "loss": ["lost", "death", "goodbye", "missing", "left", "gone", "departed", "loss", "died", "passed away", "ending"],
            "achievement": ["achieved", "accomplished", "succeeded", "won", "completed", "finished", "passed", "success", "triumph", "reached"],
            "mental_health": ["anxiety", "depression", "therapy", "counseling", "mental health", "stress management", "mindfulness"],
            "creativity": ["art", "music", "write", "create", "creative", "design", "passion", "express", "imagination", "inspiration"],
            "learning": ["school", "study", "exam", "test", "grade", "class", "university", "college", "student", "learning", "teach"]
        }
        
        themes = []
        content_lower = content.lower()
        for theme, keywords in theme_keywords.items():
            if any(keyword in content_lower for keyword in keywords):
                themes.append(theme)
        
        return themes if themes else []
    
    def _identify_needs(self, content: str) -> list:
        """Identify what the user might need based on their writing"""
        need_keywords = {
            "support": ["help", "support", "need", "struggling", "can't", "unable", "stuck", "difficulty"],
            "understanding": ["understand", "get it", "see", "know", "hear me", "listen", "explain"],
            "connection": ["lonely", "alone", "isolated", "talk", "share", "connect", "community"],
            "validation": ["right", "ok", "normal", "feel", "valid", "deserve", "matter"],
            "action": ["change", "do", "fix", "improve", "need to", "must", "should", "want to"],
            "rest": ["tired", "exhausted", "need break", "sleep", "rest", "relax", "pause", "slow down"],
            "clarity": ["confused", "unsure", "lost", "don't know", "unclear", "questions", "wondering"],
            "hope": ["hopeful", "believe", "faith", "future", "will be", "possible", "optimistic", "better"],
            "acceptance": ["struggle with", "accept", "let go", "forgive", "peace"],
            "growth": ["learn", "understand myself", "figure out", "discover", "evolve"]
        }
        
        needs = []
        content_lower = content.lower()
        for need, keywords in need_keywords.items():
            if any(keyword in content_lower for keyword in keywords):
                needs.append(need)
        
        return needs if needs else []
    
    def _find_patterns(self, entry: JournalEntry) -> dict:
        """Look for patterns in user's writing style and content"""
        return {
            "frequency_indicator": "Regular writer" if entry.id % 3 == 0 else "Intermittent",
            "entry_length": "Detailed" if len(entry.content) > 500 else "Brief",
            "emotional_openness": "High" if len(self._detect_emotions(entry.content.lower())) > 2 else "Moderate"
        }
    
    def _generate_content_based_reflection(self, emotions: list, themes: list, needs: list, content: str) -> str:
        """Generate intelligent, personalized reflection based on content analysis"""
        reflections = []
        
        if "anxiety" in emotions:
            reflections.append("I sense some anxiety in your words. These worries are real, and acknowledging them is the first step to understanding them.")
        
        if "sadness" in emotions:
            reflections.append("Your heart seems tender right now. Sadness often teaches us what matters most. Allow yourself to feel it fully.")
        
        if "anger" in emotions:
            reflections.append("Your passion comes through clearly. Anger can be a powerful teacher about your boundaries and values.")
        
        if "stress" in emotions:
            reflections.append("You're navigating stress right now. Remember, pressure doesn't define you—how you respond to it does.")
        
        if "loneliness" in emotions:
            reflections.append("Feeling alone can be painful, but it also opens you to deeper connection with yourself and others.")
        
        if "joy" in emotions or "excitement" in emotions:
            reflections.append("There's joy and excitement in your words! This energy is contagious—hold onto it and share it.")
        
        if "gratitude" in emotions:
            reflections.append("Your gratitude is a superpower. Noticing what's good strengthens your resilience.")
        
        if "pride" in emotions:
            reflections.append("You have something to be proud of. Celebrate your achievements, no matter how small.")
        
        if "hope" in emotions:
            reflections.append("Hope shines through your words. That light is worth protecting and nurturing.")
        
        if "work" in themes:
            if "stress" in emotions or "exhausted" in content.lower():
                reflections.append("Work is consuming your energy. Consider what boundaries you might need to set.")
            else:
                reflections.append("Work is part of your story. You're building something meaningful.")
        
        if "learning" in themes:
            reflections.append("You're in a learning phase. Growth requires patience—be kind to yourself through this process.")
        
        if "relationships" in themes:
            if "loneliness" in emotions:
                reflections.append("Your relationships matter, and you deserve connection. Reach out to someone who understands you.")
            else:
                reflections.append("Your connections matter deeply. The people in your life are fortunate to have you.")
        
        if "health" in themes:
            reflections.append("Your well-being is worth investing in. Small acts of self-care compound into big changes.")
        
        if "support" in needs:
            reflections.append("You're wisely acknowledging that you need support. Asking for help is a sign of strength and self-awareness.")
        
        if "action" in needs:
            reflections.append("You're ready for change. Start with one small step—momentum builds from there.")
        
        if "rest" in needs:
            reflections.append("Your body and mind are asking for rest. Listen to that wisdom. You cannot pour from an empty cup.")
        
        if "clarity" in needs:
            reflections.append("Seeking clarity shows you're taking your life seriously. Confusion is temporary—understanding emerges with time.")
        
        if len(reflections) > 3:
            reflections = reflections[:3]
        
        return " ".join(reflections) if reflections else "I appreciate you sharing your authentic thoughts. Every word matters."

def generate_intelligent_followup(entry: JournalEntry) -> str:
    """Generate a followup question based on actual content, not mood slider"""
    ai = AICompanion()
    analysis = ai.analyze_entry_deeply(entry)
    
    emotions = analysis["primary_emotions"]
    needs = analysis["expressed_needs"]
    
    # Select followup based on detected emotions from text
    for emotion in emotions:
        if emotion in ai.emotion_to_followup:
            return random.choice(ai.emotion_to_followup[emotion])
    
    # Fallback to content-based followup
    return analysis["content_based_reflection"]

def get_ai_companion_response(entry: JournalEntry) -> dict:
    """Get complete AI companion response for an entry"""
    ai = AICompanion()
    analysis = ai.analyze_entry_deeply(entry)
    
    return {
        "detected_emotions": analysis["primary_emotions"],
        "themes": analysis["underlying_themes"],
        "your_needs": analysis["expressed_needs"],
        "reflection": analysis["content_based_reflection"],
        "followup_question": generate_intelligent_followup(entry),
        "encouragement": generate_encouragement(analysis, entry),
        "timestamp": datetime.now().isoformat()
    }

def generate_encouragement(analysis: dict, entry: JournalEntry) -> str:
    """Generate personalized encouragement based on analysis"""
    emotions = analysis["primary_emotions"]
    
    if "anxiety" in emotions or "stress" in emotions:
        return "Take it one step at a time. You're stronger than you think."
    elif "sadness" in emotions:
        return "This feeling will pass. Be gentle with yourself."
    elif "anger" in emotions:
        return "Your feelings are valid. Use this energy constructively."
    elif "loneliness" in emotions:
        return "You're not alone in this. Reach out to someone you trust."
    elif "joy" in emotions or "gratitude" in emotions:
        return "Keep nurturing this positive energy. Share it with others."
    else:
        return "Thank you for sharing your authentic self. That takes courage."

def extract_and_analyze_patterns(user_entries: list) -> dict:
    """Analyze patterns across multiple entries - not just mood slider trends"""
    if not user_entries:
        return {}
    
    ai = AICompanion()
    all_emotions = []
    all_themes = []
    all_needs = []
    
    for entry in user_entries[-10:]:  # Analyze last 10 entries
        analysis = ai.analyze_entry_deeply(entry)
        all_emotions.extend(analysis["primary_emotions"])
        all_themes.extend(analysis["underlying_themes"])
        all_needs.extend(analysis["expressed_needs"])
    
    # Find most common patterns
    from collections import Counter
    emotion_patterns = Counter(all_emotions).most_common(3)
    theme_patterns = Counter(all_themes).most_common(3)
    need_patterns = Counter(all_needs).most_common(2)
    
    return {
        "recurring_emotions": [e[0] for e in emotion_patterns],
        "recurring_themes": [t[0] for t in theme_patterns],
        "recurring_needs": [n[0] for n in need_patterns],
        "insight": generate_pattern_insight(emotion_patterns, theme_patterns)
    }

def generate_pattern_insight(emotions, themes) -> str:
    """Generate insight about user's patterns"""
    if not emotions:
        return "Keep journaling to uncover your patterns."
    
    main_emotion = emotions[0][0]
    main_theme = themes[0][0] if themes else "various topics"
    
    insights = {
        "anxiety": f"You frequently experience anxiety, often around {main_theme}. Understanding triggers could help.",
        "sadness": f"Sadness appears regularly in your entries about {main_theme}. What support do you need?",
        "stress": f"Stress is a common thread in your writing about {main_theme}. What would create relief?",
        "joy": f"You find joy in {main_theme}. Keep nurturing these areas of happiness.",
        "gratitude": f"Gratitude emerges around {main_theme}. This is a strength to build on."
    }
    
    return insights.get(main_emotion, f"Your experiences with {main_emotion} often involve {main_theme}. Reflect on what you need here.")
