from textblob import TextBlob
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re

try:
    stopwords.words('english')
except LookupError:
    try:
        nltk.download('stopwords', quiet=True)
        nltk.download('punkt_tab', quiet=True)
    except Exception as e:
        print(f"Warning: Could not download NLTK data: {e}")

NEGATIVE_WORDS = {'sad', 'unhappy', 'depressed', 'anxious', 'worried', 'stressed', 'angry', 'frustrated', 'disappointed', 'upset', 'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'pain', 'hurt', 'sick', 'tired', 'exhausted', 'scared', 'afraid', 'lonely', 'alone', 'lost', 'confused', 'broken'}
POSITIVE_WORDS = {'happy', 'great', 'wonderful', 'excellent', 'amazing', 'awesome', 'love', 'like', 'joy', 'grateful', 'blessed', 'calm', 'peaceful', 'content', 'excited', 'energetic', 'confident', 'strong', 'proud', 'successful'}

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
    try:
        text_lower = text.lower()
        
        negative_count = sum(1 for word in NEGATIVE_WORDS if word in text_lower)
        positive_count = sum(1 for word in POSITIVE_WORDS if word in text_lower)
        
        if negative_count > positive_count:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            if polarity > 0:
                polarity = -abs(polarity)
            return round(polarity, 2)
        elif positive_count > negative_count:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            if polarity < 0:
                polarity = abs(polarity)
            return round(polarity, 2)
        else:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            return round(polarity, 2)
    except Exception as e:
        print(f"Error calculating sentiment: {e}")
        return 0.0

def extract_keywords(text: str) -> list[str]:
    try:
        stop_words = set(stopwords.words('english'))
        words = word_tokenize(text.lower())
        keywords = [
            word for word in words 
            if word.isalnum() and word not in stop_words and len(word) > 3
        ]
        
        keyword_freq = {}
        for kw in keywords:
            keyword_freq[kw] = keyword_freq.get(kw, 0) + 1
        
        sorted_keywords = sorted(keyword_freq.items(), key=lambda x: x[1], reverse=True)
        return [kw for kw, _ in sorted_keywords[:10]]
    except Exception as e:
        print(f"Error extracting keywords: {e}")
        return []

def clean_text(text: str) -> str:
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = ' '.join(text.split())
    return text
