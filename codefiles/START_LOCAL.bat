@echo off
title 🚀 Tarot Reader 777 - Local API Server
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🖥️  LOCAL API SERVER STARTER                      ║
echo ║                                                                  ║
echo ║  This script will start your backend API server locally             ║
echo ║  with GUI interfaces for testing and development              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js first:
    echo    📥 Download: https://nodejs.org/
    echo.
    pause
    exit /b
)

echo ✅ Node.js detected
echo.

:: Navigate to API directory
cd /d "%~dp0"
if exist "api" (
    cd api
    echo ✅ Navigated to API directory
) else (
    echo ❌ API directory not found!
    echo    Make sure you're running this from the project root
    pause
    exit /b
)

:: Check if .env exists
if not exist ".env" (
    if exist ".env.example" (
        echo 📝 Creating .env file from example...
        copy .env.example .env >nul
        echo ✅ .env file created!
        echo ⚠️  Please edit .env file with your credentials:
        echo    - Supabase URL and keys
        echo    - SendGrid API key  
        echo    - JWT secret
        echo.
        echo    Opening .env file for editing...
        notepad .env
        echo.
        echo ⏸️  After editing, run this script again.
        pause
        exit /b
    ) else (
        echo ❌ No .env.example file found!
        echo    Please check your installation.
        pause
        exit /b
    )
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        pause
        exit /b
    )
    echo ✅ Dependencies installed!
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 STARTING LOCAL SERVER                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🌐 Starting API server...
echo 📍 Server will run on: http://localhost:3001
echo 📊 Health check: http://localhost:3001/api/health
echo 🔐 Admin panel: http://localhost:3001/api/auth/login
echo.
echo 💡 GUI Testing Options:
echo    📱 Postman: Import collection from GUI_SETUP_GUIDE.md
echo    🌐 Browser: Open http://localhost:3001/api/health
echo    📊 Database: https://app.supabase.com
echo.
echo ⏹️  Press Ctrl+C to stop the server
echo.

:: Start the server
npm run dev

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    ✅ SERVER STOPPED                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 💡 Server has been stopped. You can restart by running this script again.
echo.
pause
