@echo off
echo Starting frontend...
cd frontend
start cmd /k npm run dev

cd ../backend
call venv\Scripts\activate.bat
echo Making migrations...
python manage.py makemigrations
echo Applying migrations...
python manage.py migrate
echo Starting backend...
start cmd /k python manage.py runserver

