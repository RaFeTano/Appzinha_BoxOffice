const tmdbApiKey = '9c2f7a7aaf9a57d7c1578d1d4f1f0145'; // tua chave TMDb

// Busca poster TMDb pelo título e ano atual
async function fetchPoster(title) {
  const year = new Date().getFullYear();
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(title)}&year=${year}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.results && data.results.length > 0 && data.results[0].poster_path) {
      return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
    } else {
      return 'https://via.placeholder.com/50x70?text=No+Image';
    }
  } catch (e) {
    console.error('Erro a buscar poster:', e);
    return 'https://via.placeholder.com/50x70?text=No+Image';
  }
}

// Ajusta tamanho da fonte do título para caber numa largura máxima
function ajustarTamanhoFonte(text, maxWidthPx, maxFontSize = 24, minFontSize = 12) {
  let fontSize = maxFontSize;
  const approxCharWidthFactor = 0.6;
  while (text.length * fontSize * approxCharWidthFactor > maxWidthPx && fontSize > minFontSize) {
    fontSize -= 1;
  }
  return fontSize;
}

async function renderTop10(movies) {
  const ano = new Date().getFullYear();
  // Header
  document.getElementById('header').innerHTML = `
    <div class="header-text">
      <span class="small">@Rafe.Studios</span>
      <div class="big-medium-wrapper">
        <div class="big-medium-text">
          <span class="big">Top 10 de filmes</span>
          <span class="medium">Mundo ${ano}</span>
        </div>
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Popcorn_icon.svg" alt="Popcorn" style="width:30px; height:30px; margin-left:10px;" />
      </div>
    </div>
  `;

  const ul = document.getElementById('movieList');

  if (movies.length === 0) {
    ul.innerHTML = '<li>Nenhum dado para mostrar.</li>';
    return;
  }

  const maxTitleWidthPx = 300;

  const moviesHTML = await Promise.all(movies.map(async movie => {
    const posterURL = await fetchPoster(movie.filme);

    // Ajusta fonte do título
    const fontSize = ajustarTamanhoFonte(movie.filme, maxTitleWidthPx);

    return `
      <li class="movie-item" style="--poster-url: url(${posterURL})">
        <span class="rank">${movie.rank}</span>
        <div class="movie-details" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <div class="movie-title" style="font-weight:bold; font-size:${fontSize}px; max-width:${maxTitleWidthPx}px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align:left;">
            ${movie.filme}
          </div>
          <div class="worldwide-total" style="font-weight:bold; font-size:18px; min-width:120px; text-align:right;">
            ${movie.worldwide}
          </div>
        </div>
      </li>
    `;
  }));

  ul.innerHTML = moviesHTML.join('');
}

(async () => {
  const movies = JSON.parse(sessionStorage.getItem('top10Worldwide') || '[]');
  await renderTop10(movies);
})();
