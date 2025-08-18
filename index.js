// --- BOX 1 ---
let parsedData1 = [];

// Função que gera todos os fins de semana de 2025
function gerarFinsDeSemana(ano) {
  const finsDeSemana = [];
  let data = new Date(ano, 0, 1);

  // ir até sexta-feira da primeira semana
  while (data.getDay() !== 5) {
    data.setDate(data.getDate() + 1);
  }

  while (data.getFullYear() === ano) {
    const sexta = new Date(data);
    const domingo = new Date(data);
    domingo.setDate(domingo.getDate() + 2);

    if (domingo.getFullYear() === ano) {
      // formatar como "15-17 Agosto 2025"
      const optionsMes = { month: "long" };
      const mes = sexta.toLocaleDateString("pt-PT", optionsMes);
      const label = `${sexta.getDate()}-${domingo.getDate()} ${mes.charAt(0).toUpperCase() + mes.slice(1)} ${ano}`;

      finsDeSemana.push({ value: label, label });
    }

    data.setDate(data.getDate() + 7);
  }

  return finsDeSemana;
}

// Preencher dropdown ao carregar a página
const weekendSelect = document.getElementById("weekendSelect");
const fins = gerarFinsDeSemana(2025);
fins.forEach(f => {
  const opt = document.createElement("option");
  opt.value = f.value;
  opt.textContent = f.label;
  weekendSelect.appendChild(opt);
});

// Recuperar última seleção do sessionStorage
const savedWeekend = sessionStorage.getItem("selectedWeekend");
if (savedWeekend) {
  weekendSelect.value = savedWeekend;
}

// Guardar sempre que muda
weekendSelect.addEventListener("change", () => {
  sessionStorage.setItem("selectedWeekend", weekendSelect.value);
});

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

  // Atualiza worldwide no objeto
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

    // Guardar o fim de semana escolhido
    const weekend = weekendSelect.value;
    sessionStorage.setItem("selectedWeekend", weekend);

    window.open('top.html?range=top5', '_blank');
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

  // Preenche valores worldwide vazios com '0'
  parsedData2 = parsedData2.map(item => {
    if (!item.worldwide || item.worldwide.trim() === '') {
      item.worldwide = '0';
    }
    return item;
  });

  // Guarda no sessionStorage
  sessionStorage.setItem('top10Worldwide', JSON.stringify(parsedData2.slice(0, 10)));

  gerarTabelaTop10(parsedData2);
});

document.getElementById('clearBtn2').addEventListener('click', () => {
  document.getElementById('inputText2').value = '';
  document.getElementById('result2').innerHTML = '';
  parsedData2 = [];
});
