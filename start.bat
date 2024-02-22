@echo off
echo Starting frontend...
start cmd /k cd frontend && npm run dev

echo Starting backend...
cd backend
call venv\Scripts\activate.bat
start cmd /k python manage.py runserver
