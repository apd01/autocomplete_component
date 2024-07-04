# Autocomplete Component

## Description

An autocomplete component built with React, designed to provide real-time suggestions as the user types. On the backend, a Python FastAPI application serves the autocomplete suggestions.

Requires: Node.js (version 14 or later) and Python (version 3.7 or later)

## Installation

1. Clone the repository

```
   git clone https://github.com/apd01/autocomplete_component.git
```

2. **Install frontend dependencies** Navigate to the frontend directory and install its dependencies:

```sh
cd autocomplete_component/autocomplete
npm install
```

3. **Start the node server**:

```sh
npm start
```

4. **Install backend dependencies**: Open a new terminal or command prompt, ensuring you start from the project's root directory. Then move to the backend directory and install required Python packages:

```sh
cd autocomp-api
pip install -r requirements.txt
```

5. **Start the Python API/backend server**: Launch the backend server to start serving autocomplete suggestions:

```sh
python -m uvicorn suggestions_api:app
```

## Usage

- Type a query into the search bar to see autocompletion suggestions.

## Video Demo

[Link to video demo](www.example.com)

## Author

- Alan Dunne
