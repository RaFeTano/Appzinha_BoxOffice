const tmdbApiKey = '9c2f7a7aaf9a57d7c1578d1d4f1f0145';

async function fetchPoster(title) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(title)}&year=2025`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.results && data.results.length > 0 && data.results[0].poster_path) {
      return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
    } else {
      return 'https://via.placeholder.com/50x70?text=No+Image';
    }
  } catch (error) {
    console.error('Erro ao buscar poster:', error);
    return 'https://via.placeholder.com/50x70?text=No+Image';
  }
}

async function renderTop10() {
  const movies = JSON.parse(sessionStorage.getItem('top10Worldwide') || '[]');
  const ul = document.getElementById('movieList');
  if (!ul) return;

  if (movies.length === 0) {
    ul.innerHTML = '<li>Nenhum dado para mostrar.</li>';
    return;
  }

  let containerPoster = '';

  const itemsHTML = await Promise.all(movies.map(async (movie) => {
    const posterURL = await fetchPoster(movie.filme);
    console.log(movie.worldwide); // Confirma os valores

    // Guarda o poster do primeiro filme para o container background
    if (movie.rank === 1) {
      containerPoster = posterURL;
    }

    return `
      <li class="movie-item" style="--poster-url: url(${posterURL})">
        <span class="rank">${movie.rank}</span>
        <div class="movie-details">
          <div class="movie-title">${movie.filme}</div>
          <div class="worldwide-total">${movie.worldwide}</div>
        </div>
      </li>
    `;
  }));

  ul.innerHTML = itemsHTML.join('');

  // Aplica o poster no container
  if (containerPoster) {
    const container = document.querySelector('.container');
    if (container) {
      container.style.setProperty('--poster-url', `url(${containerPoster})`);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderTop10();
});
