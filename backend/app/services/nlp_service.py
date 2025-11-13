from textblob import TextBlob
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re

try:
    stopwords.words('english')
except LookupError:
    nltk.download('stopwords')
    nltk.download('punkt')

def analyze_sentiment_and_keywords(text: str) -> tuple[float, str]:
    cleaned_text = clean_text(text)
    
    sentiment_score = get_sentiment_score(cleaned_text)
    keywords = extract_keywords(cleaned_text)
    
    keywords_str = ",".join(keywords)
    
    return sentiment_score, keywords_str

def get_sentiment_score(text: str) -> float:
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    return round(polarity, 2)

def extract_keywords(text: str) -> list[str]:
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

def clean_text(text: str) -> str:
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = ' '.join(text.split())
    return text
