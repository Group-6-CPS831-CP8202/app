@echo off
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo Setting up backend...
cd backend
python -m venv venv  # This creates a venv directory inside backend
call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..
