const apiKey = sessionStorage.getItem('tmdb_api_key');
const content = document.getElementById('content');
const searchInput = document.getElementById('searchInput');
const logoutBtn = document.getElementById('logoutBtn');

if (!apiKey) {
  window.location.href = 'index.html';
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function fetchTrending() {
  const url = `${TMDB_BASE_URL}/trending/all/week?api_key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  displayResults(data.results);
}

async function searchTMDB(query) {
  const url = `${TMDB_BASE_URL}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  displayResults(data.results);
}

function displayResults(items) {
  content.innerHTML = '';

  if (!items || items.length === 0) {
    content.innerHTML = '<p class="no-results">No results found.</p>';
    return;
  }

  items.forEach(item => {
    const title = item.title || item.name;
    const image = item.poster_path ? `${IMG_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
    const mediaType = item.media_type ? item.media_type.toUpperCase() : 'UNKNOWN';
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
    content.appendChild(card);
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

fetchTrending();
