(() => {
  if (window.SaveSystem) SaveSystem.updateActivePhase(9);
  else localStorage.setItem("faseAtual", "9");
  document.body.innerHTML = `
    <main class="central" aria-labelledby="titulo-painel">
      <header class="central__cabecalho"><p>SETOR 09 · CENTRAL DE ENERGIA</p><h1 id="titulo-painel">RECONSTRUA OS CIRCUITOS HTML</h1><p>Arraste cada fio da tag de abertura até seu fechamento correto.</p></header>
      <section class="painel" aria-label="Painel de conexões de tags">
        <svg class="fios" aria-hidden="true"></svg>
        <div class="coluna"><h2>ORIGEM</h2><div id="origens" class="terminais"></div></div>
        <div class="nucleo"><div class="nucleo__luz"></div><p id="progresso">ENERGIA: 0 / 5</p><p id="aviso" role="status">Conecte os pares.</p></div>
        <div class="coluna"><h2>DESTINO</h2><div id="destinos" class="terminais"></div></div>
      </section>
      <aside class="dica"><strong>Como ler:</strong> uma tag de abertura, como <code>&lt;body&gt;</code>, precisa ser fechada por <code>&lt;/body&gt;</code>. As duas formam o limite daquele conteúdo.</aside>
    </main>
    <section id="vitoria" class="vitoria" hidden><img src="img/zero.png" alt="Zero"><div><p class="central__cabecalho">ENERGIA RESTAURADA</p><h2>O núcleo reconheceu todas as tags!</h2><p>Você reconectou cada abertura ao fechamento correspondente. O caminho até o núcleo final está livre.</p><button id="seguir" type="button">Ir para a fase final</button></div></section>`;

  if (matchMedia("(max-width: 650px)").matches) {
    document.querySelector(".central__cabecalho > p:last-child").textContent = "Toque em uma tag de abertura e depois no fechamento correspondente.";
  }
  const css = document.createElement("style");
  css.textContent = `
    *{box-sizing:border-box}body{margin:0;min-height:100vh;background:#050912;color:#e8fff2;font-family:"Courier New",monospace}.central{min-height:100vh;padding:clamp(20px,4vw,52px);background:radial-gradient(circle at 50% 55%,#132a38 0,#080e1b 40%,#03050b 100%)}.central__cabecalho{text-align:center}.central__cabecalho p{margin:0;color:#45ff9a;letter-spacing:.12em;font-weight:bold}.central__cabecalho h1{margin:10px 0 8px;font-size:clamp(22px,4vw,44px);color:#eafff3;text-shadow:0 0 15px #27bc75}.central__cabecalho>p:last-child{color:#b8c9c4;letter-spacing:0;font-weight:normal}.painel{position:relative;isolation:isolate;display:grid;grid-template-columns:minmax(170px,1fr) minmax(130px,.55fr) minmax(170px,1fr);gap:clamp(20px,5vw,76px);align-items:center;max-width:1100px;min-height:540px;margin:36px auto 20px;padding:28px;border:3px solid #2be98a;background:linear-gradient(135deg,#101b29,#070b13);box-shadow:0 0 30px #1cb86b55,inset 0 0 36px #000}.coluna{z-index:2}.coluna h2{text-align:center;font-size:14px;color:#96b8ab;letter-spacing:.12em}.terminais{display:grid;gap:16px}.terminal{display:flex;align-items:center;gap:12px;min-height:58px;padding:10px 14px;border:2px solid #4a6473;background:#101b25;color:#e8fff2;font:bold clamp(14px,2.4vw,20px) monospace;cursor:crosshair;user-select:none;touch-action:none;transition:.18s}.terminal::before{content:"";width:18px;height:18px;flex:0 0 18px;border-radius:50%;background:#ffca4a;box-shadow:0 0 12px #ffca4a}.destino{justify-content:flex-end}.destino::before{order:2}.terminal.ativo{border-color:#fff2a6;box-shadow:0 0 18px #ffca4a}.terminal.conectado{cursor:default;border-color:#38ff94;background:#123825;color:#baffd6}.terminal.conectado::before{background:#38ff94;box-shadow:0 0 14px #38ff94}.nucleo{z-index:2;text-align:center}.nucleo__luz{width:100px;height:100px;margin:auto;border:8px solid #324755;border-radius:50%;background:#15202a;box-shadow:inset 0 0 25px #000}.nucleo__luz.aceso{background:#44ff9b;box-shadow:0 0 45px #35ff8e,inset 0 0 22px #eafff3;border-color:#c6ffe0}.nucleo p{font-size:13px}.fios{position:absolute;z-index:1;inset:0;width:100%;height:100%;pointer-events:none}.fio{fill:none;stroke:#ffca4a;stroke-width:7;stroke-linecap:round;filter:drop-shadow(0 0 5px #ffca4a)}.fio.certo{stroke:#38ff94;filter:drop-shadow(0 0 7px #38ff94)}.fio.erro{stroke:#ff4d66}.dica{max-width:900px;margin:auto;padding:16px;border-left:4px solid #45ff9a;background:#0b1920;color:#d5e3dd;line-height:1.6}.dica code{color:#ffdf75}.vitoria{position:fixed;inset:0;z-index:5;display:flex;justify-content:center;align-items:center;gap:30px;padding:28px;background:#05130ce8;color:#eafff3;text-align:left}.vitoria img{width:min(180px,30vw);image-rendering:pixelated}.vitoria h2{color:#45ff9a}.vitoria p{max-width:530px;line-height:1.6}.vitoria button{padding:13px 20px;border:2px solid #45ff9a;background:#123825;color:#eafff3;font:bold 15px monospace;cursor:pointer}@media(max-width:650px){.painel{grid-template-columns:1fr;gap:18px;padding:18px;min-height:0}.nucleo{order:-1}.nucleo__luz{width:64px;height:64px}.fios{display:none}.vitoria{flex-direction:column;text-align:center}}
  `;
  css.textContent += "[hidden]{display:none!important}";
  document.head.appendChild(css);

  const pares = [
    { id: "html", abre: "<html>", fecha: "</html>" }, { id: "head", abre: "<head>", fecha: "</head>" },
    { id: "body", abre: "<body>", fecha: "</body>" }, { id: "h1", abre: "<h1>", fecha: "</h1>" }, { id: "p", abre: "<p>", fecha: "</p>" }
  ];
  const embaralhar = lista => [...lista].sort(() => Math.random() - .5);
  const origens = document.getElementById("origens"), destinos = document.getElementById("destinos"), painel = document.querySelector(".painel"), svg = document.querySelector(".fios");
  let origemAtiva = null, fioTemporario = null, acertos = 0;
  const ajustarAreaDosFios = () => {
    const area = painel.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${area.width} ${area.height}`);
    svg.setAttribute("preserveAspectRatio", "none");
  };
  ajustarAreaDosFios();

  function criarTerminal(par, lado) {
    const botao = document.createElement("button");
    botao.type = "button"; botao.className = `terminal ${lado}`; botao.dataset.id = par.id; botao.textContent = lado === "origem" ? par.abre : par.fecha;
    return botao;
  }
  embaralhar(pares).forEach(par => origens.appendChild(criarTerminal(par, "origem")));
  embaralhar(pares).forEach(par => destinos.appendChild(criarTerminal(par, "destino")));

  const ponto = (el, direita) => { const r = el.getBoundingClientRect(), p = painel.getBoundingClientRect(); return { x: r.left - p.left + (direita ? r.width : 0), y: r.top - p.top + r.height / 2 }; };
  const desenharFio = (a, b, classe = "") => { const curva = Math.max(50, Math.abs(b.x - a.x) * .42); const path = document.createElementNS("http://www.w3.org/2000/svg", "path"); path.setAttribute("class", `fio ${classe}`); path.setAttribute("d", `M ${a.x} ${a.y} C ${a.x + curva} ${a.y}, ${b.x - curva} ${b.y}, ${b.x} ${b.y}`); svg.appendChild(path); return path; };
  function iniciar(origem) { if (origem.classList.contains("conectado")) return; origemAtiva = origem; origem.classList.add("ativo"); const a = ponto(origem, true); fioTemporario = desenharFio(a, a); }
  function limparTemporario() { origemAtiva?.classList.remove("ativo"); origemAtiva = null; fioTemporario?.remove(); fioTemporario = null; }
  function conectar(destino) {
    if (!origemAtiva || destino.classList.contains("conectado")) return;
    const origem = origemAtiva, correto = origem.dataset.id === destino.dataset.id;
    const a = ponto(origem, true), b = ponto(destino, false); limparTemporario();
    const fio = desenharFio(a, b, correto ? "certo" : "erro");
    if (!correto) { document.getElementById("aviso").textContent = "Circuito incorreto: procure o fechamento da mesma tag."; setTimeout(() => fio.remove(), 650); return; }
    origem.classList.add("conectado"); destino.classList.add("conectado"); acertos++;
    document.getElementById("progresso").textContent = `ENERGIA: ${acertos} / ${pares.length}`;
    document.getElementById("aviso").textContent = "Conexão estável!";
    if (acertos === pares.length) { document.querySelector(".nucleo__luz").classList.add("aceso"); document.getElementById("aviso").textContent = "NÚCLEO RESTAURADO"; setTimeout(() => document.getElementById("vitoria").hidden = false, 700); }
  }
  painel.addEventListener("pointerdown", event => { const origem = event.target.closest(".origem"); if (!origem) return; iniciar(origem); });
  painel.addEventListener("pointermove", event => { if (!origemAtiva || !fioTemporario) return; const p = painel.getBoundingClientRect(), a = ponto(origemAtiva, true), b = { x: event.clientX - p.left, y: event.clientY - p.top }; fioTemporario.setAttribute("d", `M ${a.x} ${a.y} C ${a.x + 70} ${a.y}, ${b.x - 70} ${b.y}, ${b.x} ${b.y}`); });
  painel.addEventListener("pointerup", event => { const destino = event.target.closest(".destino"); if (destino) conectar(destino); else limparTemporario(); });
  /* Alternativa para celular: toque na origem e depois no destino. */
  painel.addEventListener("click", event => {
    const origem = event.target.closest(".origem"), destino = event.target.closest(".destino");
    if (origem && !origemAtiva) iniciar(origem);
    else if (destino && origemAtiva) conectar(destino);
  });
  document.getElementById("seguir").addEventListener("click", async () => { if (window.SaveSystem) await SaveSystem.updateActivePhase(10); else localStorage.setItem("faseAtual", "10"); location.href = "final.html"; });
  addEventListener("resize", ajustarAreaDosFios);
})();
