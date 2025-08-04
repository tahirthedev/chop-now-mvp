@echo off
REM filepath: f:\chop-now\stop-app.bat
echo ========================================
echo    🛑 Stopping ChopNow Food Delivery App
echo ========================================
echo.

REM Stop Docker services
echo 🐳 Stopping Docker services...
docker-compose down
if %errorlevel% equ 0 (
    echo ✅ Docker services stopped
) else (
    echo ⚠️  Docker services may already be stopped
)

REM Kill Node.js processes (Backend and Frontend)
echo.
echo 🚀 Stopping Node.js servers...
taskkill /f /im node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js processes stopped
) else (
    echo ⚠️  No Node.js processes found running
)

REM Kill any remaining npm processes
taskkill /f /im npm.cmd >nul 2>&1
taskkill /f /im npm >nul 2>&1

REM Close any ChopNow terminal windows
echo.
echo 💻 Closing terminal windows...
taskkill /fi "WindowTitle eq ChopNow Backend*" /f >nul 2>&1
taskkill /fi "WindowTitle eq ChopNow Frontend*" /f >nul 2>&1

echo.
echo ========================================
echo    ✅ ChopNow App Stopped Successfully!
echo ========================================
echo.
echo All services have been stopped:
echo  ✅ Docker containers (PostgreSQL, Redis, pgAdmin)
echo  ✅ Backend server (Node.js)
echo  ✅ Frontend server (Next.js)
echo  ✅ Terminal windows closed
echo.
echo 🚀 To restart the app, double-click start-app.bat
echo.
echo Press any key to close this window...
pause >nul