@echo off

cd backend
call venv\Scripts\activate.bat
echo Running Django Tests...
start cmd /k python manage.py test
deactivate
cd ..