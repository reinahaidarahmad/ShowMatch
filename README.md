ShowMatch

ShowMatch is a movie and TV show recommendation web application that helps users discover what to watch based on their favorite movies and TV shows.

Features

- Search for movies and TV shows
- View trending movies and TV shows
- Select 1–5 favorite movies or TV shows
- Receive personalized recommendations
- View movie and TV show ratings and descriptions
- Responsive design for desktop and mobile

Technologies

Frontend

- HTML
- CSS
- JavaScript

Backend

- Python
- Flask
- Flask-CORS

Machine Learning

- Pandas
- Scikit-learn
- TF-IDF
- Cosine Similarity

API

- TMDB API

Version Control and Deployment

- Git
- GitHub
- Render

Recommendation System

ShowMatch uses a content-based recommendation system.

The tags of movies and TV shows are converted into numerical vectors using TF-IDF. Cosine similarity is then used to measure the similarity between items.

When users select their favorite movies or TV shows, the system calculates their similarity to the other items in the dataset and returns the 10 most similar recommendations.


Deployment

The frontend and backend are deployed separately using Render.

- Frontend: Render Static Site
- Backend: Render Web Service

The TMDB API token is stored securely using environment variables.

Purpose

This project was developed to apply machine learning, web development, API integration, version control, and deployment concepts in a complete end-to-end application.
