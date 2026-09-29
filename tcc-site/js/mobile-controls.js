(() => {
  if (document.getElementById("mobile-gamepad") || document.getElementById("mobile-controls")) return;

  const style = document.createElement("style");
  style.textContent = `
    #mobile-gamepad { display:none; }
    @media (max-width:800px), (pointer:coarse) {
      #mobile-gamepad:not(.is-hidden) {
        position:fixed; z-index:10000; right:max(12px,env(safe-area-inset-right));
        bottom:max(12px,env(safe-area-inset-bottom)); display:grid;
        grid-template:repeat(2,54px)/repeat(3,54px); grid-template-areas:". up action" "left down right";
        gap:5px; padding:7px; border:1px solid #65f5a2; border-radius:16px;
        background:rgba(4,12,16,.78); box-shadow:0 0 18px #00ff8844;
        touch-action:none; user-select:none; -webkit-user-select:none;
      }
      #mobile-gamepad button { width:54px; min-height:54px; padding:0; border:2px solid #65f5a2;
        border-radius:12px; color:#eafff3; background:#13251feF; font:bold 21px monospace;
        touch-action:none; user-select:none; -webkit-user-select:none; }
      #mobile-gamepad button:active { background:#17633d; }
      #mobile-gamepad [data-key="w"] { grid-area:up; }
      #mobile-gamepad [data-key="a"] { grid-area:left; }
      #mobile-gamepad [data-key="s"] { grid-area:down; }
      #mobile-gamepad [data-key="d"] { grid-area:right; }
      #mobile-gamepad [data-key="f"] { grid-area:action; font-size:12px; }
      #fase { height:auto; min-height:100dvh; flex-direction:column; gap:12px; padding:10px; }
      #tv, #fase #game { width:min(94vw,800px); max-width:94vw; }
      #fase #game { height:min(55dvh,480px); min-height:250px; }
      #fase #painel { width:min(94vw,650px); flex-direction:row; flex-wrap:wrap; justify-content:center; }
      #fase #painel .card { flex:1 1 220px; width:auto; min-width:0; }
      #final { max-height:100dvh; overflow-y:auto; padding:16px; }
    }
  `;
  document.head.appendChild(style);

  const pad = document.createElement("nav");
  pad.id = "mobile-gamepad";
  pad.className = "is-hidden";
  pad.setAttribute("aria-label", "Controles de movimento");
  pad.innerHTML = '<button type="button" data-key="w" aria-label="Andar para cima">?</button>' +
    '<button type="button" data-key="a" aria-label="Andar para a esquerda">?</button>' +
    '<button type="button" data-key="s" aria-label="Andar para baixo">?</button>' +
    '<button type="button" data-key="d" aria-label="Andar para a direita">?</button>' +
    '<button type="button" data-key="f" aria-label="Interagir">A??O</button>';
  document.body.appendChild(pad);

  const intros = ["#intro", "#dialog", "#dialogo", "#abertura", "#aberturaFase2", "#dialogoInicial", "#cutscene", "#complete", "#gameOver", "#success", "#vitoriaTela", "#erroTela", ".overlay.mostrar"];
  function atualizarVisibilidade() {
    const introAberto = intros.some(seletor => {
      const el = document.querySelector(seletor);
      if (!el || el.classList.contains("hidden") || el.classList.contains("oculto") || el.classList.contains("encerrada")) return false;
      const css = getComputedStyle(el);
      return css.display !== "none" && css.visibility !== "hidden" && Number(css.opacity || 1) > .2;
    });
    pad.classList.toggle("is-hidden", introAberto);
  }
  new MutationObserver(atualizarVisibilidade).observe(document.body, {
    subtree:true, attributes:true, attributeFilter:["class", "style"]
  });
  atualizarVisibilidade();

  const emit = (key, type) => document.dispatchEvent(new KeyboardEvent(type, {
    key, code:key.length === 1 ? `Key${key.toUpperCase()}` : key,
    bubbles:true, cancelable:true
  }));

  function moverPorCodigo(key) {
    const comando = document.getElementById("cmd");
    const zero = document.getElementById("zero");
    if (comando && zero && typeof window.executar === "function") {
      const placeholders = comando.placeholder.toLowerCase();
      comando.value = placeholders.includes("32") ? `${({a:"left", d:"right", w:"top", s:"bottom"})[key]} 32` : ({a:"left", d:"right", w:"top", s:"bottom"})[key];
      window.executar();
      return true;
    }

    const code = document.getElementById("code");
    const map = document.getElementById("map");
    const zeroCss = document.getElementById("zero");
    const check = document.getElementById("check");
    if (code && map && zeroCss && check) {
      let x = Number.parseFloat(getComputedStyle(zeroCss).left) || 0;
      let y = Number.parseFloat(getComputedStyle(zeroCss).top) || 0;
      const passo = Math.max(24, Math.min(40, Math.round(map.clientWidth * .09)));
      if (key === "a") x -= passo;
      if (key === "d") x += passo;
      if (key === "w") y -= passo;
      if (key === "s") y += passo;
      x = Math.max(0, Math.min(map.clientWidth - zeroCss.offsetWidth, x));
      y = Math.max(0, Math.min(map.clientHeight - zeroCss.offsetHeight, y));
      code.value = `#zero { left: ${Math.round(x)}px; top: ${Math.round(y)}px; }`;
      check.click();
      return true;
    }
    return false;
  }

  const ativos = new Set();
  pad.querySelectorAll("button").forEach(botao => {
    const key = botao.dataset.key;
    const pressionar = event => {
      event.preventDefault();
      if (ativos.has(key)) return;
      ativos.add(key);
      botao.setPointerCapture?.(event.pointerId);
      if (key === "f") {
        emit(key, "keydown");
        setTimeout(() => { emit(key, "keyup"); ativos.delete(key); }, 90);
      } else if (!moverPorCodigo(key)) {
        emit(key, "keydown");
      }
    };
    const soltar = event => {
      event.preventDefault();
      if (!ativos.has(key)) return;
      ativos.delete(key);
      if (key !== "f" && !document.getElementById("cmd") && !document.getElementById("code")) emit(key, "keyup");
    };
    botao.addEventListener("pointerdown", pressionar);
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(tipo => botao.addEventListener(tipo, soltar));
    botao.addEventListener("contextmenu", event => event.preventDefault());
  });
  window.addEventListener("blur", () => {
    ativos.forEach(key => { if (key !== "f") emit(key, "keyup"); });
    ativos.clear();
  });
})();
