@echo off
REM filepath: f:\chop-now\start-app.bat
echo ========================================
echo    🚀 Starting ChopNow Food Delivery App
echo ========================================
echo.

REM Check if Docker is running
echo 🐳 Checking Docker status...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running or not installed!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo ✅ Docker is running

REM Start Docker services
echo.
echo 🗄️  Starting database services...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ❌ Failed to start Docker services!
    pause
    exit /b 1
)
echo ✅ Database services started

REM Wait for services to be ready
echo.
echo ⏳ Waiting for services to initialize (10 seconds)...
timeout /t 10 /nobreak >nul

REM Start Backend Server
echo.
echo 🚀 Starting Backend Server...
start "ChopNow Backend" cmd /k "cd /d %~dp0backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo.
echo 🎨 Starting Frontend Server...
start "ChopNow Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

REM Wait for frontend to start
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo    🎉 ChopNow App Started Successfully!
echo ========================================
echo.
echo 🌐 Service URLs:
echo    • Main App:      http://localhost:3000
echo    • Backend API:   http://localhost:5000
echo    • Database GUI:  http://localhost:5050
echo    • Redis GUI:     http://localhost:8081
echo.
echo 👤 Test Accounts (password same as username part):
echo    • Admin:         admin@chopnow.com / admin123
echo    • Restaurant:    owner@restaurant.com / owner123
echo    • Customer:      customer@example.com / customer123
echo    • Rider:         rider@delivery.com / rider123
echo.
echo 🛠️  Commands:
echo    • Stop services: double-click stop-app.bat
echo    • Database GUI:  npm run db:studio (in backend folder)
echo.

REM Open the app in default browser
echo 🌐 Opening app in your default browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo ✅ Setup complete! Check the opened terminal windows for logs.
echo.
echo Press any key to close this window...
pause >nul