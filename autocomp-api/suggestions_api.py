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


# Calculate the rank of a suggestion based on the queries
def calculate_rank(queries, suggestion):
    suggestion_words = suggestion.lower().split()
    rank = 0
    for query_word in queries:
        try:
            rank += suggestion_words.index(query_word)
        except ValueError:
            # If the query word is not found in the suggestion, add a penalty to the rank
            rank += len(suggestion_words) * 10
    # Minor penalty for extra words in the suggestion
    rank += abs(len(suggestion_words) - len(queries))
    return rank


def find_suggestions(query: str, data: dict) -> List[str]:
    query = query.lower()
    suggestions = []

    queries = [word for word in query.split(" ") if word and len(word) > 1]

    for word in queries:
        print(f"Searching for: '{word}'")
        for artist in data:
            artist_recognized = False
            artist_name_lower = artist["name"].lower()
            if word in artist_name_lower:
                suggestions.append(artist["name"])
                artist_recognized = True

            if artist_recognized:
                for album in artist["albums"]:
                    suggestions.append(artist["name"] + " " + album["title"])
                    for song in album["songs"][0:3]:
                        suggestions.append(
                            artist["name"] + " " + album["title"] + " " + song["title"]
                        )

            for album in artist["albums"]:
                album_title_lower = album["title"].lower()
                if word in album_title_lower:
                    suggestions.append(album["title"] + " " + artist["name"])

                    for song in album["songs"]:
                        suggestions.append(
                            album["title"] + " " + artist["name"] + " " + song["title"]
                        )

                for song in album["songs"]:
                    song_title_lower = song["title"].lower()
                    if word in song_title_lower:
                        suggestions.append(
                            song["title"] + " " + album["title"] + " " + artist["name"]
                        )

    ranked_suggestions = sorted(suggestions, key=lambda x: calculate_rank(queries, x))

    return ranked_suggestions[:10]


with open("data.json", "r", encoding="utf-8") as file:
    music_data = json.load(file)


@app.get("/suggestions", response_model=List[str])
async def read_suggestions(query: str) -> List[str]:
    suggestions = find_suggestions(query, music_data)
    return suggestions
