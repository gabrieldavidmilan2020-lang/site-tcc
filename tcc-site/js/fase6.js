/* DIÁLOGO */
const falas = [
  "Consegui sair do labirinto...",
  "Mas está tudo escuro agora.",
  "Preciso me mover com cuidado.",
  "Você pode me controlar usando CSS.",
  "Digite comandos como left, right, top e bottom.",
  "Leve-me até a estrela!"
];

let i = 0;
const fala = document.getElementById("fala");
const btn = document.getElementById("btnFala");

fala.innerText = falas[i];

btn.onclick = () => {
  i++;
  if (i < falas.length) {
    fala.innerText = falas[i];
  } else {
    document.getElementById("dialogo").style.display = "none";
    document.getElementById("fase").classList.remove("hidden");
  }
};

/* MOVIMENTO */
const zero = document.getElementById("zero");
const passo = 20;

function executar() {
  const cmd = document.getElementById("comando").value.toLowerCase();

  let left = zero.offsetLeft;
  let top = zero.offsetTop;

  if (cmd === "left") left -= passo;
  if (cmd === "right") left += passo;
  if (cmd === "top") top -= passo;
  if (cmd === "bottom") top += passo;
  if (cmd === "center") {
    left = 185;
    top = 125;
  }

  zero.style.left = left + "px";
  zero.style.top = top + "px";

  verificar();
}

/* VITÓRIA */
function verificar() {
  const z = zero.getBoundingClientRect();
  const e = document.getElementById("estrela").getBoundingClientRect();

  if (
    z.right > e.left &&
    z.left < e.right &&
    z.bottom > e.top &&
    z.top < e.bottom
  ) {
    document.getElementById("fase").classList.add("hidden");
    document.getElementById("final").classList.remove("hidden");
  }
}

/* TRANSIÇÃO */
function proxima() {
  document.body.style.opacity = "0";
  setTimeout(() => {
    window.location.href = "fase5.html";
  }, 800);
}
/* ===== SAVE AUTOMÁTICO DA FASE ===== */
if (window.SaveSystem) {
    SaveSystem.updateActivePhase(5);
} else {
    localStorage.setItem("faseAtual", 5);
} 