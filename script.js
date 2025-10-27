// --- Elementos do DOM ---
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
const selectTipoSorteio = document.getElementById("tipo-sorteio");
const btnCopiar = document.getElementById("btn-copiar");

// --- Elementos do Modal ---
const modal = document.getElementById("meuModal");
const modalMensagem = document.getElementById("modal-mensagem");
const spanClose = document.getElementsByClassName("close")[0];

// --- Variáveis Globais ---
let jogadores = [];
let times = [];
let tipoSorteioSelecionado = "nivel";
const nomesTimes = ["Amarelo", "Azul", "Vermelho", "Preto", "Verde", "Branco"];

// --- Lógica do Modal ---

// Função para mostrar o modal com uma mensagem
function mostrarModal(mensagem) {
  modalMensagem.textContent = mensagem;
  modal.style.display = "block";
}

// Quando o usuário clica no (X), fecha o modal
spanClose.onclick = function() {
  modal.style.display = "none";
}

// Quando o usuário clica fora do modal, fecha o modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// --- Lógica do Aplicativo ---

function limparNome(nome) {
  return nome
    .replace(/^\d+\s*[-–—]\s*/g, "")
    .replace(/✅/g, "")
    .replace(/\[.*?\]/g, "")
    .trim();
}

function criarFormularioPosicoes(jogadoresNomes) {
  formPosicoes.innerHTML = "";

  jogadores = jogadoresNomes.map(nome => ({
    nome: nome,
    nivel: 3,
    posicao: ""
  }));

  jogadores.forEach((jogador, idx) => {
    const div = document.createElement("div");
    div.classList.add("form-jogador");

    let html = `<span class="jogador-nome"><strong>${jogador.nome}</strong></span>`;

    if (tipoSorteioSelecionado === "nivel" || tipoSorteioSelecionado === "nivel_posicao") {
      html += `
        <div class="linha-jogador-nivel">
          <div class="botoes-nivel" id="nivel-${idx}">
            ${["1", "2", "3", "4", "5", "6"].map((nivel, i) => // <-- ALTERAÇÃO PARA 6 NÍVEIS
              `<button type="button" class="botao-nivel${nivel == jogador.nivel ? ' selecionado' : ''}" data-valor="${nivel}">${nivel}</button>`
            ).join("")}
          </div>
          <input type="hidden" name="nivel-${idx}" value="${jogador.nivel}" />
        </div>
      `;
    }

    if (tipoSorteioSelecionado === "posicao" || tipoSorteioSelecionado === "nivel_posicao") {
      html += `
        <div class="botoes-posicao" id="posicao-${idx}">
          <span class="jogador-nome"><strong>Posição:</strong></span>
          ${["Zag", "Meia", "Atak", "Bagre"].map(pos =>
            `<button type="button" class="botao-posicao" data-valor="${pos}">${pos}</button>`
          ).join("")}
        </div>
        <input type="hidden" name="posicao-${idx}" value="" />
      `;
    }

    div.innerHTML = html;
    formPosicoes.appendChild(div);
  });

  // Eventos para seleção de nível
  if (tipoSorteioSelecionado === "nivel" || tipoSorteioSelecionado === "nivel_posicao") {
    formPosicoes.querySelectorAll(".botao-nivel").forEach(btn => {
      btn.addEventListener("click", function () {
        const grupo = this.parentElement;
        grupo.querySelectorAll(".botao-nivel").forEach(b => b.classList.remove("selecionado"));
        this.classList.add("selecionado");

        const valor = this.getAttribute("data-valor");
        const idx = parseInt(grupo.id.replace("nivel-", ""));
        jogadores[idx].nivel = parseInt(valor);
        grupo.parentElement.querySelector(`input[name='nivel-${idx}']`).value = valor;
      });
    });
  }

  // Eventos para seleção de posição
  if (tipoSorteioSelecionado === "posicao" || tipoSorteioSelecionado === "nivel_posicao") {
    formPosicoes.querySelectorAll(".botao-posicao").forEach(btn => {
      btn.addEventListener("click", function () {
        const grupo = this.parentElement;
        grupo.querySelectorAll(".botao-posicao").forEach(b => b.classList.remove("selecionado"));
        this.classList.add("selecionado");

        const valor = this.getAttribute("data-valor");
        const idx = parseInt(grupo.id.replace("posicao-", ""));
        jogadores[idx].posicao = valor;
        grupo.parentElement.querySelector(`input[name='posicao-${idx}']`).value = valor;
      });
    });
  }

  btnSorteio.disabled = jogadores.length === 0;
}

// Evento para seleção de quantidade de times (como os botões de nível)
document.querySelectorAll(".botao-qtd-time").forEach(btn => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".botao-qtd-time").forEach(b => b.classList.remove("selecionado"));
    this.classList.add("selecionado");

    const qtd = this.getAttribute("data-qtd");
    inputQtdTimes.value = qtd;
  });
});

btnCarregarPosicoes.addEventListener("click", () => {
  const rawText = jogadoresNomesTextarea.value.trim();
  if (!rawText) {
    mostrarModal("Digite ao menos um nome."); // <-- MUDANÇA: alert -> mostrarModal
    return;
  }

  tipoSorteioSelecionado = selectTipoSorteio.value; // <- ESSENCIAL

  const nomes = rawText
    .split("\n")
    .map(n => limparNome(n))
    .filter(n => n.length > 0);

  if (nomes.length < 2) {
    mostrarModal("Digite ao menos 2 jogadores."); // <-- MUDANÇA: alert -> mostrarModal
    return;
  }

  const qtdTimes = parseInt(inputQtdTimes.value);
  if (isNaN(qtdTimes) || qtdTimes < 2 || qtdTimes > 6) {
    mostrarModal("Quantidade inválida de times. Use de 2 a 6."); // <-- MUDANÇA: alert -> mostrarModal
    return;
  }

  criarFormularioPosicoes(nomes);

  step1.style.display = "none";
  step2.style.display = "block";
  containerQtdTimes.style.display = "none";
});

function sortearTimes() {
  const qtdTimes = parseInt(inputQtdTimes.value);
  let jogadoresParaSortear = [...jogadores];

  if (tipoSorteioSelecionado === "nivel" || tipoSorteioSelecionado === "nivel_posicao") {
    jogadoresParaSortear.sort((a, b) => b.nivel - a.nivel);
  } else if (tipoSorteioSelecionado === "aleatorio") {
    embaralhar(jogadoresParaSortear);
  }

  times = Array.from({ length: qtdTimes }, () => []);

  let direcao = 1;
  let i = 0;

  for (const jogador of jogadoresParaSortear) {
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

// Botão para abrir WhatsApp
btnCompartilhar.addEventListener("click", () => {
  if (!times || times.length === 0) {
    mostrarModal("Nenhum time para compartilhar."); // <-- MUDANÇA: alert -> mostrarModal
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

  const texto = encodeURIComponent(mensagem);
  const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
  const url = isMobile
    ? `https: //wa.me/?text=${texto}`
    : `https://web.whatsapp.com/send?text=${texto}`;

  window.open(url, "_blank");
});

// Novo botão para copiar a mensagem
btnCopiar.addEventListener("click", () => {
  if (!times || times.length === 0) {
    mostrarModal("Nenhum time para copiar."); // <-- MUDANÇA: alert -> mostrarModal
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

  navigator.clipboard.writeText(mensagem)
    .then(() => mostrarModal("Mensagem copiada para a área de transferência!")) // <-- MUDANÇA: alert -> mostrarModal
    .catch(() => mostrarModal("Não foi possível copiar a mensagem.")); // <-- MUDANÇA: alert -> mostrarModal
});

// Função para embaralhar
function embaralhar(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
}