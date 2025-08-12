function getRange() {
  const params = new URLSearchParams(window.location.search);
  return params.get('range') || 'top5';
}

const tmdbApiKey = '9c2f7a7aaf9a57d7c1578d1d4f1f0145'; // substitui pela tua chave TMDb

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

function mapShortToFull(textoCurto) {
  // exemplo: "Semana 32 — 8 - 10 Ago"
  // Extrair só a parte da data: "8 - 10 Ago"
  const mesesPorExtenso = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const currentYear = new Date().getFullYear();
  const regex = /Semana \d+ — (\d+) - (\d+) (\w{3})/;
  const match = textoCurto.match(regex);
  if (!match) return textoCurto; // se falhar, retorna o original

  const diaInicio = match[1];
  const diaFim = match[2];
  const mesAbrev = match[3];

  // Converter mês abreviado para índice
  const indexMes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].indexOf(mesAbrev);
  if (indexMes === -1) return textoCurto;

  const mesCompleto = mesesPorExtenso[indexMes];

  return `(Fim de Semana) ${diaInicio} - ${diaFim} ${mesCompleto} ${currentYear}`;
}

async function renderMovies(movies, title, range) {
  // Obtem o fim de semana selecionado do sessionStorage
  const selectedWeekend = sessionStorage.getItem('selectedWeekend') || title;

  document.getElementById('header').innerHTML = `
    <div class="header-text">
      <span class="small">@Rafe.Studios</span>
      <div class="big-medium-wrapper">
        <div class="big-medium-text">
          <span class="big">${title}</span>
          <span class="medium">${mapShortToFull(selectedWeekend)}</span>
        </div>
        <img src="Imagens/popcorn.png" alt="Popcorn" class="popcorn-icon" />
      </div>
    </div>
  `;

  const ul = document.getElementById('movieList');
  if (movies.length === 0) {
    ul.innerHTML = '<li>Nenhum dado para mostrar.</li>';
    return;
  }

  let containerPoster = "";

  const moviesHTML = await Promise.all(movies.map(async (movie) => {
    // Calcula o símbolo para a diferença (lastRank)
    let diffSimbolo;
    if (movie.lastRank === null) diffSimbolo = 'N';
    else if (movie.lastRank === movie.rank) diffSimbolo = '=';
    else if (movie.lastRank > movie.rank) diffSimbolo = '+';
    else diffSimbolo = '-';

    const posterURL = await fetchPoster(movie.filme);

    // Se for Top 5 → usar rank 1 | Se for Top 6-10 → usar rank 6
    if ((range === 'top5' && movie.rank === 1) || (range === 'top6-10' && movie.rank === 6)) {
      containerPoster = posterURL;
    }

    return `
      <li class="movie-item" style="--poster-url: url(${posterURL})">
        <span class="rank">${movie.rank}</span>
        <img src="${posterURL}" alt="Poster ${movie.filme}" class="poster" />
        <div class="movie-details">
          <div class="movie-title">${movie.filme}</div>
          <div class="movie-info">
            <div class="left">${movie.gross}</div>
            <div class="center">${movie.semanas === 1 ? "Estreia" : movie.percentLW} (${movie.semanas})</div>
            <div class="right">Total: ${movie.total}</div>
          </div>
          <div class="world-total">Total Mundial: 0000000</div>
        </div>
        <img src="" alt="Icon" class="icon" data-diff="${diffSimbolo}" />
      </li>
    `;
  }));

  ul.innerHTML = moviesHTML.join('');

  // Aplica o poster no container
  if (containerPoster) {
    document.querySelector(".container").style.setProperty("--poster-url", `url(${containerPoster})`);
  }

  // Atualiza os ícones consoante o símbolo
  document.querySelectorAll('.movie-item .icon').forEach(icon => {
    const status = icon.dataset.diff;
    switch (status) {
      case 'N':
        icon.src = 'Imagens/NOVO.PNG';
        icon.alt = 'Novo';
        break;
      case '+':
        icon.src = 'Imagens/SUBIU.PNG';
        icon.alt = 'Subiu';
        break;
      case '-':
        icon.src = 'Imagens/DESCEU.PNG';
        icon.alt = 'Desceu';
        break;
      case '=':
        icon.src = 'Imagens/MANTEU.PNG';
        icon.alt = 'Manteve';
        break;
      default:
        icon.src = '';
        icon.alt = '';
    }
  });
}

(async () => {
  const range = getRange();
  let dataKey = 'boxOfficeTop5';
  let title = 'Box Office Top 5';

  if (range === 'top6-10') {
    dataKey = 'boxOfficeTop6_10';
    title = 'Box Office Top 6-10';
  }

  const movies = JSON.parse(sessionStorage.getItem(dataKey) || '[]');
  await renderMovies(movies, title, range);
})();
