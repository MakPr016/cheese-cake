@echo off
echo ========================================
echo  Android AI Assistant - ADB Automation
echo ========================================
echo.

REM Check if ADB is installed
where adb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ADB not found in PATH!
    echo Please install Android SDK Platform Tools and add to PATH.
    echo See ADB_SETUP_GUIDE.md for instructions.
    pause
    exit /b 1
)

echo [OK] ADB found
echo.

REM Check device connection
echo Checking device connection...
adb devices | findstr "device" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] No device connected!
    echo Please connect your device via USB or WiFi.
    echo See ADB_SETUP_GUIDE.md for instructions.
    echo.
    pause
)

echo [OK] Device connected
echo.

REM Start ADB agent
echo Starting ADB Agent...
cd adb-agent
start "ADB Agent" cmd /k "npm start"

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo ADB Agent is now running on http://localhost:3000
echo.
echo Next steps:
echo 1. Start your Expo app: npm start
echo 2. Open the app on your phone
echo 3. Go to Automation tab
echo 4. Try: "Text Jutin on WhatsApp and ask if he is coming to the party tomorrow?"
echo.
echo Press any key to exit...
pause >nul
