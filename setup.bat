@echo off
color 0A
cls

echo.
echo ============================================
echo   Tea Shop Billing System - Setup Script
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Node.js is not installed. 
    echo     Please install Node.js 16 or higher from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i

echo [✓] Node.js version: %NODE_VERSION%
echo [✓] npm version: %NPM_VERSION%
echo.

REM Create .env if it doesn't exist
if not exist .env (
    echo [*] Creating .env file...
    copy .env.example .env
    echo [✓] .env file created. Please update it with your values.
) else (
    echo [✓] .env file already exists.
)

echo.
echo [*] Installing root dependencies...
call npm install

echo.
echo [*] Installing backend dependencies...
cd backend
call npm install
echo [✓] Backend dependencies installed
cd ..

echo.
echo [*] Installing frontend dependencies...
cd frontend
call npm install
echo [✓] Frontend dependencies installed
cd ..

echo.
echo ============================================
echo [✓] Setup complete!
echo ============================================
echo.
echo To start development servers, run:
echo   npm run dev
echo.
echo Backend will run on:  http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo For deployment on Vercel, see README.md
echo ============================================
echo.
pause
