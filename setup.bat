@echo off
echo 🚀 Starting AI Task Master Setup (Node.js Version)...

:: 1. Setup Backend
echo 🟢 Setting up Node.js Backend...
cd backend
if not exist package.json (
    echo ❌ Error: package.json not found in backend folder!
    pause
    exit
)
call npm install
call npx playwright install chromium
cd ..

:: 2. Setup Frontend
echo 🔵 Setting up Vite Frontend...
cd vite-project
call npm install
cd ..

echo ✅ Setup Complete! 
echo --------------------------------------------------
echo To start the project:
echo 1. Terminal 1 (Backend): cd backend ^&^& node server.js
echo 2. Terminal 2 (Frontend): cd vite-project ^&^& npm run dev
echo --------------------------------------------------
pause