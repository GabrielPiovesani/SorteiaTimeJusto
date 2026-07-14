document.getElementById('btnCarregar').addEventListener('click', carregarJogadoresDoWhats);
document.getElementById('btnSortear').addEventListener('click', sortearTimesJustos);
document.getElementById('btnCopiar').addEventListener('click', copiarTimesParaWhats);
document.getElementById('btnAdicionar').addEventListener('click', adicionarJogadorManual);
document.getElementById('btnVoltar').addEventListener('click', () => {
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('acoesResultado').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

let ultimosTimesSorteados = []; // Guarda os times para copiar depois

// Função auxiliar que cria o HTML do jogador e configura os botões
function criarLinhaJogador(nome) {
    const itemRow = document.createElement('div');
    itemRow.className = 'player-row';
    itemRow.style.position = 'relative';

    itemRow.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div class="player-name">${nome}</div>
            <button type="button" class="btn-remover" title="Remover jogador">Remover</button>
        </div>
        <div class="level-group" data-nome="${nome}">
            <button type="button" class="lvl-btn selected" data-val="nao_conheco">não conheço</button>
            <button type="button" class="lvl-btn" data-val="1-3">1 a 3 resenha</button>
            <button type="button" class="lvl-btn" data-val="4">4 tem noção</button>
            <button type="button" class="lvl-btn" data-val="5">5 diferenciado</button>
            <button type="button" class="lvl-btn" data-val="6">6 craque</button>
        </div>
    `;

    // Lógica para selecionar o nível
    itemRow.querySelectorAll('.lvl-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const grupo = this.closest('.level-group');
            grupo.querySelectorAll('.lvl-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Lógica para deletar o jogador
    itemRow.querySelector('.btn-remover').addEventListener('click', function() {
        itemRow.remove(); // Remove esta linha inteira da tela
    });

    return itemRow;
}

function carregarJogadoresDoWhats() {
    const texto = document.getElementById('listaJogadores').value;
    const linhas = texto.split('\n');
    
    let jogadoresIdentificados = [];
    const containerNiveis = document.getElementById('containerNiveis');
    containerNiveis.innerHTML = '';

    const regexLinhaJogador = /^\s*(\d+)\s*[\-\.\)]\s*(.+)$/;
    let dentroDosGoleiros = false;

    linhas.forEach(linha => {
        const linhaLimpa = linha.trim();
        
        if (linhaLimpa.toLowerCase().includes('goleiro')) {
            dentroDosGoleiros = true;
            return;
        }

        if (dentroDosGoleiros && (linhaLimpa === '' || (linhaLimpa.startsWith('1-') && jogadoresIdentificados.length === 0))) {
            if (linhaLimpa.match(regexLinhaJogador)) dentroDosGoleiros = false;
        }

        const match = linhaLimpa.match(regexLinhaJogador);
        
        if (match && !dentroDosGoleiros) {
            let nome = match[2].replace(/[^\p{L}\p{N}\s]/gu, '').trim(); 
            
            if (nome && nome !== '') {
                jogadoresIdentificados.push(nome);
            }
        }
    });

    if (jogadoresIdentificados.length === 0) {
        alert('Nenhum jogador numerado foi encontrado no texto.');
        return;
    }

    // Usando a nova função construtora para cada jogador encontrado
    jogadoresIdentificados.forEach(nome => {
        const novaLinha = criarLinhaJogador(nome);
        containerNiveis.appendChild(novaLinha);
    });

    document.getElementById('passo1').style.display = 'none'; 
    document.getElementById('passo2').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Função para adicionar um jogador individualmente
function adicionarJogadorManual() {
    const inputNovo = document.getElementById('novoJogadorNome');
    const nome = inputNovo.value.trim();

    if (nome === '') {
        alert('Por favor, digite o nome do jogador.');
        return;
    }

    const containerNiveis = document.getElementById('containerNiveis');
    const novaLinha = criarLinhaJogador(nome);
    containerNiveis.appendChild(novaLinha);

    // Limpa o campo de texto
    inputNovo.value = '';
    
    // Rola a tela
    novaLinha.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function mapearNivelParaPeso(nivelStr) {
    if (nivelStr === 'nao_conheco') return 3; 
    if (nivelStr === '1-3') return 2;         
    if (nivelStr === '4') return 4;           
    if (nivelStr === '5') return 5;           
    if (nivelStr === '6') return 7;           
    return 3;
}

function sortearTimesJustos() {
    const grupos = document.querySelectorAll('.level-group');
    let listaProntaParaSorteio = [];

    grupos.forEach(grupo => {
        const nome = grupo.getAttribute('data-nome');
        const nivelSelecionado = grupo.querySelector('.lvl-btn.selected').getAttribute('data-val');

        listaProntaParaSorteio.push({
            nome: nome,
            peso: mapearNivelParaPeso(nivelSelecionado)
        });
    });

    const numTimes = parseInt(document.getElementById('qtdTimes').value);

    if (listaProntaParaSorteio.length < numTimes) {
        alert('Número de jogadores menor que a quantidade de times!');
        return;
    }

    listaProntaParaSorteio.sort((a, b) => b.peso - a.peso);

    let times = Array.from({ length: numTimes }, (_, i) => ({
        id: i + 1,
        jogadores: [],
        pesoTotal: 0
    }));

    listaProntaParaSorteio.forEach(jogador => {
        times.sort((a, b) => a.pesoTotal - b.pesoTotal);
        times[0].jogadores.push(jogador);
        times[0].pesoTotal += jogador.peso;
    });

    ultimosTimesSorteados = times.sort((a, b) => a.id - b.id); 
    exibirResultado(ultimosTimesSorteados);
}

function exibirResultado(times) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';

    times.forEach(time => {
        const timeBox = document.createElement('div');
        timeBox.className = 'time-box';
        
        let html = `
            <div class="time-header">
                <h3>Time ${time.id}</h3>
                <span class="badge-peso">Força: ${time.pesoTotal}</span>
            </div>
            <ul>
        `;
        time.jogadores.forEach(j => {
            html += `<li>${j.nome}</li>`;
        });
        html += '</ul>';
        
        timeBox.innerHTML = html;
        resultadoDiv.appendChild(timeBox);
    });
    
    document.getElementById('acoesResultado').style.display = 'block';
    resultadoDiv.scrollIntoView({ behavior: 'smooth' });
}

function copiarTimesParaWhats() {
    if (ultimosTimesSorteados.length === 0) return;
    
    let textoWhats = "TIMES SORTEADOS\n\n";
    
    ultimosTimesSorteados.forEach(time => {
        textoWhats += `Time ${time.id}\n`;
        time.jogadores.forEach(j => {
            textoWhats += `${j.nome}\n`;
        });
        textoWhats += "\n"; 
    });
    
    navigator.clipboard.writeText(textoWhats).then(() => {
        const btn = document.getElementById('btnCopiar');
        const textoOriginal = btn.innerHTML;
        btn.innerHTML = "✅ Copiado!";
        btn.style.backgroundColor = "#2ecc71"; 
        btn.style.color = "#ffffff";
        
        setTimeout(() => {
            btn.innerHTML = textoOriginal;
            btn.style.backgroundColor = ""; // Reseta para a cor nativa do seu CSS
        }, 2000);
    }).catch(err => {
        alert("Erro ao copiar. Seu navegador pode não suportar essa função.");
    });
}