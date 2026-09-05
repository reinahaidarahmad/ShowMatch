import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer 
from sklearn.metrics.pairwise import cosine_similarity

movies=pd.read_csv("ourdataset.csv")

print("dataset loaded:",len(movies))


vectorizer=TfidfVectorizer()
vectors=vectorizer.fit_transform(movies["tags"])
print("vectors created:",vectors.shape)




def recommend(selected_ids):
    selected_indices = movies[
        movies["id"].isin(selected_ids)
    ].index.tolist()
    if not selected_indices:
        return []
    selected_vectors = vectors[selected_indices]
    selected_similarities = cosine_similarity(
    selected_vectors,
    vectors)
    
    average_similarity = selected_similarities.mean(axis=0)
    average_similarity[selected_indices] = -1
    top_indices = average_similarity.argsort()[::-1]
    top_indices = top_indices[:25]
    recommendations = movies.iloc[top_indices]
    recommendations = recommendations.sort_values(
        by="vote_average",
        ascending=False
    )
    return recommendations["id"].tolist()
