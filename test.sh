#!/bin/bash

# Navigate to your Django project directory
cd backend || exit

# Activate the virtual environment
source venv/bin/activate

# Run Django tests
echo "Running Django tests..."
python manage.py test