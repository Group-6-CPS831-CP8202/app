@echo off
echo Starting frontend...
cd frontend
start cmd /k npm run dev

cd backend
call venv\Scripts\activate.bat
echo Making migrations...
start cmd /k python manage.py makemigrations
echo Applying migrations...
start cmd /k python manage.py migrate
echo Starting backend...
start cmd /k python manage.py runserver

