from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from recommender import recommend
from dotenv import load_dotenv
import os




app = Flask(__name__)
CORS(app)

load_dotenv()
TMDB_TOKEN = os.getenv("TMDB_TOKEN")


@app.route("/")
def home():
    return "ShowMatch backend is running!"


@app.route("/api/trending")
def trending():
    url = "https://api.themoviedb.org/3/trending/all/week"

    headers = {
        "Authorization": f"Bearer {TMDB_TOKEN}",
        "accept": "application/json"
    }

    response = requests.get(url, headers=headers)

    return jsonify(response.json())






@app.route("/api/search")
def search():
    query = request.args.get("query")
    print("User searched:", query)
    url = "https://api.themoviedb.org/3/search/multi"
    headers = {
        "Authorization": f"Bearer {TMDB_TOKEN}",
        "accept": "application/json"
    }
    params = {
        "query": query
    }
    response = requests.get(url, headers=headers, params=params)
    return jsonify(response.json())


@app.route("/api/recommend",methods=["POST"])
def get_recommendations():
     data=request.get_json()
     selected_ids=data["selected_ids"]
     recommendations=recommend(selected_ids)
     return jsonify(recommendations)


@app.route("/api/movie/<int:movie_id>")
def movie_details(movie_id):
    headers = {
        "Authorization": f"Bearer {TMDB_TOKEN}",
        "accept": "application/json"
    }
    movie_url = f"https://api.themoviedb.org/3/movie/{movie_id}"
    response = requests.get(movie_url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        data["media_type"] = "movie"
        return jsonify(data)
    tv_url = f"https://api.themoviedb.org/3/tv/{movie_id}"
    response = requests.get(tv_url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        data["media_type"] = "tv"
        return jsonify(data)
    return jsonify({"error": "Movie or TV show not found"}), 404

if __name__ == "__main__":
        app.run(debug=True)

    