# CPS831-CP8202 Term Project

Team: Group 6

Members:

- Brandon Ly (@brandonnly)
- Ankit Sodhi (@a4sodhi)
- Maisha Labiba (@Alina2614)
- James Williamson (@Mechan0)

## Running Locally

### Requirements

- Python $\ge$ 3.12.2
- Node $\ge$ 20.11.1

### Install and Run

A deeper explanation towards the installation and running of the project can be found in [INSTALL.md](INSTALL.md)

1. Install the dependencies via the `./install.sh` (or `./install.bat` on Windows)

2. Run the local servers via the `./start.sh` (or `./install.bat` on Windows)
  
## Developing

While the install scripts should install all the correct dependencies there are some edge cases.

### Adding New Dependencies

#### Frontend

- Make sure you're in the `frontend/` directory before using `npm install`, or it will attempt to install the modules in the root directory

#### Backend

- After installing a new dependency, `cd` into the `backend/` directory and run `pip freeze > requirements.txt` to update the requirements
  - Make sure you've activated your virtual environment first via `source /backend/venv/bin/activate` (`/backend/venv/bin/activate.bat` on Windows)

### BiomesJS

We're using [Biomejs](https://biomejs.dev/) for automatic code formatting and linting. Opening the Repo in VSCode should prompt you to install the recommended extensions.

You may get an error saying that biome isn't installed, just click install/download.

## Common Issues

> All of the requests on the frontend are failing

Double check that the local frontend server is running on either `127.0.0.0:5173` or `localhost:5173`. The CORS headers are set to only receive requests from specific origins for security reasons.
