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

async function renderMovies(movies, containerId, headerId, title) {
  const headerEl = document.getElementById(headerId);
  headerEl.innerHTML = `
    <div class="header-text">
      <span class="small">@Rafe.Studios</span>
      <div class="big-medium-wrapper">
        <div class="big-medium-text">
          <span class="big">${title}</span>
          <span class="medium">(Fim de Semana 1-3 Agosto 2025)</span>
        </div>
        <img src="Imagens/popcorn.png" alt="Popcorn" class="popcorn-icon" />
      </div>
    </div>
  `;

  const container = document.getElementById(containerId).parentElement;
  if (movies.length === 0) return;

  let firstPoster = await fetchPoster(movies[0].filme);
  container.style.setProperty('--poster-url', `url(${firstPoster})`);

  const ul = document.getElementById(containerId);
  const moviesHTML = await Promise.all(movies.map(async (movie) => {
    let diffSimbolo;
    if (movie.lastRank === null) diffSimbolo = 'N';
    else if (movie.lastRank === movie.rank) diffSimbolo = '=';
    else if (movie.lastRank > movie.rank) diffSimbolo = '+';
    else diffSimbolo = '-';

    const posterURL = await fetchPoster(movie.filme);

    return `
      <li class="movie-item" style="--poster-url: url(${posterURL})">
        <span class="rank">${movie.rank}</span>
        <img src="${posterURL}" alt="Poster ${movie.filme}" class="poster" />
        <div class="movie-details">
          <div class="movie-title">${movie.filme}</div>
          <div class="movie-info">
            <div class="left">🇺🇸 ${movie.gross}</div>
            <div class="center">${movie.semanas === 1 ? "Estreia" : movie.percentLW} (${movie.semanas})</div>
            <div class="right">Total: ${movie.total}</div>
          </div>
          <div class="world-total">🌎 Total Mundial: ${movie.worldwide || 'N/A'}</div>
        </div>
        <img src="" alt="Icon" class="icon" data-diff="${diffSimbolo}" />
      </li>
    `;
  }));

  ul.innerHTML = moviesHTML.join('');

  document.querySelectorAll(`#${containerId} .icon`).forEach(icon => {
    const status = icon.dataset.diff;
    switch (status) {
      case 'N': icon.src = 'Imagens/NOVO.PNG'; icon.alt='Novo'; break;
      case '+': icon.src = 'Imagens/SUBIU.PNG'; icon.alt='Subiu'; break;
      case '-': icon.src = 'Imagens/DESCEU.PNG'; icon.alt='Desceu'; break;
      case '=': icon.src = 'Imagens/MANTEU.PNG'; icon.alt='Manteve'; break;
      default: icon.src=''; icon.alt=''; 
    }
  });

  await Promise.all(Array.from(container.querySelectorAll('img')).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => img.onload = resolve);
  }));
}

(async () => {
  const top5Movies = JSON.parse(sessionStorage.getItem('boxOfficeTop5') || '[]');
  const top6Movies = JSON.parse(sessionStorage.getItem('boxOfficeTop6_10') || '[]');

  await renderMovies(top5Movies, 'movieListTop5', 'headerTop5', 'Box Office Top 5');
  await renderMovies(top6Movies, 'movieListTop6', 'headerTop6', 'Box Office Top 6-10');
})();
