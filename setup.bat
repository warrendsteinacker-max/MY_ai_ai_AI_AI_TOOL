@echo off
echo 🚀 Starting AI Task Master Setup...

:: 1. Setup Backend
echo 🐍 Setting up Python Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install fastapi uvicorn playwright pytesseract pillow openai python-dotenv
python -m playwright install chromium
cd ..

:: 2. Setup Frontend
echo ⚡ Setting up Vite Frontend...
cd frontend
npm install
cd ..

echo ✅ Setup Complete! 
echo To start the project:
echo 1. In Terminal 1: cd backend ^&^& venv\Scripts\activate ^&^& uvicorn main:app --reload
echo 2. In Terminal 2: cd frontend ^&^& npm run dev
pause