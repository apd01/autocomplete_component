from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json


app = FastAPI()

# Allow cross-origin resource sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def find_suggestions(query: str, data: dict) -> List[str]:
    query = query.lower()
    suggestions = []

    for band in data:
        band_name_lower = band["name"].lower()
        print(band_name_lower)
        if band_name_lower.startswith(query):
            suggestions.append(band["name"])

    return suggestions


# Load suggestions from a json
with open("data.json", "r") as file:
    music_data = json.load(file)


@app.get("/suggestions", response_model=List[str])
async def read_suggestions(query: str) -> List[str]:

    print(f"Received query: {query}")

    suggestions = find_suggestions(query, data=music_data)
    return suggestions
