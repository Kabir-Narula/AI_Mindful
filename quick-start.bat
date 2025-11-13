@echo off
setlocal enabledelayedexpansion

echo MindfulAI Setup
echo ===============
echo.

REM Backend Setup
echo Setting up backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt

echo Downloading NLTK data...
python -m nltk.downloader stopwords punkt

echo Initializing database...
python -c "from app.database import init_db; init_db()"

echo Backend setup complete!
echo.
echo To start backend, run: cd backend ^&^& python run.py
echo.

REM Frontend Setup
echo Setting up frontend...
cd ..\frontend

echo Installing dependencies...
call npm install

echo Frontend setup complete!
echo To start frontend, run: cd frontend ^&^& npm run dev
echo.

echo ===============
echo Setup complete!
echo.
echo Next steps:
echo 1. Open PowerShell/CMD 1: cd backend ^&^& python run.py
echo 2. Open PowerShell/CMD 2: cd frontend ^&^& npm run dev
echo 3. Navigate to http://localhost:5173
echo.

pause
