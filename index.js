// --- BOX 1 ---
let parsedData1 = [];

function parseBoxOffice(input) {
  const linhas = input.trim().split('\n').filter(l => l.trim() !== '');
  const resultados = [];

  linhas.forEach(linha => {
    const tokens = linha.split('\t');
    if (tokens.length < 10) return;

    const rank = parseInt(tokens[0]);
    const lastRank = tokens[1] === '-' ? null : parseInt(tokens[1]);
    const filme = tokens[2];
    const gross = tokens[3];
    const percentLW = tokens[4];
    const total = tokens[8];
    const semanas = parseInt(tokens[9]);

    resultados.push({ rank, lastRank, filme, gross, percentLW, total, semanas, worldwide: '' });
  });

  return resultados;
}

function gerarTabela(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = '<p>Nenhum dado válido encontrado.</p>';
    return;
  }

  let html = '<table><thead><tr>';
  const headers = ['Rank', 'Diff', 'Filme', 'Gross', '%± LW', 'Total', 'Semanas', 'Worldwide'];
  headers.forEach(h => html += `<th>${h}</th>`);
  html += '</tr></thead><tbody>';

  data.forEach((row, index) => {
    let diffSimbolo;
    if (row.lastRank === null) diffSimbolo = 'N';
    else if (row.lastRank === row.rank) diffSimbolo = '=';
    else if (row.lastRank > row.rank) diffSimbolo = '+';
    else diffSimbolo = '-';

    html += `<tr>
      <td>${row.rank}</td>
      <td>${diffSimbolo}</td>
      <td>${row.filme}</td>
      <td>${row.gross}</td>
      <td>${row.percentLW}</td>
      <td>${row.total}</td>
      <td>${row.semanas}</td>
      <td><input type="text" value="${row.worldwide}" data-index="${index}" class="worldwide-input"></td>
    </tr>`;
  });

  html += '</tbody></table>';

  // Botão Abrir Tops
  html += '<button id="abrirTops" class="botao-abrir">Abrir Tops</button>';

  container.innerHTML = html;

  // Atualiza o valor worldwide no objeto quando editas o input
  document.querySelectorAll('.worldwide-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.index);
      parsedData1[idx].worldwide = e.target.value;
    });
  });

  document.getElementById('abrirTops').addEventListener('click', () => {
  const top5 = parsedData1.slice(0, 5);
  const top6_10 = parsedData1.slice(5, 10);

  sessionStorage.setItem('boxOfficeTop5', JSON.stringify(top5));
  sessionStorage.setItem('boxOfficeTop6_10', JSON.stringify(top6_10));

  // Abre Top 5 imediatamente
  window.open('top.html?range=top5', '_blank');

  // Abre Top 6-10 com ligeiro atraso (50ms)
  setTimeout(() => {
    window.open('top.html?range=top6-10', '_blank');
  }, 500);
});
}

// Eventos Box1
document.getElementById('parseBtn1').addEventListener('click', () => {
  const inputText = document.getElementById('inputText1').value;
  parsedData1 = parseBoxOffice(inputText);
  gerarTabela(parsedData1, 'result1');
});

document.getElementById('clearBtn1').addEventListener('click', () => {
  document.getElementById('inputText1').value = '';
  document.getElementById('result1').innerHTML = '';
  parsedData1 = [];
});

// --- BOX 2 ---
let parsedData2 = [];

function parseTop10Worldwide(input) {
  const linhas = input.trim().split('\n').filter(l => l.trim() !== '');
  const resultados = [];

  linhas.forEach(linha => {
    const tokens = linha.split('\t');
    if (tokens.length < 3) return;

    const rank = parseInt(tokens[0]);
    const filme = tokens[1];
    const worldwide = tokens[2];

    resultados.push({ rank, filme, worldwide });
  });

  return resultados;
}

function gerarTabelaTop10(data) {
  const container = document.getElementById('result2');
  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = '<p>Nenhum dado válido encontrado.</p>';
    return;
  }

  let html = '<table><thead><tr>';
  const headers = ['Rank', 'Filme', 'Total Mundial'];
  headers.forEach(h => html += `<th>${h}</th>`);
  html += '</tr></thead><tbody>';

  data.forEach(row => {
    html += `<tr>
      <td style="font-weight:bold; font-size: 20px;">${row.rank}</td>
      <td style="font-weight:bold; font-size:20px; text-align:left; max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${row.filme}</td>
      <td>${row.worldwide}</td>
    </tr>`;
  });

  html += '</tbody></table>';

  container.innerHTML = html;

  const btnAbrir = document.createElement('button');
  btnAbrir.textContent = 'Abrir Top 10 Mundo';
  btnAbrir.className = 'botao-abrir';
  btnAbrir.onclick = () => window.open('top10.html', '_blank');
  container.appendChild(btnAbrir);
}

// Eventos Box2
document.getElementById('parseBtn2').addEventListener('click', () => {
  const inputText = document.getElementById('inputText2').value;
  parsedData2 = parseTop10Worldwide(inputText);
  gerarTabelaTop10(parsedData2);
});

document.getElementById('clearBtn2').addEventListener('click', () => {
  document.getElementById('inputText2').value = '';
  document.getElementById('result2').innerHTML = '';
  parsedData2 = [];
});
