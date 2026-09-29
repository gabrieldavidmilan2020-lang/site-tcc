/* =======================
   DIÁLOGO
======================= */
const dialogos = [
    "Consegui escapar do balcão...",
    "Mas agora estou preso em um labirinto!",
    "Use W, A, S e D para me ajudar.",
    "Vamos lá!"
];

let dialogIndex = 0;

const intro = document.getElementById("intro");
const textEl = document.getElementById("speech-text");
const nextBtn = document.getElementById("next-dialog");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const mobileControls = document.getElementById("mobile-controls");

const endScreen = document.getElementById("end");
const nextPhaseBtn = document.getElementById("proximaFase");

textEl.innerText = dialogos[dialogIndex];

nextBtn.addEventListener("click", () => {
    dialogIndex++;

    if (dialogIndex < dialogos.length) {
        textEl.innerText = dialogos[dialogIndex];
    } else {
        intro.classList.add("hidden");
        canvas.classList.remove("hidden");
        mobileControls.classList.remove("hidden");
        iniciarJogo();
    }
});

/* =======================
   LABIRINTO (0 = CAMINHO | 1 = PAREDE)
======================= */
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
];

const player = { x: 1, y: 1 };
const exit = { x: 10, y: 9 };

let tileSize = 0;

const imgPlayer = new Image();
imgPlayer.src = "img/zero.png";
const imgVillain = new Image();
imgVillain.src = "img/VIL%C3%83O.png";

/* =======================
   INICIAR JOGO
======================= */
function iniciarJogo() {
    ajustarCanvas();
    desenharLabirinto();
}

window.addEventListener("resize", ajustarCanvas);

function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    tileSize = Math.floor(
        Math.min(
            canvas.width / maze[0].length,
            canvas.height / maze.length
        )
    );

    desenharLabirinto();
}

/* =======================
   DESENHO
======================= */
function desenharLabirinto() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = "#333";
                ctx.fillRect(
                    x * tileSize,
                    y * tileSize,
                    tileSize,
                    tileSize
                );
            }
        }
    }

    // saída
    ctx.fillStyle = "#00ff66";
    ctx.fillRect(exit.x * tileSize, exit.y * tileSize, tileSize, tileSize);

    // jogador
    ctx.drawImage(
        imgPlayer,
        player.x * tileSize,
        player.y * tileSize,
        tileSize,
        tileSize
    );
}

/* =======================
   MOVIMENTO BLOCO A BLOCO
======================= */
document.addEventListener("keydown", e => {
    if (canvas.classList.contains("hidden")) return;

    let nx = player.x;
    let ny = player.y;

    if (e.key === "ArrowUp") ny--;
    if (e.key === "ArrowDown") ny++;
    if (e.key === "ArrowLeft") nx--;
    if (e.key === "ArrowRight") nx++;

    if (maze[ny] && maze[ny][nx] === 0) {
        player.x = nx;
        player.y = ny;
        desenharLabirinto();
    }

    if (player.x === exit.x && player.y === exit.y) {
        finalizarFase();
    }
});

/* =======================
   FINAL
======================= */
function finalizarFase() {
    canvas.classList.add("hidden");
    endScreen.classList.remove("hidden");
}

/* =======================
   PRÓXIMA FASE
======================= */
nextPhaseBtn.addEventListener("click", async () => {
    if (window.SaveSystem) await SaveSystem.updateActivePhase(6);
    else localStorage.setItem("faseAtual", "6");
    document.body.style.opacity = "0";
    setTimeout(() => {
        window.location.href = "fase6.html";
    }, 800);
});

/* Labirinto ampliado: substitui a fase original por um mapa de 41 x 31 células. */
const Fase5Grande = (() => {
  const largura = 41, altura = 31;
  const codigos = ["<html>", "<body>", "<h1>", "</h1>", "</body>", "</html>"];
  let mapa, zero, zeroVisual, fantasma, fantasmaVisual, saida, itens, tamanho, ativo = false, ultimaPerseguicao = 0, ultimaMovimentacao = 0;
  const teclas = new Set();

  function criarMapa() {
    /* Corredores horizontais e verticais conectados, no estilo Pac-Man. */
    mapa = Array.from({ length: altura }, () => Array(largura).fill(1));
    for (let y = 1; y < altura - 1; y += 2) for (let x = 1; x < largura - 1; x++) mapa[y][x] = 0;
    [1, 7, 13, 19, 21, 27, 33, 39].forEach(x => {
      for (let y = 1; y < altura - 1; y++) mapa[y][x] = 0;
    });
    /* Atalhos extras tornam possível despistar o fantasma. */
    [[3, 4, 12], [9, 14, 26], [15, 2, 18], [21, 22, 38], [27, 8, 30]].forEach(([y, inicio, fim]) => {
      for (let x = inicio; x <= fim; x++) mapa[y][x] = 0;
    });
    /* Pequenas barreiras quebram os trechos retos e criam curvas para desvio. */
    [[3, 15, 17], [5, 28, 30], [7, 2, 4], [11, 22, 24], [13, 34, 36], [17, 8, 10], [19, 28, 30], [23, 14, 16], [25, 2, 4], [29, 22, 24]].forEach(([y, inicio, fim]) => {
      for (let x = inicio; x <= fim; x++) mapa[y][x] = 1;
    });
  }

  function posicionar() {
    zero = { x: 1, y: 1 };
    zeroVisual = { ...zero };
    saida = { x: largura - 2, y: 1 };
    fantasma = { x: largura - 2, y: altura - 2 };
    fantasmaVisual = { ...fantasma };
    const livres = [];
    mapa.forEach((linha, y) => linha.forEach((celula, x) => {
      if (celula === 0 && Math.abs(x - 1) + Math.abs(y - 1) > 12 && Math.abs(x - fantasma.x) + Math.abs(y - fantasma.y) > 8) livres.push({ x, y });
    }));
    itens = codigos.map((codigo, i) => ({ ...livres[Math.floor((i + 1) * livres.length / 7)], codigo, coletado: false }));
  }

  function redimensionar() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    tamanho = Math.max(26, Math.min(42, Math.floor(Math.min(canvas.width, canvas.height) / 14)));
  }

  function desenhar() {
    if (!ativo) return;
    const cameraX = Math.max(0, Math.min(largura * tamanho - canvas.width, zeroVisual.x * tamanho - canvas.width / 2));
    const cameraY = Math.max(0, Math.min(altura * tamanho - canvas.height, zeroVisual.y * tamanho - canvas.height / 2));
    ctx.fillStyle = "#070b11"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save(); ctx.translate(-cameraX, -cameraY);
    mapa.forEach((linha, y) => linha.forEach((celula, x) => {
      if (celula) {
        ctx.fillStyle = "#263348"; ctx.fillRect(x * tamanho, y * tamanho, tamanho, tamanho);
        ctx.fillStyle = "#111b2b"; ctx.fillRect(x * tamanho + 4, y * tamanho + 4, tamanho - 8, tamanho - 8);
      }
    }));
    const completo = itens.every(item => item.coletado);
    ctx.fillStyle = completo ? "#00ff66" : "#8e263d";
    ctx.fillRect(saida.x * tamanho + 5, saida.y * tamanho + 3, tamanho - 10, tamanho - 6);
    itens.filter(item => !item.coletado).forEach((item, i) => {
      const flutuar = Math.sin(performance.now() / 240 + i) * tamanho * .12;
      ctx.fillStyle = "#52e7ff"; ctx.font = `bold ${Math.max(10, tamanho * .3)}px monospace`; ctx.textAlign = "center";
      ctx.fillText(item.codigo, item.x * tamanho + tamanho / 2, item.y * tamanho + tamanho * .6 + flutuar);
    });
    ctx.drawImage(imgPlayer, zeroVisual.x * tamanho, zeroVisual.y * tamanho, tamanho, tamanho);
    desenharVilao(); ctx.restore(); desenharHud(completo);
  }

  function desenharVilao() {
    const x = fantasmaVisual.x * tamanho, y = fantasmaVisual.y * tamanho;
    if (imgVillain.complete && imgVillain.naturalWidth) {
      ctx.drawImage(imgVillain, x, y, tamanho, tamanho);
    } else {
      ctx.fillStyle = "#d83d55";
      ctx.fillRect(x + tamanho * .18, y + tamanho * .12, tamanho * .64, tamanho * .76);
    }
  }

  function desenharHud(completo) {
    const qtd = itens.filter(item => item.coletado).length, w = Math.min(canvas.width - 28, 490);
    ctx.fillStyle = "rgba(3,7,13,.9)"; ctx.fillRect(14, 14, w, 70); ctx.strokeStyle = "#37ff90"; ctx.strokeRect(14, 14, w, 70);
    ctx.fillStyle = "#eafff3"; ctx.textAlign = "left"; ctx.font = "12px 'Press Start 2P', monospace"; ctx.fillText(`CÓDIGO RECUPERADO: ${qtd}/${itens.length}`, 28, 43);
    ctx.fillStyle = completo ? "#37ff90" : "#ffe066"; ctx.font = "10px 'Press Start 2P', monospace"; ctx.fillText(completo ? "SAÍDA LIBERADA!" : "WASD / toque: fuja do vilao", 28, 68);
  }

  function perseguir() {
    const fila = [{ ...fantasma, caminho: [] }], vistos = new Set([`${fantasma.x},${fantasma.y}`]);
    while (fila.length) {
      const atual = fila.shift();
      if (atual.x === zero.x && atual.y === zero.y) { if (atual.caminho[0]) fantasma = atual.caminho[0]; return; }
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const x = atual.x + dx, y = atual.y + dy, chave = `${x},${y}`;
        if (mapa[y] && mapa[y][x] === 0 && !vistos.has(chave)) { vistos.add(chave); fila.push({ x, y, caminho: [...atual.caminho, { x, y }] }); }
      });
    }
  }

  function atualizar(tempo) {
    if (!ativo) return;
    if (tempo - ultimaMovimentacao > 115) {
      const tecla = ["w", "a", "s", "d"].find(item => teclas.has(item));
      if (tecla) moverZero(tecla);
      ultimaMovimentacao = tempo;
    }
    if (tempo - ultimaPerseguicao > 420) {
      perseguir(); ultimaPerseguicao = tempo;
      verificarCaptura();
    }
    zeroVisual.x += (zero.x - zeroVisual.x) * .24;
    zeroVisual.y += (zero.y - zeroVisual.y) * .24;
    fantasmaVisual.x += (fantasma.x - fantasmaVisual.x) * .16;
    fantasmaVisual.y += (fantasma.y - fantasmaVisual.y) * .16;
    desenhar(); requestAnimationFrame(atualizar);
  }

  document.addEventListener("keydown", event => {
    if (!ativo) return;
    const tecla = event.key.toLowerCase();
    if (!["w", "a", "s", "d"].includes(tecla)) return;
    event.preventDefault();
    teclas.add(tecla);
  });

  document.addEventListener("keyup", event => teclas.delete(event.key.toLowerCase()));

  mobileControls.querySelectorAll("[data-direction]").forEach(botao => {
    const pressionar = event => {
      event.preventDefault();
      teclas.add(botao.dataset.direction);
      botao.setPointerCapture?.(event.pointerId);
    };
    const soltar = event => {
      event.preventDefault();
      teclas.delete(botao.dataset.direction);
    };
    botao.addEventListener("pointerdown", pressionar);
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(tipo => botao.addEventListener(tipo, soltar));
    botao.addEventListener("contextmenu", event => event.preventDefault());
  });

  function moverZero(tecla) {
    let x = zero.x, y = zero.y;
    if (tecla === "w") y--; if (tecla === "s") y++; if (tecla === "a") x--; if (tecla === "d") x++;
    if (!mapa[y] || mapa[y][x] !== 0) return;
    zero = { x, y };
    const item = itens.find(p => !p.coletado && p.x === x && p.y === y); if (item) item.coletado = true;
    verificarCaptura();
    if (zero.x === saida.x && zero.y === saida.y && itens.every(p => p.coletado)) { ativo = false; finalizarFase(); }
  }

  function verificarCaptura() {
    if (zero.x === fantasma.x && zero.y === fantasma.y) {
      zero = { x: 1, y: 1 };
      fantasma = { x: largura - 2, y: altura - 2 };
      zeroVisual = { ...zero };
      fantasmaVisual = { ...fantasma };
    }
  }

  addEventListener("resize", redimensionar);
  return { iniciar() { criarMapa(); posicionar(); redimensionar(); ativo = true; requestAnimationFrame(atualizar); } };
})();

function iniciarJogo() {
  Fase5Grande.iniciar();
}
