const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const jogadoresNomesTextarea = document.getElementById("jogadores-nomes");
const btnCarregarPosicoes = document.getElementById("btn-carregar-posicoes");
const formPosicoes = document.getElementById("form-posicoes");
const btnSorteio = document.getElementById("btn-sorteio");
const timesContainer = document.getElementById("times-container");
const btnCompartilhar = document.getElementById("btn-compartilhar");
const containerQtdTimes = document.getElementById("container-qtd-times");
const inputQtdTimes = document.getElementById("qtd-times");

let jogadores = [];
let times = [];

const nomesTimes = ["Amarelo", "Azul", "Vermelho", "Preto", "Verde", "Branco"];

function limparNome(nome) {
  return nome
    .replace(/^\d+\s*[-–—]\s*/g, "")
    .replace(/✅/g, "")
    .replace(/\[.*?\]/g, "")
    .trim();
}

function criarFormularioPosicoes(jogadoresNomes) {
  formPosicoes.innerHTML = "";
  jogadores = jogadoresNomes.map(nome => ({ nome: nome, nivel: 3 }));

  jogadores.forEach((jogador, idx) => {
    const div = document.createElement("div");
    div.classList.add("form-jogador");
   div.innerHTML = `
     <label for="nivel-${idx}">
     <strong>${jogador.nome}</strong> 
        <input type="number" id="nivel-${idx}" name="nivel-${idx}" min="1" max="5" value="3" />
     </label>
    `;
    formPosicoes.appendChild(div);
  });

  btnSorteio.disabled = jogadores.length === 0;
}

btnCarregarPosicoes.addEventListener("click", () => {
  const rawText = jogadoresNomesTextarea.value.trim();
  if (!rawText) {
    alert("Digite ao menos um nome.");
    return;
  }

  const nomes = rawText
    .split("\n")
    .map(n => limparNome(n))
    .filter(n => n.length > 0);

  if (nomes.length < 2) {
    alert("Digite ao menos 2 jogadores.");
    return;
  }

  const qtdTimes = parseInt(inputQtdTimes.value);
  if (isNaN(qtdTimes) || qtdTimes < 2 || qtdTimes > 6) {
    alert("Quantidade inválida de times. Use de 2 a 6.");
    return;
  }

  criarFormularioPosicoes(nomes);

  step1.style.display = "none";
  step2.style.display = "block";
  containerQtdTimes.style.display = "none";
});

formPosicoes.addEventListener("input", (e) => {
  const target = e.target;
  const idx = parseInt(target.id.replace("nivel-", ""));
  let val = parseInt(target.value);
  if (isNaN(val) || val < 1) val = 1;
  if (val > 5) val = 5;
  target.value = val;
  jogadores[idx].nivel = val;
});

function sortearTimes() {
  const qtdTimes = parseInt(inputQtdTimes.value);
  const jogadoresOrdenados = [...jogadores].sort((a, b) => b.nivel - a.nivel);
  times = Array.from({ length: qtdTimes }, () => []);

  let i = 0;
  let direcao = 1;
  for (const jogador of jogadoresOrdenados) {
    times[i].push(jogador.nome);
    i += direcao;
    if (i === qtdTimes || i === -1) {
      direcao *= -1;
      i += direcao;
    }
  }

  mostrarTimes();
}

function mostrarTimes() {
  timesContainer.innerHTML = "";
  times.forEach((time, idx) => {
    const cor = nomesTimes[idx] || `Time ${idx + 1}`;
    const div = document.createElement("div");
    div.innerHTML = `<h3>Time ${cor}</h3><ul>${time.map(nome => `<li>${nome}</li>`).join("")}</ul>`;
    timesContainer.appendChild(div);
  });

  step2.style.display = "none";
  step3.style.display = "block";
}

btnSorteio.addEventListener("click", () => {
  sortearTimes();
});

btnCompartilhar.addEventListener("click", () => {
  if (!times || times.length === 0) {
    alert("Nenhum time para compartilhar.");
    return;
  }

  let mensagem = "Times sorteados:\n\n";
  times.forEach((time, idx) => {
    const cor = nomesTimes[idx] || `Time ${idx + 1}`;
    mensagem += `Time ${cor}:\n`;
    time.forEach(nome => {
      mensagem += `- ${nome}\n`;
    });
    mensagem += "\n";
  });

  const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
});