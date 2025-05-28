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

    const niveis = ["1", "2", "3", "4", "5"];

    const botoes = niveis.map((nivel, i) => 
      `<button type="button" class="botao-nivel" data-valor="${i + 1}">${nivel}</button>`
    ).join("");

    div.innerHTML = `
      <label>
        <strong>${jogador.nome}</strong>
        <div class="botoes-nivel" id="nivel-${idx}">
          ${botoes}
        </div>
        <input type="hidden" name="nivel-${idx}" value="3" />
      </label>
    `;

    formPosicoes.appendChild(div);
  });

  formPosicoes.querySelectorAll(".botao-nivel").forEach(btn => {
    btn.addEventListener("click", function () {
      const grupo = this.parentElement;
      grupo.querySelectorAll(".botao-nivel").forEach(b => b.classList.remove("selecionado"));
      this.classList.add("selecionado");

      const valor = this.getAttribute("data-valor");
      const idx = parseInt(grupo.id.replace("nivel-", ""));
      jogadores[idx].nivel = parseInt(valor);
      grupo.parentElement.querySelector("input[type='hidden']").value = valor;
    });
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

function sortearTimes() {
  const qtdTimes = parseInt(inputQtdTimes.value);
  const jogadoresOrdenados = [...jogadores].sort((a, b) => b.nivel - a.nivel);
  times = Array.from({ length: qtdTimes }, () => []);

  let direcao = 1;
  let i = 0;

  for (const jogador of jogadoresOrdenados) {
    times[i].push(jogador.nome);

    i += direcao;

    if (i === qtdTimes) {
      i = qtdTimes - 1;
      direcao = -1;
    } else if (i < 0) {
      i = 0;
      direcao = 1;
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
