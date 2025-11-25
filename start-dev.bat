@echo off
echo ========================================
echo   PromptForge AI - Development Setup
echo ========================================
echo.

REM Check if backend dependencies are installed
if not exist "server\node_modules\" (
    echo [1/3] Installing backend dependencies...
    cd server
    call npm install
    cd ..
    echo.
) else (
    echo [1/3] Backend dependencies already installed
    echo.
)

REM Check if backend .env exists
if not exist "server\.env" (
    echo [WARNING] Backend .env file not found!
    echo Please copy server\.env.example to server\.env
    echo and add your OAuth credentials.
    echo.
    echo See SETUP_OAUTH.md for instructions.
    echo.
    pause
    exit /b 1
)

REM Check if frontend .env.local exists
if not exist ".env.local" (
    echo [WARNING] Frontend .env.local file not found!
    echo Please ensure .env.local exists with your API keys.
    echo.
    pause
    exit /b 1
)

echo [2/3] Starting backend server...
start "PromptForge Backend" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Starting frontend...
start "PromptForge Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers Starting!
echo ========================================
echo   Backend:  http://localhost:3001
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to stop all servers...
pause >nul

REM Stop servers
taskkill /FI "WindowTitle eq PromptForge Backend*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq PromptForge Frontend*" /T /F >nul 2>&1

echo Servers stopped.
