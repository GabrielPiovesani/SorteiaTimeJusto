# Sorteia Time Justo

![Badge](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen)
![Badge](https://img.shields.io/badge/Tecnologia-HTML%2FCSS%2FJS-blue)

Um aplicativo web simples e direto para sortear times de futebol (ou qualquer outro esporte) de forma justa, equilibrando as equipes com base no nível de habilidade dos jogadores.

> Este projeto foi criado para resolver o problema clássico de times desequilibrados em jogos casuais, garantindo que a diversão comece antes mesmo do apito inicial.

---

## ✨ Features

* **Sorteio Balanceado:** Utiliza um algoritmo de "Sorteio Serpentina" (*Snake Draft*) para distribuir os jogadores de forma equilibrada, do mais forte ao mais fraco.
* **Múltiplos Tipos de Sorteio:**
    * **Por Nível:** O sorteio principal, que equilibra os times pela habilidade.
    * **Nível e Posição:** Permite definir os níveis e também as posições (Zagueiro, Meia, Atacante, etc.) para organização.
    * **Aleatório:** Um sorteio simples e rápido, sem considerar o nível.
* **Interface Rápida em 3 Passos:**
    1.  Cole os nomes, defina o nº de times e o tipo de sorteio.
    2.  Atribua os níveis (de 1 a 6) e posições para cada jogador.
    3.  Clique em sortear e veja os times prontos!
* **Limpeza de Nomes:** Remove automaticamente números, hífens ou emojis (como "✅") da lista de nomes colada.
* **Compartilhamento Fácil:**
    * Botão para **Copiar** a lista de times para a área de transferência.
    * Botão para **Compartilhar** os times diretamente no WhatsApp.

## 🚀 Como Usar

O aplicativo é dividido em três etapas simples:

### Passo 1: Configuração Inicial

1.  **Cole os Nomes:** Cole a lista de jogadores no campo principal. Um jogador por linha.
2.  **Defina os Times:** Escolha a quantidade de times (2 a 6).
3.  **Tipo de Sorteio:** Escolha como deseja sortear (Aleatório, Nível ou Nível/Posição).
4.  Clique em "Próximo".

### Passo 2: Definir Atributos

1.  Para cada jogador, clique nos botões para definir seu **Nível (1 a 6)** e/ou sua **Posição** (Zag, Meia, Atak, Bagre).
2.  O nível 3 vem selecionado por padrão para agilizar o processo.
3.  Clique em "Sortear Times".

### Passo 3: Times Prontos!

1.  Veja os times sorteados e balanceados.
2.  Use os botões na parte inferior para **Copiar** ou **Compartilhar** o resultado com os outros jogadores.

## ⚙️ Lógica do Sorteio (Sorteio Serpentina)

Para garantir o equilíbrio, o sorteio por nível não é aleatório. Ele segue um padrão justo:

1.  Os jogadores são ordenados do nível mais alto (6) para o mais baixo (1).
2.  Os times são criados vazios (ex: Time A, Time B, Time C).
3.  O primeiro jogador (mais forte) vai para o Time A.
4.  O segundo jogador vai para o Time B.
5.  O terceiro jogador vai para o Time C.
6.  Aqui acontece a "virada": o quarto jogador vai para o **Time C** (e não para o A).
7.  O quinto jogador vai para o Time B.
8.  O sexto jogador vai para o Time A.

**Resultado:** O Time A fica com o 1º e o 6º melhor jogador. O Time B com o 2º e o 5º. O Time C com o 3º e o 4º. Isso garante que a soma dos níveis de todos os times seja a mais próxima possível.

## 🛠️ Tecnologias Utilizadas

Este é um projeto de *front-end* puro, sem a necessidade de um servidor.

* **HTML5** (Estrutura semântica)
* **CSS3** (Estilização moderna, Flexbox)
* **JavaScript (ES6+)** (Toda a lógica de UI, manipulação do DOM e algoritmo de sorteio)
* **Font Awesome** (Para os ícones de compartilhamento e links)

## 👨‍💻 Autor

Desenvolvido por **Gabriel Piovesani**.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gabrielpiovesani/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/GabrielPiovesani)
