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
