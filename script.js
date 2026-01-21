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
const btnCopiarLista = document.getElementById("btn-copiar-lista");

// --- Elementos do Modal ---
const modal = document.getElementById("meuModal");
const modalMensagem = document.getElementById("modal-mensagem");
const spanClose = document.getElementsByClassName("close")[0];

// --- Elementos do Modal Gerar Lista ---
const modalGerarLista = document.getElementById("modalGerarLista");
const btnGerarLista = document.getElementById("btn-gerar-lista");
const btnGerarTemplate = document.getElementById("btn-gerar-template");
const btnCancelarLista = document.getElementById("btn-cancelar-lista");
const spanCloseLista = document.getElementsByClassName("close-lista")[0];
const btnSortearInicial = document.getElementById("btn-sortear-inicial");

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
  if (event.target == modalGerarLista) {
    modalGerarLista.style.display = "none";
  }
}

// --- Lógica do Modal Gerar Lista ---

// Elementos que aparecem apenas quando vai sortear
const secaoColarLista = document.querySelector("#step1 h3");
// jogadoresNomesTextarea e containerQtdTimes já foram declarados acima
const tipoSorteioContainer = document.getElementById("tipo-sorteio-container");

// Função para mostrar/esconder seção de sortear
function mostrarSecaoSortear(mostrar) {
  if (mostrar) {
    secaoColarLista.style.display = "block";
    jogadoresNomesTextarea.style.display = "block";
    containerQtdTimes.style.display = "flex";
    tipoSorteioContainer.style.display = "flex";
    btnCarregarPosicoes.style.display = "flex";
  } else {
    secaoColarLista.style.display = "none";
    jogadoresNomesTextarea.style.display = "none";
    containerQtdTimes.style.display = "none";
    tipoSorteioContainer.style.display = "none";
    btnCarregarPosicoes.style.display = "none";
  }
  // Atualiza visibilidade do botão copiar
  atualizarVisibilidadeBotoes();
}

// Inicialmente esconde as seções de sortear
mostrarSecaoSortear(false);

// Quando clicar em "Gerar Lista", esconde as seções
btnGerarLista.onclick = function() {
  mostrarSecaoSortear(false);
  carregarDadosLista();
  modalGerarLista.style.display = "block";
};

// Quando clicar em "Sortear Times" do menu inicial, mostra as seções
btnSortearInicial.onclick = function() {
  mostrarSecaoSortear(true);
  jogadoresNomesTextarea.focus();
};

// Função para salvar dados no localStorage
function salvarDadosLista() {
  const dados = {
    diaSemana: document.getElementById("dia-semana").value,
    local: document.getElementById("local").value,
    horario: document.getElementById("horario").value,
    valorMensal: document.getElementById("valor-mensal").value,
    valorAvulso: document.getElementById("valor-avulso").value,
    pixBanco: document.getElementById("pix-banco").value,
    pixNome: document.getElementById("pix-nome").value,
    pixTelefone: document.getElementById("pix-telefone").value,
    prazoPagamento: document.getElementById("prazo-pagamento").value,
    qtdGoleiros: document.getElementById("qtd-goleiros").value,
    qtdEsperaGoleiros: document.getElementById("qtd-espera-goleiros").value,
    qtdJogadores: document.getElementById("qtd-jogadores").value,
    qtdEsperaJogadores: document.getElementById("qtd-espera-jogadores").value
  };
  localStorage.setItem("dadosLista", JSON.stringify(dados));
}

// Função para carregar dados do localStorage
function carregarDadosLista() {
  const dadosSalvos = localStorage.getItem("dadosLista");
  if (dadosSalvos) {
    const dados = JSON.parse(dadosSalvos);
    document.getElementById("dia-semana").value = dados.diaSemana || "";
    document.getElementById("local").value = dados.local || "";
    document.getElementById("horario").value = dados.horario || "";
    document.getElementById("valor-mensal").value = dados.valorMensal || "";
    document.getElementById("valor-avulso").value = dados.valorAvulso || "";
    document.getElementById("pix-banco").value = dados.pixBanco || "";
    document.getElementById("pix-nome").value = dados.pixNome || "";
    document.getElementById("pix-telefone").value = dados.pixTelefone || "";
    document.getElementById("prazo-pagamento").value = dados.prazoPagamento || "";
    document.getElementById("qtd-goleiros").value = dados.qtdGoleiros || "0";
    document.getElementById("qtd-espera-goleiros").value = dados.qtdEsperaGoleiros || "0";
    document.getElementById("qtd-jogadores").value = dados.qtdJogadores || "18";
    document.getElementById("qtd-espera-jogadores").value = dados.qtdEsperaJogadores || "0";
  }
}

btnGerarLista.onclick = function() {
  carregarDadosLista(); // Carrega dados salvos ao abrir o modal
  modalGerarLista.style.display = "block";
}

spanCloseLista.onclick = function() {
  modalGerarLista.style.display = "none";
}

btnCancelarLista.onclick = function() {
  modalGerarLista.style.display = "none";
}

// Função para gerar o template da lista
function gerarTemplateLista() {
  const diaSemana = document.getElementById("dia-semana").value;
  const local = document.getElementById("local").value;
  const horario = document.getElementById("horario").value;
  const valorMensal = document.getElementById("valor-mensal").value;
  const valorAvulso = document.getElementById("valor-avulso").value;
  const pixBanco = document.getElementById("pix-banco").value;
  const pixNome = document.getElementById("pix-nome").value;
  const pixTelefone = document.getElementById("pix-telefone").value;
  const prazoPagamento = document.getElementById("prazo-pagamento").value;
  const qtdGoleiros = parseInt(document.getElementById("qtd-goleiros").value) || 0;
  const qtdEsperaGoleiros = parseInt(document.getElementById("qtd-espera-goleiros").value) || 0;
  const qtdJogadores = parseInt(document.getElementById("qtd-jogadores").value) || 18;
  const qtdEsperaJogadores = parseInt(document.getElementById("qtd-espera-jogadores").value) || 0;
  
  // Validação básica
  if (!diaSemana || !local || !horario) {
    mostrarModal("Por favor, preencha pelo menos: Dia da Semana, Local e Horário.");
    return null;
  }
  
  let lista = `LISTA FUTEBOL – ${diaSemana}\n\n`;
  lista += `Local : ${local}–${horario}\n`;
  lista += `Valor mensal: ${valorMensal} (M)\n`;
  lista += `Valor avulso:\n${valorAvulso} (A)\n\n`;
  lista += `Pix:${pixBanco}:\n`;
  lista += `${pixNome} – ${pixTelefone}\n\n`;
  lista += `Pagamento ${prazoPagamento}, se não libera vaga para os da lista de espera.\n\n`;
  
  // Seção de goleiros
  if (qtdGoleiros > 0) {
    lista += `Goleiros (não pagam):\n`;
    for (let i = 1; i <= qtdGoleiros; i++) {
      lista += `${String(i).padStart(2, '0')} - \n`;
    }
    
    if (qtdEsperaGoleiros > 0) {
      lista += `Espera goleiro:\n`;
      for (let i = 1; i <= qtdEsperaGoleiros; i++) {
        lista += `${String(i).padStart(2, '0')} - \n`;
      }
    }
    lista += `\n`;
  }
  
  // Seção de jogadores de linha
  lista += `Jogadores de linha :\n`;
  for (let i = 1; i <= qtdJogadores; i++) {
    lista += `${String(i).padStart(2, '0')}- \n`;
  }
  
  // Lista de espera
  if (qtdEsperaJogadores > 0) {
    lista += `\nLista de espera:\n`;
    for (let i = 1; i <= qtdEsperaJogadores; i++) {
      lista += `${i} - \n`;
    }
  }
  
  return lista;
}

btnGerarTemplate.onclick = function() {
  const listaGerada = gerarTemplateLista();
  if (listaGerada) {
    salvarDadosLista(); // Salva os dados antes de gerar
    jogadoresNomesTextarea.value = listaGerada;
    modalGerarLista.style.display = "none";
    mostrarSecaoSortear(true); // Mostra as seções após gerar a lista
    atualizarVisibilidadeBotoes(); // Atualiza visibilidade dos botões
    mostrarModal("Lista gerada com sucesso! Preencha os nomes dos jogadores.");
  }
}

// Função para copiar a lista do textarea
btnCopiarLista.onclick = function() {
  const textoLista = jogadoresNomesTextarea.value.trim();
  if (!textoLista) {
    mostrarModal("Não há lista para copiar.");
    return;
  }
  
  navigator.clipboard.writeText(textoLista)
    .then(() => mostrarModal("Lista copiada para a área de transferência!"))
    .catch(() => mostrarModal("Não foi possível copiar a lista."));
}

// Função para atualizar visibilidade do botão copiar baseado no conteúdo do textarea
function atualizarVisibilidadeBotoes() {
  const temConteudo = jogadoresNomesTextarea.value.trim().length > 0;
  
  // Mostra botão de copiar apenas se tiver conteúdo
  if (temConteudo) {
    btnCopiarLista.style.display = "flex";
  } else {
    btnCopiarLista.style.display = "none";
  }
  
  // Os botões "Gerar Lista" e "Sortear Times" sempre ficam visíveis
}

// Monitora mudanças no textarea
jogadoresNomesTextarea.addEventListener("input", atualizarVisibilidadeBotoes);
jogadoresNomesTextarea.addEventListener("paste", function() {
  // Aguarda um pouco para o paste completar
  setTimeout(atualizarVisibilidadeBotoes, 100);
});

// Inicializa a visibilidade dos botões ao carregar a página
atualizarVisibilidadeBotoes();

// --- Lógica do Aplicativo ---

function limparNome(nome) {
  return nome
    .replace(/^\d+\s*[-–—]\s*/g, "")
    .replace(/✅/g, "")
    .replace(/💲Dinhero💰/g, "")
    .replace(/\(M\)/g, "")
    .replace(/\(A\)/g, "")
    .replace(/\[.*?\]/g, "")
    .trim();
}

// Função para extrair apenas jogadores de linha, ignorando goleiros e lista de espera
function extrairJogadoresLinha(texto) {
  const linhas = texto.split("\n");
  const jogadores = [];
  let encontrouJogadoresLinha = false;
  let indiceInicio = -1;
  
  // Passo 1: Encontrar onde começa "Jogadores de linha"
  for (let i = 0; i < linhas.length; i++) {
    const linhaLower = linhas[i].toLowerCase().trim();
    
    if (linhaLower.includes("jogadores") && linhaLower.includes("linha")) {
      encontrouJogadoresLinha = true;
      indiceInicio = i + 1; // Próxima linha após o cabeçalho
      break;
    }
  }
  
  if (!encontrouJogadoresLinha) {
    return [];
  }
  
  // Passo 2: Processar todas as linhas abaixo até encontrar "Lista de espera"
  for (let i = indiceInicio; i < linhas.length; i++) {
    let linha = linhas[i].trim();
    const linhaLower = linha.toLowerCase();
    
    // Para na lista de espera
    if (linhaLower.includes("lista de espera")) {
      break;
    }
    
    // Ignora linhas vazias
    if (linha.length === 0) {
      continue;
    }
    
    // Procura por linhas que começam com número seguido de hífen/traço
    // Aceita: "01- nome", "01 - nome", "1- nome", etc.
    const match = linha.match(/^\d+\s*[-–—]\s*(.+)$/);
    if (match && match[1]) {
      const nomeCompleto = match[1].trim();
      
      if (nomeCompleto.length > 0) {
        const nomeLimpo = limparNome(nomeCompleto);
        
        if (nomeLimpo.length > 0) {
          jogadores.push(nomeLimpo);
        }
      }
    }
  }
  
  return jogadores;
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

// Botão PRÓXIMO (Step 1) - Agora processa o sorteio
btnCarregarPosicoes.addEventListener("click", () => {
  const rawText = jogadoresNomesTextarea.value.trim();
  
  // Se não tem conteúdo, apenas mostra as seções (sem erro)
  if (!rawText) {
    mostrarSecaoSortear(true);
    jogadoresNomesTextarea.focus();
    return;
  }

  tipoSorteioSelecionado = selectTipoSorteio.value;

  // Usa a nova função para extrair apenas jogadores de linha
  const nomes = extrairJogadoresLinha(rawText);

  if (nomes.length < 2) {
    mostrarModal(`Encontrados apenas ${nomes.length} jogador(es). Certifique-se de que a lista contém a seção 'Jogadores de linha' com jogadores numerados (ex: 01- nome, 02- nome, etc.).`);
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