# Installation Manual

Before running any of the scripts below please make sure you have the minimum installed versions of Python and Node:

- Python >= 3.12.2
- Node >= 20.11.1

Scripts are provided to allow easy installation, running, and tests. Below are the explanations on what each script does.

1. Install the dependencies via the `./install.sh` (or `./install.bat` on Windows) script

    1. Navigates to the frontend directory and runs `npm install` to install the frontend dependencies
    2. Navigates to the backend directory and creates a python virtual environment in the `backend` directory using `python -m venv venv`
    3. Activates the python virtual environment using `venv/Scripts/activate` (`venv/Scripts/activate.bat` on Windows)
    4. Installs the backend requirements using `pip install -r requirements.txt`
        - Exit the virtual environment using `deactivate` command.

2. Run the local servers via the `./start.sh` (or `./install.bat` on Windows) script

    1. Navigates to the frontend directory, and opens up a new terminal with the command `npm run dev`, to start the frontend development server
    2. Navigates to the backend directory, and activates the virtual environment using `venv/Scripts/activate` (`venv/Scripts/activate.bat` on Windows)
    3. Writes SQL migrations made to the backend models using `python manage.py makemigrations`, and then applies them using `python manage.py migrate`
    4. Opens a new terminal and starts the backend using `python manage.py runserver`

3. Run tests via the `./test.sh` (or `./test.bat` on Windows) script
   1. Navigates to the backend directory, and activates the virtual environment using `venv/Scripts/activate` (`venv/Scripts/activate.bat` on Windows)
   2. Runs the tests in a new terminal using `python manage.py test`

The frontend server should be accessible from [http://localhost:5173/](http://localhost:5173/)

- The port is important because it needs to be explicitly set for security purposes.

The backend server should be accessible from [http://localhost:8000/admin](http://localhost:8000/admin)

- The admin login is:
  - Username: `root`
  - Password: `123`
