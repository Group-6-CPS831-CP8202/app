@echo off
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo Setting up backend...
cd backend
python -m venv venv 
call venv\Scripts\activate.bat
pip install -r requirements.txt
deactivate
cd ..