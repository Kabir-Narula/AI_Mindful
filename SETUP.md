# MindfulAI Setup Guide

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Project Structure

```
MindfulAI/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/routes/        # API endpoint handlers
│   │   ├── services/          # Business logic (NLP, agent, patterns)
│   │   ├── models.py          # SQLAlchemy models
│   │   ├── schemas.py         # Pydantic validation schemas
│   │   ├── auth.py            # Authentication utilities
│   │   ├── database.py        # Database configuration
│   │   └── main.py            # FastAPI app initialization
│   ├── requirements.txt        # Python dependencies
│   ├── run.py                 # Backend entry point
│   └── .env.example           # Environment variables template
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API client
│   │   ├── context/           # React Context (Auth)
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── package.json           # NPM dependencies
│   ├── vite.config.ts         # Vite configuration
│   └── tsconfig.json          # TypeScript configuration
└── README.md                  # This file
```

## Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
python -m nltk.downloader stopwords punkt
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 4. Initialize Database

```bash
python -c "from app.database import init_db; init_db()"
```

### 5. Run Backend Server

```bash
python run.py
# or
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Running the Full Application

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Then navigate to `http://localhost:5173` in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Journal Entries
- `POST /api/entries/` - Create new entry
- `GET /api/entries/` - Get all entries (with pagination)
- `GET /api/entries/{id}` - Get specific entry
- `PUT /api/entries/{id}` - Update entry
- `DELETE /api/entries/{id}` - Delete entry

### Agent
- `POST /api/agent/followup` - Request agent follow-up for entry
- `GET /api/agent/followups/{entry_id}` - Get follow-ups for entry

### Analytics
- `GET /api/analytics/summary` - Get analytics summary with patterns
- `GET /api/analytics/trends` - Get mood trends over time

## Features

### 1. Authentication
- User signup and login with JWT tokens
- Secure password hashing with bcrypt
- Token-based authentication on all protected routes

### 2. Journal Entries
- Create, read, update, delete journal entries
- Rich text support
- Mood level tracking (1-10)
- Automatic sentiment analysis

### 3. NLP & Sentiment Analysis
- TextBlob-based sentiment analysis
- Keyword extraction using NLTK
- Sentiment scores from -1 (very negative) to +1 (very positive)

### 4. Intelligent Agent (Module 2)
- Emotion detection from journal content
- Context-aware follow-up prompts based on sentiment
- Rule-based question selection

### 5. Pattern Discovery (Module 3)
- Keyword-sentiment correlation analysis
- Temporal mood pattern detection (by day of week)
- Consecutive mood sequence identification
- Confidence scoring for identified patterns

### 6. Analytics Dashboard
- Overall sentiment trends
- Mood distribution visualization
- Pattern identification and ranking
- Common keyword extraction
- 14-day trend charts

## Testing the Application

### Test User Flow

1. **Sign Up**
   - Go to http://localhost:5173/signup
   - Create account with email and password

2. **Create Entry**
   - Click "Journal" in navigation
   - Write an entry with title and content
   - Set mood level
   - Submit

3. **View Dashboard**
   - Return to dashboard
   - See recent entries and analytics

4. **Get Agent Followup**
   - Click on an entry
   - Click "Get Agent Reflection"
   - Receive AI-generated follow-up prompt

5. **View Analytics**
   - Click "Analytics"
   - See mood trends, patterns, and keywords

## Troubleshooting

### Backend Issues

**ModuleNotFoundError**
```bash
pip install -r requirements.txt
```

**NLTK data not found**
```bash
python -m nltk.downloader stopwords punkt
```

**Database locked**
- Delete `mindfulai.db` and restart

### Frontend Issues

**npm dependencies issue**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Vite not loading**
- Ensure backend is running on port 8000
- Check vite.config.ts proxy settings

### CORS Errors
- Ensure backend has correct CORS origins configured
- Check frontend API_BASE_URL in services/api.ts

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `username` (Unique)
- `hashed_password`
- `created_at`

### Journal Entries Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `title`
- `content`
- `sentiment_score` (Float: -1 to 1)
- `keywords` (Comma-separated)
- `mood_level` (Integer: 1-10)
- `created_at`

### Agent Followups Table
- `id` (Primary Key)
- `entry_id` (Foreign Key)
- `prompt` (Text)
- `created_at`

## Performance Optimization Tips

1. **Database**: Use PostgreSQL in production instead of SQLite
2. **Caching**: Add Redis for caching frequently accessed patterns
3. **Search**: Consider full-text search for better keyword filtering
4. **Frontend**: Build React components as lazy-loaded modules

## Security Considerations

- Change `SECRET_KEY` in production
- Use HTTPS in production
- Implement rate limiting on auth endpoints
- Sanitize user input before processing
- Store tokens in secure HTTP-only cookies (frontend enhancement)
- Add input validation on all endpoints

## Future Enhancements

1. Voice journal entries with speech-to-text
2. Email notifications for concerning patterns
3. Social features (sharing insights, support groups)
4. Mobile app (React Native)
5. Advanced ML for predictive mood forecasting
6. Integration with meditation/therapy resources
7. Export to PDF or shareable reports
8. Goal tracking based on mood patterns

## Development Notes

- API responses follow RESTful conventions
- All timestamps are in UTC
- Sentiment scores use normalized polarity (-1 to 1)
- Pattern confidence is based on frequency and impact
- Agent prompts are randomly selected from templates based on sentiment category

## Support

For issues or questions, please refer to the original project documentation or submit an issue in the repository.

---

**Built with**: FastAPI, React, SQLAlchemy, TextBlob, NLTK, Tailwind CSS
