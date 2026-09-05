let selectedShows = [];
let searchTimeout;
const recommendationOverlay = document.getElementById("recommendation-overlay");
const recommendationGrid = document.getElementById("recommendation-grid");
const closeRecommendations = document.getElementById("close-recommendations");
const searchResultsSection = document.getElementById("search-results-section");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchSuggestions = document.getElementById("search-suggestions");
const searchResultsGrid = document.getElementById("search-results-grid");

function toggleSelection(item, card) {
    if (selectedShows.includes(item.id)) {
        selectedShows = selectedShows.filter(id => id !== item.id);
        card.classList.remove("selected");
    } else {
        if (selectedShows.length >= 5) {
            return;
        }
        selectedShows.push(item.id);
        card.classList.add("selected");
    }
    document.getElementById("selection-count").textContent =
        `${selectedShows.length}/5 selected`;
}


function createMovieCard(item) {
    const card = document.createElement("div");
    card.classList.add("movie-card");
    const title = item.title || item.name;
    const posterUrl = item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "";
    const description = item.overview
        ? item.overview
        : "No description available.";
    card.innerHTML = `
        <img src="${posterUrl}" alt="${title}">
        <div class="movie-info">
            <h3>${title}</h3>
            <p>⭐ ${item.vote_average.toFixed(1)} • ${item.media_type === "tv" ? "TV Series" : "Movie"}</p>
        </div>
        <div class="movie-overlay">
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
    `;
    return card;
}


searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query === "") {
        return;
    }
    searchSuggestions.innerHTML = "";
    searchResultsSection.style.display = "block";
    searchResultsGrid.innerHTML = "";
    fetch(`https://showmatch-backend.onrender.com/api/search?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            data.results.slice(0, 5).forEach(item => {
                const card = createMovieCard(item);
                searchResultsGrid.appendChild(card);
                card.addEventListener("click", () => {
                    toggleSelection(item, card);
                });
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
});


searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchResultsSection.style.display = "none";
    const query = searchInput.value.trim();
    if (query === "") {
        searchSuggestions.innerHTML = "";
        return;
    }
    searchTimeout = setTimeout(() => {
        fetch(`https://showmatch-backend.onrender.com/api/search?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (searchInput.value.trim() !== query) {
                    return;
                }
                searchSuggestions.innerHTML = "";
                const matchingResults = data.results.filter(item => {
                    const title = item.title || item.name;
                    return title.toLowerCase().startsWith(query.toLowerCase());
                });
                matchingResults.slice(0, 5).forEach(item => {
                    const suggestion = document.createElement("div");
                    const title = item.title || item.name;
                    suggestion.textContent = title;
                    searchSuggestions.appendChild(suggestion);
                    suggestion.addEventListener("click", () => {
                        searchSuggestions.innerHTML = "";
                        searchResultsSection.style.display = "block";
                        searchResultsGrid.innerHTML = "";
                        const card = createMovieCard(item);
                        searchResultsGrid.appendChild(card);
                        card.addEventListener("click", () => {
                            toggleSelection(item, card);
                        });
                    });
                });
            });
    }, 300);
});


fetch("https://showmatch-backend.onrender.com/api/trending")
    .then(response => response.json())
    .then(data => {
        const movieGrid = document.getElementById("movie-grid");
        data.results.forEach(item => {
            const card = createMovieCard(item);
            movieGrid.appendChild(card);
            card.addEventListener("click", () => {
                toggleSelection(item, card);
            });
        });
    })


document.getElementById("recommend-button").addEventListener("click", () => {

    fetch("https://showmatch-backend.onrender.com/api/recommend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            selected_ids: selectedShows
        })
    })
    .then(response => response.json())
    .then(data => {
    console.log("Recommendations:", data);
    recommendationGrid.innerHTML = "";
    data.forEach(id => {
        fetch(`https://showmatch-backend.onrender.com/api/movie/${id}`)
            .then(response => response.json())
            .then(item => {
                const card = createMovieCard(item);
                recommendationGrid.appendChild(card);
            })
            .catch(error => {
                console.error("Error getting movie details:", error);
            });
    });
    recommendationOverlay.style.display = "block";
})
    .catch(error => {
        console.error("Error:", error);
    });

});

closeRecommendations.addEventListener("click", () => {
    recommendationOverlay.style.display = "none";
});