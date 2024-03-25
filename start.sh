#!/bin/bash

# Start frontend
echo "Starting frontend..."
cd frontend || exit
npm run dev &

# Start backend
cd backend || exit
source venv/bin/activate
echo "Making migrations..."
python manage.py makemigrations
echo "Migrating..."
python manage.py migrate
echo "Starting backend..."
python manage.py runserver
