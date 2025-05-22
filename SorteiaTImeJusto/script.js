let jogadores = [];

document.getElementById("carregar-jogadores").addEventListener("click", function () {
  const texto = document.getElementById("json-input").value;
  const linhas = texto.split("\n").map(l => l.trim()).filter(Boolean);

  const container = document.getElementById("jogadores-container");
  container.innerHTML = "";
  jogadores = [];

  linhas.forEach((linha, index) => {
    const nome = linha.replace(/^\d+\s*-\s*/, "").replace(/\[.*?\]/g, "").replace(/✅/g, "").trim();
    const id = `nivel-${index}`;

    const div = document.createElement("div");
    div.classList.add("jogador");

    div.innerHTML = `
      <label>${nome}</label>
      <select id="${id}">
        <option value="1">Nível 1</option>
        <option value="2">Nível 2</option>
        <option value="3" selected>Nível 3</option>
        <option value="4">Nível 4</option>
        <option value="5">Nível 5</option>
      </select>
    `;

    container.appendChild(div);

    jogadores.push({ nome, nivel: 3, id });
  });
});

document.getElementById("sortear").addEventListener("click", function () {
  jogadores.forEach(j => {
    j.nivel = parseInt(document.getElementById(j.id).value);
  });

  const embaralhado = [...jogadores].sort(() => 0.5 - Math.random());

  // Ordena por nível (maiores primeiro)
  embaralhado.sort((a, b) => b.nivel - a.nivel);

  // Inicializa times e níveis somados
  const time1 = [], time2 = [], time3 = [];
  let soma1 = 0, soma2 = 0, soma3 = 0;

  for (const jogador of embaralhado) {
    if (time1.length < 6 && (soma1 <= soma2 && soma1 <= soma3)) {
      time1.push(jogador);
      soma1 += jogador.nivel;
    } else if (time2.length < 6 && (soma2 <= soma3)) {
      time2.push(jogador);
      soma2 += jogador.nivel;
    } else {
      time3.push(jogador);
      soma3 += jogador.nivel;
    }
  }

  mostrarTimes(time1, time2, time3);
});

function mostrarTimes(time1, time2, time3) {
  document.getElementById("time1").innerHTML = time1.map(j => `<li>${j.nome}</li>`).join("");
  document.getElementById("time2").innerHTML = time2.map(j => `<li>${j.nome}</li>`).join("");
  document.getElementById("time3").innerHTML = time3.map(j => `<li>${j.nome}</li>`).join("");
}
