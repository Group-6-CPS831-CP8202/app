#!/bin/bash

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend || exit
npm install

cd ..

# Setup backend virtual environment and install dependencies
echo "Setting up backend..."
cd backend || exit
python3 -m venv venv  # This creates a venv directory inside backend
source venv/bin/activate
pip install -r requirements.txt

cd ..
