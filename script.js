const apiKey = sessionStorage.getItem('tmdb_api_key');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');

if (!apiKey) {
  window.location.href = 'index.html';
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const trendingMovies = document.getElementById('trendingMovies');
const trendingTV = document.getElementById('trendingTV');
const searchSection = document.getElementById('searchSection');
const searchResults = document.getElementById('searchResults');

async function fetchTrendingMovies() {
  const url = `${TMDB_BASE_URL}/trending/movie/week?api_key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  displayResults(data.results, trendingMovies);
}

async function fetchTrendingTV() {
  const url = `${TMDB_BASE_URL}/trending/tv/week?api_key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  displayResults(data.results, trendingTV);
}

async function searchTMDB(query) {
  const url = `${TMDB_BASE_URL}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    searchResults.innerHTML = '<p class="no-results">No results found.</p>';
  } else {
    displayResults(data.results, searchResults);
  }

  searchSection.style.display = 'block';
}

function displayResults(items, container) {
  container.innerHTML = '';

  items.forEach(item => {
    const title = item.title || item.name;
    const image = item.poster_path
      ? `${IMG_BASE_URL}${item.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image';
    const mediaType = item.media_type ? item.media_type.toUpperCase() : 'MOVIE';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${image}" alt="${title}" />
      <div class="card-info">
        <h3>${title}</h3>
        <p class="meta">${mediaType}</p>
        <div class="rating">⭐ ${rating}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) searchTMDB(query);
  }
});

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('tmdb_api_key');
  window.location.href = 'index.html';
});

// Fetch both movies and TV shows
fetchTrendingMovies();
fetchTrendingTV();
