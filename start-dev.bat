@echo off
echo Starting NFC Development Environment...
echo.

echo Starting Django Backend...
cd Backend
start "Django Backend" cmd /k "python manage.py runserver"

echo.
echo Starting React Frontend...
cd ../frontend/nfc_f
start "React Frontend" cmd /k "npm run dev"

echo.
echo Development servers are starting...
echo Django Backend: http://localhost:8000
echo React Frontend: http://localhost:5173
echo.
echo Press any key to exit this script (servers will continue running)
pause > nul 