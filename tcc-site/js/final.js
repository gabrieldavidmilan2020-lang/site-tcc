/* =========================================================
   ESTADO DO JOGO
========================================================= */
window.estado = "dialogo";

/* =========================================================
   ELEMENTOS HTML
========================================================= */
window.player = document.getElementById("player");
window.boss = document.getElementById("boss");
window.puzzle = document.getElementById("puzzle");
window.porta = document.getElementById("porta");
window.mapa = document.getElementById("mapa");
window.paineis = document.querySelectorAll(".painel:not(#painelFinal)");

window.vidaEl = document.getElementById("vida"); // VIDA ACIMA DO ZERO
window.gameover = document.getElementById("gameover");
window.msgErro = document.getElementById("mensagemErro");
window.bossVidaBar = document.getElementById("bossVidaBar");
window.bossVidaTexto = document.getElementById("bossVidaTexto");
window.vidaBossMax = 40;
window.vidaBoss = 40;

/* =========================================================
   IMAGENS DOS PODERES (PLAYER E BOSS)
========================================================= */
window.imgPoderPlayer = "img/poder_player.png";
window.imgPoderBoss = "img/poder_boss.png";

/* =========================================================
   POSIÇÕES
========================================================= */
window.x = 50, window.y = 300;
window.bossX = 500, window.bossY = 100;

/* =========================================================
   VIDA (3 CORAÇÕES)
========================================================= */
window.vida = 3;
window.ataquesAtivos = [];
window.intervalosAtivos = [];

/* =========================================================
   CONTROLES
========================================================= */
window.teclas = {};
window.bloqueando = false;
window.defendendo = false;

// DIREÇÃO DO MOVIMENTO ATUAL
window.direcaoX = 0; // -1 = esquerda, 0 = parado, 1 = direita
window.direcaoY = 0; // -1 = cima, 0 = parado, 1 = baixo
window.ultimaDirecaoX = 1;
window.ultimaDirecaoY = 0;

/* =========================================================
   IMAGENS
========================================================= */
window.imgZeroNormal = "img/zero.png";
window.imgZeroDefesa = "img/defesa.png";

/* =========================================================
   PAINÉIS
========================================================= */
let painelAtual = null;
let paineisConsertados = 0;

/* CÓDIGOS DIFERENTES PARA CADA PAINEL (COM ERROS PARA CORRIGIR) */
let codigos = [
  "<h1>Título<h1>", // Erro: tag de fechamento errada
  "<p>Parágrafo<p>", // Erro: tag de fechamento errada
  "<div class='container'>", // Erro: tag não fechada
  "<span class='texto'>Texto</span", // Erro: falta >
  "<a href='pagina.html'>Link</a>", // CERTO: este está correto
  "<ul><li>Item 1</li><li>Item 2</li><ul>" // Erro: tag ul fechada errada
];

/* CÓDIGOS CORRETOS PARA VERIFICAÇÃO */
let codigosCorretos = [
  "<h1>Título</h1>",
  "<p>Parágrafo</p>",
  "<div class='container'></div>",
  "<span class='texto'>Texto</span>",
  "<a href='pagina.html'>Link</a>",
  "<ul><li>Item 1</li><li>Item 2</li></ul>"
];

/* =========================================================
   VELOCIDADE
========================================================= */
let velocidadePlayer = 6;
let velocidadeBoss = 2;

/* =========================================================
   DIÁLOGO
========================================================= */
let falas = [
  { texto: "Eu consegui chegar até aqui...", img: "img/zero.png" },
  { texto: "Mas algo está errado...", img: "img/zero.png" },
  { texto: "VOCÊ NÃO VAI ESCAPAR!", img: "img/chefao.png" }
];

let falasFinal = [
  { texto: "Parabéns! Você corrigiu todos os painéis.", img: "img/zero.png" },
  { texto: "Obrigado por me ajudar a fugir.", img: "img/zero.png" }
];

let falasAtuais = falas;
let indiceFala = 0;

function proximo() {
  if (indiceFala < falasAtuais.length) {
    texto.innerText = falasAtuais[indiceFala].texto;
    retrato.src = falasAtuais[indiceFala].img;
    indiceFala++;
  } else {
    if (falasAtuais === falasFinal) {
      window.location.href = "credits.html";
      return;
    }

    cutscene.style.display = "none";
    game.style.display = "block";
    estado = "jogo";
    atualizarVida();
  }
}

function iniciarDialogoFinal() {
  falasAtuais = falasFinal;
  indiceFala = 0;
  cutscene.style.display = "flex";
  game.style.display = "none";
  estado = "final-dialogo";
  proximo();
}

/* =========================================================
   INPUT
========================================================= */
document.addEventListener("keydown", (e) => {
  teclas[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
  teclas[e.key.toLowerCase()] = false;
});

/* ATAQUE PLAYER (BOTÃO ESQUERDO) */
document.addEventListener("mousedown", (e) => {
  if (estado !== "jogo") return;

  if (e.button === 0 || e.button === 2) {
    e.preventDefault();
    dispararPlayer(e);
  }
});

/* DESABILITAR MENU CONTEXTO DURANTE O JOGO */
document.addEventListener("contextmenu", (e) => {
  if (estado === "jogo") {
    e.preventDefault();
  }
});

/* CLIQUE PARA INTERAÇÃO */
document.addEventListener("click", (e) => {

  if (estado === "dialogo") {
    proximo();
    return;
  }

  if (estado === "jogo") {
    if (e.button === 0 && !e.target.closest(".painel, #porta")) {
      return;
    }

    paineis.forEach(p => {
      if (colidiu(player, p) && !p.consertado) {
        painelAtual = p;
        abrirPainel();
      }
    });

    if (colidiu(player, porta) && paineisConsertados >= 6) {
      iniciarDialogoFinal();
    }
  }
});

/* =========================================================
   MOVIMENTO
========================================================= */
function loop() {

  if (estado === "jogo") {

    // RESETAR DIREÇÃO
    direcaoX = 0;
    direcaoY = 0;

    if (teclas["d"] || teclas["arrowright"]) {
      x += velocidadePlayer;
      direcaoX = 1; // Direita
    }
    if (teclas["a"] || teclas["arrowleft"]) {
      x -= velocidadePlayer;
      direcaoX = -1; // Esquerda
    }
    if (teclas["w"] || teclas["arrowup"]) {
      y -= velocidadePlayer;
      direcaoY = -1; // Cima
    }
    if (teclas["s"] || teclas["arrowdown"]) {
      y += velocidadePlayer;
      direcaoY = 1; // Baixo
    }

    if (direcaoX !== 0 || direcaoY !== 0) {
      ultimaDirecaoX = direcaoX;
      ultimaDirecaoY = direcaoY;
    }

    // DEFESA COM TECLA E
    if (teclas["e"]) {
      defendendo = true;
      player.style.backgroundImage = `url(${imgZeroDefesa})`;
    } else {
      defendendo = false;
      player.style.backgroundImage = `url(${imgZeroNormal})`;
    }

    x = Math.max(0, Math.min(3000, x));
    y = Math.max(0, Math.min(1000, y));

    player.style.left = x + "px";
    player.style.top = y + "px";

    atualizarVidaPosicao();
    moverCamera();
  }

  requestAnimationFrame(loop);
}
loop();

/* =========================================================
   VIDA ACIMA DO PERSONAGEM
========================================================= */
function atualizarVidaPosicao() {
  vidaEl.style.left = x + "px";
  vidaEl.style.top = (y - 30) + "px";
}

/* =========================================================
   CÂMERA INTELIGENTE
========================================================= */
function moverCamera() {
  const telaLargura = window.innerWidth;
  const telaAltura = window.innerHeight;

  // Limites da câmera (margens para manter o Zero visível)
  const margemX = 300;
  const margemY = 200;

  // Posição da câmera baseada na posição do Zero
  let cameraX = -x + margemX;
  let cameraY = -y + margemY;

  // Limites da câmera para não mostrar área vazia
  const maxCameraX = 0; // Não vai para esquerda do mapa
  const maxCameraY = 0; // Não vai para cima do mapa
  const minCameraX = -(3000 - telaLargura); // Não vai além do mapa
  const minCameraY = -(1000 - telaAltura); // Não vai além do mapa

  // Aplicar limites
  cameraX = Math.max(minCameraX, Math.min(maxCameraX, cameraX));
  cameraY = Math.max(minCameraY, Math.min(maxCameraY, cameraY));

  mapa.style.left = cameraX + "px";
  mapa.style.top = cameraY + "px";
}

/* =========================================================
   ATAQUE PLAYER (COM IMAGEM)
========================================================= */
function dispararPlayer(event) {

  let tiro = document.createElement("div");
  tiro.classList.add("ataque");

  /* IMG DO PODER */
  tiro.style.backgroundImage = `url(${imgPoderPlayer})`;
  tiro.style.backgroundSize = "contain";
  tiro.style.backgroundRepeat = "no-repeat";

  tiro.style.width = "40px";
  tiro.style.height = "40px";

  const playerCenterX = x + player.offsetWidth / 2;
  const playerCenterY = y + player.offsetHeight / 2;

  tiro.style.left = (playerCenterX - 20) + "px";
  tiro.style.top = (playerCenterY - 20) + "px";

  mapa.appendChild(tiro);

  let velocidadeTiro = 8;
  let dirX = direcaoX;
  let dirY = direcaoY;

  if (event && event.clientX !== undefined && event.clientY !== undefined) {
    const mapaRect = mapa.getBoundingClientRect();
    const mouseX = event.clientX - mapaRect.left;
    const mouseY = event.clientY - mapaRect.top;

    dirX = mouseX - playerCenterX;
    dirY = mouseY - playerCenterY;
  }

  // SE NÃO ESTIVER SE MOVENDO E NÃO HOUVE CLIQUE VÁLIDO, ATIRAR PARA A ÚLTIMA DIREÇÃO OLHADA
  if (dirX === 0 && dirY === 0) {
    dirX = ultimaDirecaoX;
    dirY = ultimaDirecaoY;
  }

  let mag = Math.sqrt(dirX * dirX + dirY * dirY);
  if (mag > 0) {
    dirX /= mag;
    dirY /= mag;
  }

  let intervalo = setInterval(() => {
    let tx = parseInt(tiro.style.left);
    let ty = parseInt(tiro.style.top);

    tiro.style.left = (tx + dirX * velocidadeTiro) + "px";
    tiro.style.top = (ty + dirY * velocidadeTiro) + "px";

    if (colidiu(tiro, boss)) {
      window.vidaBoss -= 1;
      atualizarVidaBoss();

      if (window.vidaBoss <= 0) {
        boss.style.display = "none";
        window.bossVidaTexto.innerText = "CHEFÃO DERROTADO";
        window.bossVidaBar.style.width = "0%";
        mostrarErro("Chefão derrubado! Continue a missão.");
        tiro.remove();
        clearInterval(intervalo);
        return;
      }

      bossX += 120;
      tiro.remove();
      clearInterval(intervalo);
    }

    // REMOVER TIRO QUANDO SAI DO MAPA
    if (tx < -50 || tx > 3050 || ty < -50 || ty > 1050) {
      tiro.remove();
      clearInterval(intervalo);
    }

  }, 30);

  window.intervalosAtivos.push(intervalo);
}

/* =========================================================
   BOSS (SE MOVENDO)
========================================================= */
setInterval(() => {
  if (estado !== "jogo") return;
  if (window.vidaBoss <= 0) return;

  bossX += (x > bossX ? velocidadeBoss : -velocidadeBoss);
  bossY += (y > bossY ? velocidadeBoss : -velocidadeBoss);

  boss.style.left = bossX + "px";
  boss.style.top = bossY + "px";

}, 30);

/* =========================================================
   ATAQUE BOSS (COM IMG E NÃO PERSEGUE)
========================================================= */
setInterval(() => {

  if (estado !== "jogo") return;
  if (window.vidaBoss <= 0) return;

  let atk = document.createElement("div");
  atk.classList.add("ataque");
  atk.acertou = false; // Flag para evitar múltiplos danos

  /* IMG DO PODER */
  atk.style.backgroundImage = `url(${imgPoderBoss})`;
  atk.style.backgroundSize = "contain";
  atk.style.backgroundRepeat = "no-repeat";

  atk.style.width = "40px";
  atk.style.height = "40px";

  atk.style.left = bossX + "px";
  atk.style.top = bossY + "px";

  mapa.appendChild(atk);

  /* DIREÇÃO FIXA */
  let dirX = (x - bossX);
  let dirY = (y - bossY);

  let mag = Math.sqrt(dirX*dirX + dirY*dirY);
  dirX /= mag;
  dirY /= mag;

  let i = setInterval(() => {

    let ax = parseFloat(atk.style.left);
    let ay = parseFloat(atk.style.top);

    atk.style.left = (ax + dirX * 6) + "px";
    atk.style.top = (ay + dirY * 6) + "px";

    if (!atk.acertou && colidiu(player, atk)) {

      // SE ESTIVER DEFENDENDO, NÃO PERDE VIDA
      if (!defendendo) {
        vida--;
        atualizarVida();
        mostrarDano();
      } else {
        // EFEITO VISUAL DE DEFESA BEM SUCEDIDA
        mostrarDefesa();
      }

      atk.acertou = true; // Marca que já acertou
      atk.remove();
      clearInterval(i);
    }

    if (ax < -50 || ax > 3050 || ay < -50 || ay > 1050) {
      atk.remove();
      clearInterval(i);
    }

  }, 30);

  window.intervalosAtivos.push(i);

}, 2000);

/* =========================================================
   VIDA (CORAÇÕES)
========================================================= */
function atualizarVida() {
  window.vidaEl.innerHTML = "❤️".repeat(Math.max(0, window.vida));

  if (window.vida <= 0) {
    window.estado = "morto";
    window.gameover.style.display = "flex";
  }
}

function atualizarVidaBoss() {
  const porcentagem = Math.max(0, Math.min(100, (window.vidaBoss / window.vidaBossMax) * 100));
  window.bossVidaBar.style.width = porcentagem + "%";
  window.bossVidaTexto.innerText = `CHEFÃO: ${window.vidaBoss} / ${window.vidaBossMax}`;
}

/* =========================================================
   DANO VISUAL (-1)
========================================================= */
function mostrarDano() {
  let dmg = document.createElement("div");

  dmg.innerText = "-1";
  dmg.style.position = "absolute";
  dmg.style.left = x + "px";
  dmg.style.top = y + "px";
  dmg.style.color = "red";

  mapa.appendChild(dmg);

  setTimeout(() => dmg.remove(), 600);
}

/* =========================================================
   DEFESA VISUAL (DEFENDIDO!)
========================================================= */
function mostrarDefesa() {
  let def = document.createElement("div");

  def.innerText = "DEFENDIDO!";
  def.style.position = "absolute";
  def.style.left = x + "px";
  def.style.top = (y - 50) + "px";
  def.style.color = "lime";
  def.style.fontWeight = "bold";
  def.style.fontSize = "16px";

  mapa.appendChild(def);

  setTimeout(() => def.remove(), 800);
}

/* =========================================================
   PAINEL
========================================================= */
function abrirPainel() {
  limparAtaquesEmCurso();
  estado = "puzzle";
  puzzle.style.display = "block";
  codigo.innerText = codigos[paineisConsertados];
  resposta.value = ""; // Limpar textarea
}

function limparAtaquesEmCurso() {
  document.querySelectorAll('.ataque').forEach(atk => atk.remove());
  window.intervalosAtivos.forEach(id => clearInterval(id));
  window.intervalosAtivos = [];
}

/* =========================================================
   VERIFICAR CÓDIGO (COM ERRO DO ZERO)
========================================================= */
function normalizarCodigo(codigoDigitado) {
  return codigoDigitado
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*=\s*/g, "=")
    .replace(/>\s+</g, "><")
    .toLowerCase();
}

function codigoFunciona(codigoDigitado, indice) {
  let conteudo = codigoDigitado.trim();
  if (!conteudo) return false;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = conteudo;
  const elemento = wrapper.firstElementChild;
  if (!elemento) return false;

  switch (indice) {
    case 0:
      return elemento.tagName === "H1" && wrapper.innerHTML.toLowerCase().includes("</h1>");
    case 1:
      return elemento.tagName === "P";
    case 2:
      return elemento.tagName === "DIV";
    case 3:
      return elemento.tagName === "SPAN";
    case 4:
      return elemento.tagName === "A" && elemento.hasAttribute("href");
    case 5:
      return elemento.tagName === "UL" && wrapper.querySelectorAll("li").length > 0;
    default:
      return false;
  }
}

function verificar(event) {
  if (event && event.stopPropagation) event.stopPropagation();

  let r = resposta.value.trim(); // Remover espaços extras

  if (codigoFunciona(r, paineisConsertados)) {

    painelAtual.consertado = true;
    painelAtual.style.opacity = "0.5";
    painelAtual.classList.add("finalizado");

    paineisConsertados++;

    puzzle.style.display = "none";
    estado = "jogo";

    if (paineisConsertados === 6) {
      liberarPainelFinal();
    }

  } else {
    mostrarErro("Zero: isso está errado...");
  }
}

/* =========================================================
   BOTÃO SAIR DO PAINEL
========================================================= */
function sairPainel(event) {
  if (event) event.stopPropagation();
  puzzle.style.display = "none";
  estado = "jogo";
}

/* =========================================================
   ERRO NA TELA
========================================================= */
function mostrarErro(msg) {

  msgErro.innerText = msg;
  msgErro.style.display = "block";

  setTimeout(() => {
    msgErro.style.display = "none";
  }, 2000);
}

/* =========================================================
   FINAL
========================================================= */
function liberarPainelFinal() {
  document.getElementById("painelFinal").style.display = "block";
}

function finalFase() {
  estado = "fim";
  mostrarErro("Zero: Parabéns! Você venceu!");
}

/* =========================================================
   RECOMEÇAR JOGO
========================================================= */
function recomecarJogo() {
  // Resetar todas as variáveis
  estado = "jogo";
  x = 50;
  y = 300;
  bossX = 500;
  bossY = 100;
  vida = 3;
  painelAtual = null;
  paineisConsertados = 0;
  defendendo = false;
  direcaoX = 0;
  direcaoY = 0;
  ultimaDirecaoX = 1;
  ultimaDirecaoY = 0;
  teclas = {};

  // Resetar elementos visuais
  window.player.style.left = x + "px";
  window.player.style.top = y + "px";
  window.player.style.backgroundImage = `url(${imgZeroNormal})`;

  window.boss.style.left = bossX + "px";
  window.boss.style.top = bossY + "px";

  // Resetar vida
  atualizarVida();
  atualizarVidaPosicao();

  // Resetar painéis
  window.paineis.forEach(p => {
    p.consertado = false;
    p.style.opacity = "1";
  });
  document.getElementById("painelFinal").style.display = "none";

  // Esconder game over e puzzle
  window.gameover.style.display = "none";
  window.puzzle.style.display = "none";
  window.intervalosAtivos.forEach(id => clearInterval(id));
  window.intervalosAtivos = [];
  document.querySelectorAll(".ataque").forEach(atk => atk.remove());

  // Resetar câmera
  window.mapa.style.left = "0px";
  window.mapa.style.top = "0px";

  window.vidaBoss = window.vidaBossMax;
  atualizarVidaBoss();
  window.boss.style.display = "block";

  // Voltar para cutscene
  const cutscene = document.getElementById("cutscene");
  const game = document.getElementById("game");
  cutscene.style.display = "none";
  game.style.display = "block";

  // Resetar diálogo
  i = 0;
}
function colidiu(a, b) {

  let ar = a.getBoundingClientRect();
  let br = b.getBoundingClientRect();

  return !(
    ar.top > br.bottom ||
    ar.bottom < br.top ||
    ar.right < br.left ||
    ar.left > br.right
  );
}

/* =========================================================
   INICIAR
========================================================= */
window.onload = () => {
  // Adicionar event listener para o botão de recomeçar
  const btnRecomecar = document.getElementById("btnRecomecar");
  if (btnRecomecar) {
    btnRecomecar.addEventListener("click", () => {
      console.log("Botão recomeçar clicado!");
      recomecarJogo();
    });
  }

  const btnCorrigir = document.querySelector("#puzzle .btn-corrigir");
  const btnSair = document.querySelector("#puzzle .btn-sair");

  if (btnCorrigir) {
    btnCorrigir.addEventListener("click", verificar);
  }

  if (btnSair) {
    btnSair.addEventListener("click", sairPainel);
  }
  
  atualizarVidaBoss();
  setTimeout(() => proximo(), 300);
};
