from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
import re
from collections import Counter

try:
    stopwords.words('english')
except LookupError:
    try:
        nltk.download('stopwords', quiet=True)
        nltk.download('punkt_tab', quiet=True)
    except Exception as e:
        print(f"Warning: Could not download NLTK data: {e}")

vader_analyzer = SentimentIntensityAnalyzer()

NEGATIVE_WORDS = {'sad', 'unhappy', 'depressed', 'anxious', 'worried', 'stressed', 'angry', 'frustrated', 'disappointed', 'upset', 'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'pain', 'hurt', 'sick', 'tired', 'exhausted', 'scared', 'afraid', 'lonely', 'alone', 'lost', 'confused', 'broken'}
POSITIVE_WORDS = {'happy', 'great', 'wonderful', 'excellent', 'amazing', 'awesome', 'love', 'like', 'joy', 'grateful', 'blessed', 'calm', 'peaceful', 'content', 'excited', 'energetic', 'confident', 'strong', 'proud', 'successful', 'good', 'fantastic', 'lovely'}

def analyze_sentiment_and_keywords(text: str) -> tuple[float, str]:
    try:
        cleaned_text = clean_text(text)
        sentiment_score = get_sentiment_score(text)
        keywords = extract_keywords(cleaned_text)
        keywords_str = ",".join(keywords)
        return sentiment_score, keywords_str
    except Exception as e:
        print(f"Error in sentiment analysis: {e}")
        return 0.0, ""

def get_sentiment_score(text: str) -> float:
    """
    Advanced sentiment analysis using VADER + TextBlob hybrid approach
    VADER is optimized for social media and informal text
    """
    try:
        vader_scores = vader_analyzer.polarity_scores(text)
        vader_compound = vader_scores['compound']
        
        blob = TextBlob(text)
        textblob_polarity = blob.sentiment.polarity
        
        combined_score = (vader_compound * 0.6) + (textblob_polarity * 0.4)
        
        return round(combined_score, 2)
    except Exception as e:
        print(f"Error calculating sentiment: {e}")
        return 0.0

def extract_keywords(text: str) -> list[str]:
    """Extract meaningful keywords using TF-IDF concept"""
    try:
        stop_words = set(stopwords.words('english'))
        sentences = sent_tokenize(text)
        
        words = word_tokenize(text.lower())
        keywords_list = [
            word for word in words 
            if word.isalnum() and word not in stop_words and len(word) > 3
        ]
        
        keyword_freq = Counter(keywords_list)
        sorted_keywords = sorted(keyword_freq.items(), key=lambda x: x[1], reverse=True)
        
        return [kw for kw, _ in sorted_keywords[:10]]
    except Exception as e:
        print(f"Error extracting keywords: {e}")
        return []

def clean_text(text: str) -> str:
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = ' '.join(text.split())
    return text

def extract_emotion_intensity(text: str) -> dict:
    """
    Measure emotional intensity across multiple dimensions
    Returns intensity scores for different emotional aspects
    """
    try:
        sentences = sent_tokenize(text)
        
        emotion_intensities = {
            'positive_intensity': 0,
            'negative_intensity': 0,
            'emotional_words_count': 0,
            'avg_sentence_sentiment': 0,
            'sentiment_variance': 0
        }
        
        sentiment_scores = []
        emotional_word_count = 0
        
        for sentence in sentences:
            vader_scores = vader_analyzer.polarity_scores(sentence)
            compound = vader_scores['compound']
            sentiment_scores.append(compound)
            
            words_in_sentence = sentence.lower().split()
            emotional_word_count += sum(1 for word in words_in_sentence if word in POSITIVE_WORDS or word in NEGATIVE_WORDS)
        
        if sentiment_scores:
            positive_scores = [s for s in sentiment_scores if s > 0.1]
            negative_scores = [s for s in sentiment_scores if s < -0.1]
            
            emotion_intensities['positive_intensity'] = round(sum(positive_scores) / len(sentiment_scores) if sentiment_scores else 0, 2)
            emotion_intensities['negative_intensity'] = round(abs(sum(negative_scores) / len(sentiment_scores)) if sentiment_scores else 0, 2)
            emotion_intensities['emotional_words_count'] = emotional_word_count
            emotion_intensities['avg_sentence_sentiment'] = round(sum(sentiment_scores) / len(sentiment_scores), 2)
            
            if len(sentiment_scores) > 1:
                mean = sum(sentiment_scores) / len(sentiment_scores)
                variance = sum((x - mean) ** 2 for x in sentiment_scores) / len(sentiment_scores)
                emotion_intensities['sentiment_variance'] = round(variance, 2)
        
        return emotion_intensities
    except Exception as e:
        print(f"Error extracting emotion intensity: {e}")
        return {}

def detect_emotional_context(text: str) -> dict:
    """
    Detect emotional context clues and narrative elements
    """
    try:
        text_lower = text.lower()
        
        context = {
            'has_questions': '?' in text,
            'has_exclamations': '!' in text,
            'is_reflective': any(word in text_lower for word in ['i think', 'i feel', 'i believe', 'i realize', 'perhaps', 'maybe']),
            'mentions_others': any(word in text_lower for word in ['my', 'they', 'he', 'she', 'we', 'their', 'someone', 'people']),
            'is_narrative': len(sent_tokenize(text)) > 3,
            'text_length': len(text.split()),
        }
        
        return context
    except Exception as e:
        print(f"Error detecting emotional context: {e}")
        return {}
