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

    queries = [
        word for word in query.split(" ") if word and len(word) > 1
    ]  # the list comprehension removes empty strings

    for word in queries:
        print(f"Searching for: '{word}'")
        for band in data:
            band_name_lower = band["name"].lower()
            if word in band_name_lower:
                suggestions.append(band["name"])

            for album in band["albums"]:
                album_title_lower = album["title"].lower()
                if word in album_title_lower:
                    suggestions.append(album["title"] + " " + band["name"])

                    for song in album["songs"]:
                        suggestions.append(
                            album["title"] + " " + band["name"] + " " + song["title"]
                        )

                for song in album["songs"]:
                    song_title_lower = song["title"].lower()
                    if word in song_title_lower:
                        suggestions.append(
                            song["title"] + " " + album["title"] + " " + band["name"]
                        )

    # sort suggestions by length
    suggestions.sort(key=len)

    # remove duplicates
    suggestions = list(dict.fromkeys(suggestions))

    return suggestions[:10]  # Limit the number of suggestions to 10


# Load suggestions from a json
with open("data.json", "r", encoding="utf-8") as file:
    music_data = json.load(file)


@app.get("/suggestions", response_model=List[str])
async def read_suggestions(query: str) -> List[str]:

    suggestions = find_suggestions(query, music_data)

    return suggestions
