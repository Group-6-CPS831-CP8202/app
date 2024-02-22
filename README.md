# CPS831-CP8202 Term Project

Team: Group 6

Members:

- Maisha Labiba
- Brandon Ly
- Ankit Sodhi
- James Williamson

## Running Locally

### Requirements

- Python $\ge$ 3.12.2
- Node $\ge$ 20.11.1

### Install and Run

1. Install the dependencies via the `./install.sh` (or `./install.bat` on Windows)

   - Creates a python virtual enviroment in the `backend` directory and installs the requirements
   - Installs all the required npm packages in the frontend

2. Run the local servers via the `./start.sh` (or `./install.bat` on Windows)

## Developing

While the install scripts should install all the correct dependencies there are some edge cases.

### BiomesJS

We're using [Biomejs](https://biomejs.dev/) for automatic code formatting and linting. Opening the Repo in VSCode should prompt you to install the recommended extensions.

You may get an error saying that biome isn't installed, just click install/download.
