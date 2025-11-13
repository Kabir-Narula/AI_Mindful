#!/bin/bash

# MindfulAI Quick Start Script

set -e

echo "MindfulAI Setup"
echo "==============="

# Backend Setup
echo ""
echo "Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

echo "Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Downloading NLTK data..."
python -m nltk.downloader stopwords punkt

echo "Initializing database..."
python -c "from app.database import init_db; init_db()"

echo "Backend setup complete!"
echo "To start backend, run: cd backend && python run.py"

# Frontend Setup
echo ""
echo "Setting up frontend..."
cd ../frontend

echo "Installing dependencies..."
npm install

echo "Frontend setup complete!"
echo "To start frontend, run: cd frontend && npm run dev"

echo ""
echo "==============="
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Open Terminal 1: cd backend && python run.py"
echo "2. Open Terminal 2: cd frontend && npm run dev"
echo "3. Navigate to http://localhost:5173"
echo ""
