@echo off
echo ========================================
echo  ADB Automation - Test Suite
echo ========================================
echo.

REM Check if server is running
curl -s http://localhost:3000/status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ADB agent is not running!
    echo.
    echo Please start the agent first:
    echo   npm start
    echo.
    pause
    exit /b 1
)

echo [OK] ADB agent is running
echo.
echo Starting test suite...
echo.

node run-tests.js

echo.
pause
