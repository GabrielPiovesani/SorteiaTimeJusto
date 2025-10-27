// --- Elementos do DOM ---
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const jogadoresNomesTextarea = document.getElementById("jogadores-nomes");
const btnCarregarPosicoes = document.getElementById("btn-carregar-posicoes");
const formPosicoes = document.getElementById("form-posicoes");
const btnSorteio = document.getElementById("btn-sorteio");
const timesContainer = document.getElementById("times-container");
// const btnCompartilhar = document.getElementById("btn-compartilhar"); // <-- REMOVIDO
const containerQtdTimes = document.getElementById("container-qtd-times");
const inputQtdTimes = document.getElementById("qtd-times");
const selectTipoSorteio = document.getElementById("tipo-sorteio");
const btnCopiar = document.getElementById("btn-copiar");
const btnSortearNovamente = document.getElementById("btn-sortear-novamente");

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

function mostrarModal(mensagem) {
  modalMensagem.textContent = mensagem;
  modal.style.display = "block";
}

spanClose.onclick = function() {
  modal.style.display = "none";
}

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

    let html = `<span class="jogador-nome">${jogador.nome}</span>`;

    if (tipoSorteioSelecionado === "nivel" || tipoSorteioSelecionado === "nivel_posicao") {
      html += `
        <div class="botoes-nivel" id="nivel-${idx}">
          ${["1", "2", "3", "4", "5", "6"].map((nivel, i) =>
            `<button type="button" class="botao-nivel${nivel == jogador.nivel ? ' selecionado' : ''}" data-valor="${nivel}">${nivel}</button>`
          ).join("")}
        </div>
        <input type="hidden" name="nivel-${idx}" value="${jogador.nivel}" />
      `;
    }

    if (tipoSorteioSelecionado === "posicao" || tipoSorteioSelecionado === "nivel_posicao") {
      html += `
        <div class="botoes-posicao" id="posicao-${idx}">
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
        
        const formJogadorDiv = grupo.closest('.form-jogador');
        if (formJogadorDiv) {
            formJogadorDiv.querySelector(`input[name='nivel-${idx}']`).value = valor;
        }
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
        
        const formJogadorDiv = grupo.closest('.form-jogador');
        if (formJogadorDiv) {
          formJogadorDiv.querySelector(`input[name='posicao-${idx}']`).value = valor;
        }
      });
    });
  }

  btnSorteio.disabled = jogadores.length === 0;
}

// Evento para seleção de quantidade de times
document.querySelectorAll(".botao-qtd-time").forEach(btn => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".botao-qtd-time").forEach(b => b.classList.remove("selecionado"));
    this.classList.add("selecionado");

    const qtd = this.getAttribute("data-qtd");
    inputQtdTimes.value = qtd;
  });
});

// Botão PRÓXIMO (Step 1)
btnCarregarPosicoes.addEventListener("click", () => {
  const rawText = jogadoresNomesTextarea.value.trim();
  if (!rawText) {
    mostrarModal("Digite ao menos um nome.");
    return;
  }

  tipoSorteioSelecionado = selectTipoSorteio.value;

  const nomes = rawText
    .split("\n")
    .map(n => limparNome(n))
    .filter(n => n.length > 0);

  if (nomes.length < 2) {
    mostrarModal("Digite ao menos 2 jogadores.");
    return;
  }

  const qtdTimes = parseInt(inputQtdTimes.value);
  if (isNaN(qtdTimes) || qtdTimes < 2 || qtdTimes > 6) {
    mostrarModal("Quantidade inválida de times. Use de 2 a 6.");
    return;
  }

  criarFormularioPosicoes(nomes);

  step1.style.display = "none";
  step2.style.display = "block";
});


// ==========================================================
// FUNÇÃO SORTEARTIMES (LÓGICA CORRIGIDA E ATUALIZADA)
// ==========================================================

function sortearTimes() {
  const qtdTimes = parseInt(inputQtdTimes.value);
  let jogadoresParaSortear = [...jogadores]; 

  // Ordena a lista baseado no tipo de sorteio
  switch (tipoSorteioSelecionado) {
    case "nivel":
      // Ordena por nível, e embaralha jogadores de mesmo nível
      jogadoresParaSortear.sort((a, b) => {
        if (b.nivel !== a.nivel) {
          return b.nivel - a.nivel;
        }
        return Math.random() - 0.5; // <-- NOVO: Embaralha empates
      });
      break;

    case "posicao":
      // Ordena por posição, e embaralha jogadores de mesma posição
      jogadoresParaSortear.sort((a, b) => {
        const compPosicao = a.posicao.localeCompare(b.posicao);
        if (compPosicao !== 0) {
          return compPosicao;
        }
        return Math.random() - 0.5; // <-- NOVO: Embaralha empates
      });
      break;

    case "nivel_posicao":
      // Ordenação multi-nível com embaralhamento em empates
      jogadoresParaSortear.sort((a, b) => {
        if (b.nivel !== a.nivel) {
          return b.nivel - a.nivel; // 1. Ordena por nível
        }
        const compPosicao = a.posicao.localeCompare(b.posicao);
        if (compPosicao !== 0) {
          return compPosicao; // 2. Ordena por posição
        }
        return Math.random() - 0.5; // 3. Embaralha empates
      });
      break;

    case "aleatorio":
    default:
      embaralhar(jogadoresParaSortear);
      break;
  }

  times = Array.from({ length: qtdTimes }, () => []);

  // Lógica de distribuição "snake draft"
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

// ==========================================================
// FUNÇÃO PARA MOSTRAR OS TIMES (Step 3)
// ==========================================================
function mostrarTimes() {
  timesContainer.innerHTML = ""; // Limpa resultados anteriores
  
  times.forEach((time, idx) => {
    const cor = nomesTimes[idx] || `Time ${idx + 1}`;
    const div = document.createElement("div");
    
    let jogadoresHTML = time.map(nome => `<li>${nome}</li>`).join("");
    div.innerHTML = `<h3>Time ${cor}</h3><ul>${jogadoresHTML}</ul>`;
    
    timesContainer.appendChild(div);
  });

  step2.style.display = "none";
  step3.style.display = "block";
}

// Botão SORTEAR TIMES (Step 2)
btnSorteio.addEventListener("click", () => {
  sorteioValidar();
});

// Botão SORTEAR NOVAMENTE (Step 3)
btnSortearNovamente.addEventListener("click", () => {
  sorteioValidar(); 
});


// Botão para abrir WhatsApp (REMOVIDO)
// ...

// Botão para copiar a mensagem
btnCopiar.addEventListener("click", () => {
  if (!times || times.length === 0) {
    mostrarModal("Nenhum time para copiar.");
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
    .then(() => mostrarModal("Mensagem copiada para a área de transferência!"))
    .catch(() => mostrarModal("Não foi possível copiar a mensagem."));
});

// Função para embaralhar (Fisher-Yates)
function embaralhar(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
}

// VALIDAÇÃO ANTES DE SORTEAR
function sorteioValidar() {
  let formularioValido = true;

  if (tipoSorteioSelecionado === "posicao" || tipoSorteioSelecionado === "nivel_posicao") {
    for (const jogador of jogadores) {
      if (!jogador.posicao || jogador.posicao === "") {
        formularioValido = false;
        mostrarModal(`Por favor, defina a posição do jogador: ${jogador.nome}`);
        
        // Se a posição não foi definida, temos que voltar pro Step 2
        step3.style.display = "none";
        step2.style.display = "block";
        
        break; 
      }
    }
  }

  if (formularioValido) {
    sortearTimes();
  }
}