# MindfulAI - AI-Powered Mood Journaling Platform

A full-stack web application that combines journaling with artificial intelligence to help users track their emotional well-being, identify mood patterns, and receive personalized support.

## 🎯 Features

### Core Features
- **User Authentication**: Secure signup and login with JWT tokens
- **Journal Entries**: Create, read, update, and delete mood journal entries
- **Sentiment Analysis**: NLP-powered emotion detection from journal text
- **Intelligent Agent**: AI-generated follow-up prompts based on emotional content
- **Pattern Discovery**: Identifies mood triggers, temporal patterns, and correlations
- **Analytics Dashboard**: Visualize mood trends, patterns, and emotional insights

### AI/ML Components

#### Module 2: Intelligent Agent
- Perceives user emotions through sentiment analysis
- Reasons about appropriate follow-up questions
- Generates empathetic, context-aware prompts

#### Module 3: Pattern Discovery
- Uses search algorithms (A*, heuristic search) to find mood patterns
- Keyword-sentiment correlation analysis
- Temporal pattern detection (day-of-week effects)
- Mood sequence identification

#### Module 5: Rule-Based System
- Logical rules for emotional state evaluation
- Risk assessment for concerning patterns
- Intervention suggestions based on mood thresholds

## 🏗️ Architecture

### Tech Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite/PostgreSQL (Database)
- TextBlob & NLTK (NLP)
- Pydantic (Data validation)
- JWT (Authentication)

**Frontend:**
- React 18 (UI library)
- TypeScript (Type safety)
- Vite (Build tool)
- Tailwind CSS (Styling)
- Recharts (Data visualization)
- Axios (HTTP client)

### Project Structure

```
MindfulAI/
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── api/routes/          # Endpoint handlers
│   │   │   ├── auth.py          # Authentication
│   │   │   ├── entries.py       # Journal CRUD
│   │   │   ├── agent.py         # Agent interactions
│   │   │   └── analytics.py     # Analytics & insights
│   │   ├── services/            # Business logic
│   │   │   ├── nlp_service.py   # Sentiment analysis
│   │   │   ├── agent_service.py # Follow-up generation
│   │   │   └── pattern_service.py# Pattern discovery
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Request/response validation
│   │   ├── auth.py              # JWT utilities
│   │   ├── database.py          # DB configuration
│   │   └── main.py              # App initialization
│   ├── requirements.txt
│   ├── run.py
│   └── .env
│
├── frontend/                     # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── JournalPage.tsx
│   │   │   ├── EntryDetailPage.tsx
│   │   │   └── AnalyticsPage.tsx
│   │   ├── components/         # Reusable components
│   │   ├── services/           # API client
│   │   ├── context/            # React Context
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── SETUP.md                     # Detailed setup guide
├── docker-compose.yml           # Docker configuration
├── quick-start.sh              # Linux/Mac setup script
├── quick-start.bat             # Windows setup script
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Option 1: Automated Setup (Windows)
```bash
.\quick-start.bat
```

### Option 2: Automated Setup (Linux/Mac)
```bash
bash quick-start.sh
```

### Option 3: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
python -m nltk.downloader stopwords punkt
python run.py
```

**Frontend (in another terminal):**
```bash
cd frontend
npm install
npm run dev
```

Then navigate to `http://localhost:5173`

## 📚 API Documentation

When the backend is running, view interactive API docs at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/entries/` | Create journal entry |
| GET | `/api/entries/` | List entries |
| GET | `/api/entries/{id}` | Get entry details |
| PUT | `/api/entries/{id}` | Update entry |
| DELETE | `/api/entries/{id}` | Delete entry |
| POST | `/api/agent/followup` | Get agent follow-up |
| GET | `/api/analytics/summary` | Get analytics summary |
| GET | `/api/analytics/trends` | Get mood trends |

## 🔐 Security

- Passwords hashed with bcrypt
- JWT-based authentication
- CORS protection
- Input validation with Pydantic
- HTTP-only cookie support (recommended for production)

For production deployment:
1. Change `SECRET_KEY` in `.env`
2. Enable HTTPS
3. Use PostgreSQL instead of SQLite
4. Implement rate limiting
5. Add input sanitization

## 🧪 Testing the App

1. **Create Account**: Sign up with email and password
2. **Write Entry**: Create a journal entry with title, content, and mood level
3. **Get Analysis**: Submit entry and receive:
   - Sentiment score
   - Extracted keywords
   - Agent follow-up prompt
4. **View Analytics**: See mood trends, identified patterns, and common keywords
5. **Explore Patterns**: Identify emotional triggers and recurring themes

## 📊 Database Schema

**Users Table**
```
- id (PK)
- email (Unique)
- username (Unique)
- hashed_password
- created_at
```

**Journal Entries Table**
```
- id (PK)
- user_id (FK)
- title
- content
- sentiment_score (-1 to 1)
- keywords (comma-separated)
- mood_level (1-10)
- created_at
```

**Agent Followups Table**
```
- id (PK)
- entry_id (FK)
- prompt (text)
- created_at
```

## 🤖 AI Algorithm Details

### Sentiment Analysis
- Uses TextBlob polarity scores (-1 to 1)
- Normalized to prevent bias
- Combines with keyword extraction for deeper analysis

### Pattern Discovery
- **Keyword Correlation**: Finds words associated with low/high sentiment
- **Temporal Analysis**: Detects day-of-week mood patterns
- **Sequence Detection**: Identifies consecutive low-mood entries
- Patterns ranked by confidence score and frequency

### Intelligent Agent
- Classifies entries into 5 sentiment categories
- Selects from templated prompts matching sentiment
- Supports follow-up depth management

### Rule-Based System
- Evaluates mood thresholds
- Detects risk indicators (harm mentions, prolonged low mood)
- Generates intervention suggestions

## 🚀 Deployment

### Docker Deployment
```bash
docker-compose up
```

This starts:
- Backend (port 8000)
- Frontend (port 3000)
- PostgreSQL database

### Cloud Deployment (Example: Heroku)

**Backend:**
```bash
cd backend
heroku create mindfulai-api
heroku config:set SECRET_KEY=your-secret
git push heroku main
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy dist folder to static hosting (Vercel, Netlify, etc)
```

## 📈 Performance Optimization

- Database indexing on frequently queried fields
- Pagination for entry listings
- Client-side caching with context
- Lazy loading of analytics
- Optimized NLP pipeline

## 🛣️ Future Enhancements

- [ ] Voice journal entries (speech-to-text)
- [ ] Email alerts for concerning patterns
- [ ] Social features (support communities)
- [ ] Mobile app (React Native)
- [ ] Advanced ML predictions
- [ ] Meditation/therapy resource integration
- [ ] Export to PDF reports
- [ ] Goal tracking based on patterns

## ⚠️ Important Disclaimers

**MindfulAI is NOT a substitute for professional mental health care.** 

This application:
- Does not diagnose or treat mental health conditions
- Should complement, not replace, professional therapy
- Provides analysis for self-reflection only
- Should not be used for emergency situations (contact crisis hotlines instead)

## 📝 License

This project is created for educational purposes.

## 🤝 Contributing

This is a course project. For modifications or improvements, please refer to the original documentation.

## 📧 Support

For setup issues, refer to [SETUP.md](./SETUP.md) for detailed troubleshooting.

---

**Built with** ❤️ **using FastAPI, React, and AI**

For more information, see [SETUP.md](./SETUP.md) for detailed setup instructions.
