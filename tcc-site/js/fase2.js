const teclas = new Set();
const player = { x: 50, y: 80, speed: .55 };
const alvo = { tag: "h1", texto: "OLÁ, MUNDO!" };
let tag = "", texto = "", perto = null, pertoDaPorta = false, concluida = false;
const arena = document.querySelector(".arena");
const zero = document.getElementById("zero");
const porta = document.getElementById("porta");
const cards = [...document.querySelectorAll(".cartao")];
const feedback = document.getElementById("feedback");

function mensagem(texto, tipo = "") { feedback.textContent = texto; feedback.className = tipo; }
function atualizarCodigo() {
  document.getElementById("combination").textContent = `${tag || "_"} + ${texto || "_"}`;
  document.getElementById("generatedCode").textContent = tag && texto ? `<${tag}>${texto}</${tag}>` : "AGUARDANDO CÓDIGO...";
}
function distancia(card) {
  const rect = card.getBoundingClientRect();
  const p = zero.getBoundingClientRect();
  return Math.hypot((p.left + p.width / 2) - (rect.left + rect.width / 2), (p.top + p.height / 2) - (rect.top + rect.height / 2));
}
function atualizarPerto() {
  perto = cards.find(card => distancia(card) < 105) || null;
  const rect = porta.getBoundingClientRect(), p = zero.getBoundingClientRect();
  pertoDaPorta = Math.hypot((p.left + p.width / 2) - (rect.left + rect.width / 2), (p.top + p.height / 2) - (rect.top + rect.height / 2)) < 150;
  cards.forEach(card => card.classList.toggle("perto", card === perto));
  porta.classList.toggle("perto", pertoDaPorta);
  if (!concluida && perto) mensagem(`APERTE F PARA COLETAR ${perto.querySelector("b").textContent}`);
  else if (!concluida && pertoDaPorta) mensagem("APERTE F PARA TENTAR ABRIR A PORTA");
  else if (!concluida) mensagem("Explore a sala com W A S D.");
}
function coletarOuAbrir() {
  if (perto) {
    if (perto.dataset.tipo === "tag") tag = perto.dataset.valor;
    else texto = perto.dataset.valor;
    cards.filter(card => card.dataset.tipo === perto.dataset.tipo).forEach(card => card.classList.remove("selecionado"));
    perto.classList.add("selecionado"); atualizarCodigo(); mensagem("Código coletado. Continue explorando.", "ok"); return;
  }
  if (!pertoDaPorta) return;
  if (tag === alvo.tag && texto === alvo.texto) { concluida = true; porta.classList.add("aberta"); mensagem("CÓDIGO CORRETO. A porta está aberta!", "ok"); document.getElementById("complete").style.display = "flex"; }
  else mensagem("A fechadura rejeitou o código. Encontre a tag e o texto certos.", "erro");
}
function mover() {
  if (teclas.has("a")) player.x -= player.speed;
  if (teclas.has("d")) player.x += player.speed;
  if (teclas.has("w")) player.y -= player.speed;
  if (teclas.has("s")) player.y += player.speed;
  player.x = Math.max(5, Math.min(95, player.x)); player.y = Math.max(10, Math.min(90, player.y));
  zero.style.left = `${player.x}%`; zero.style.top = `${player.y}%`; atualizarPerto(); requestAnimationFrame(mover);
}
document.addEventListener("keydown", event => { const key = event.key.toLowerCase(); if (["w", "a", "s", "d", "f"].includes(key)) event.preventDefault(); if (["w", "a", "s", "d"].includes(key)) teclas.add(key); if (key === "f") coletarOuAbrir(); });
document.addEventListener("keyup", event => teclas.delete(event.key.toLowerCase()));
cards.forEach(card => card.addEventListener("click", () => { if (distancia(card) < 150) { perto = card; coletarOuAbrir(); } else mensagem("Chegue mais perto deste cartão para coletá-lo."); }));
document.getElementById("nextButton").addEventListener("click", async () => { if (window.SaveSystem) await SaveSystem.updateActivePhase(3); else localStorage.setItem("faseAtual", "3"); location.href = "lobby.html"; });

const abertura = document.getElementById("aberturaFase2"), fala = document.getElementById("falaFase2");
const falas = ["A porta está trancada.", "Os cartões espalhados pela sala guardam partes do código.", "Ande até uma opção, aperte F para coletá-la e monte a combinação correta.", "Você consegue abrir a porta, Zero?"];
let indice = 0; fala.textContent = falas[indice]; fala.addEventListener("click", () => { indice++; if (indice >= falas.length) { abertura.classList.add("encerrada"); return; } fala.textContent = falas[indice]; });
atualizarCodigo(); requestAnimationFrame(mover);
/* =========================
   VARIÁVEIS
========================= */

let currentMission = 1;

let xp = 0;

let selectedTag = "";

let selectedText = "";

const totalMissions = 5;


/* =========================
   MISSÕES
========================= */

const missions = [

{
    title:"MISSÃO 01 — O PRIMEIRO ELEMENTO",

    description:
    "O computador precisa reconhecer uma mensagem. Escolha a tag correta e o texto correto.",

    target:"OLÁ, MUNDO!",

    tag:"h1",

    text:"OLÁ, MUNDO!",

    hint:
    "Escolha <h1> Título e depois clique em OLÁ, MUNDO!."
},

{
    title:"MISSÃO 02 — SEU PRIMEIRO TÍTULO",

    description:
    "O sistema reconheceu seu primeiro comando. Agora crie um título para uma página.",

    target:"MEU PRIMEIRO SITE",

    tag:"h1",

    text:"MEU PRIMEIRO SITE",

    hint:
    "Escolha a opção <h1> Título e depois MEU PRIMEIRO SITE."
},

{
    title:"MISSÃO 03 — UMA MENSAGEM",

    description:
    "Agora você precisa criar um parágrafo.",

    target:"Estou aprendendo HTML.",

    tag:"p",

    text:"Estou aprendendo HTML.",

    hint:
    "Escolha <p> Parágrafo e depois o texto Estou aprendendo HTML."
},

{
    title:"MISSÃO 04 — CONSTRUINDO",

    description:
    "Agora combine título e parágrafos para construir uma pequena página.",

    target:"UMA PEQUENA PÁGINA",

    tag:"multiple",

    text:"",

    hint:
    "Nesta missão você deverá montar uma página com título e dois parágrafos."
},

{
    title:"MISSÃO 05 — DESAFIO FINAL",

    description:
    "Você chegou ao desafio final. Monte sua própria página.",

    target:"DESAFIO FINAL",

    tag:"final",

    text:"",

    hint:
    "Você precisa utilizar um título e pelo menos dois parágrafos."
}

];


/* =========================
   SELECIONAR TAG
========================= */

function selectTag(tag,button){

    selectedTag = tag;

    document
        .querySelectorAll(".option")
        .forEach(btn => {

            if(btn.textContent.includes("<h1>") ||
               btn.textContent.includes("<p>")){

                btn.classList.remove("selected");

            }

        });

    button.classList.add("selected");

    updateCode();

}


/* =========================
   SELECIONAR TEXTO
========================= */

function selectText(text,button){

    selectedText = text;

    document
        .querySelectorAll(".option")
        .forEach(btn => {

            if(
                btn.textContent.includes("OLÁ") ||
                btn.textContent.includes("MEU PRIMEIRO") ||
                btn.textContent.includes("Estou aprendendo")
            ){

                btn.classList.remove("selected");

            }

        });

    button.classList.add("selected");

    updateCode();

}


/* =========================
   MONTAR CÓDIGO
========================= */

function updateCode(){

    const code =
        document.getElementById("generatedCode");

    if(!selectedTag || !selectedText){

        code.className = "empty";

        code.textContent =
            "Escolha uma tag e um texto...";

        return;
    }

    code.className = "";

    code.textContent =
        "<" +
        selectedTag +
        ">" +
        selectedText +
        "</" +
        selectedTag +
        ">";

}


/* =========================
   EXECUTAR
========================= */

function runCode(){

    const mission =
        missions[currentMission - 1];

    const feedback =
        document.getElementById("feedback");

    const result =
        document.getElementById("result");


    feedback.className =
        "feedback";


    /* MISSÕES 1, 2 E 3 */

    if(
        mission.tag === "h1" ||
        mission.tag === "p"
    ){

        if(
            selectedTag === mission.tag &&
            selectedText === mission.text
        ){

            const generated =
                "<" +
                selectedTag +
                ">" +
                selectedText +
                "</" +
                selectedTag +
                ">";


            result.srcdoc =
                generated;


            success();

        }else{

            error(
                "O sistema não reconheceu a combinação correta. Tente outra opção."
            );

        }

        return;

    }


    /* MISSÃO 4 */

    if(mission.tag === "multiple"){

        result.srcdoc = `
            <h1>UMA PEQUENA PÁGINA</h1>
            <p>Este é meu primeiro parágrafo.</p>
            <p>Estou aprendendo HTML.</p>
        `;

        success();

        return;

    }


    /* MISSÃO FINAL */

    if(mission.tag === "final"){

        result.srcdoc = `
            <h1>DESAFIO FINAL</h1>
            <p>Minha primeira página HTML.</p>
            <p>Eu estou aprendendo programação.</p>
        `;

        success();

    }

}


/* =========================
   SUCESSO
========================= */

function success(){

    const feedback =
        document.getElementById("feedback");

    feedback.className =
        "feedback success";

    feedback.innerHTML =
        "✓ CÓDIGO CORRETO!<br><br>" +
        "O sistema reconheceu seu código.";


    document.getElementById(
        "nextButton"
    ).style.display =
        "inline-block";


    xp += 100;


    document.getElementById(
        "xp"
    ).textContent =
        xp;

}


/* =========================
   ERRO
========================= */

function error(message){

    const feedback =
        document.getElementById("feedback");

    feedback.className =
        "feedback error";

    feedback.innerHTML =
        "⚠ CÓDIGO NÃO RECONHECIDO<br><br>" +
        message;

}


/* =========================
   DICA
========================= */

function showHint(){

    const mission =
        missions[currentMission - 1];

    const feedback =
        document.getElementById("feedback");

    feedback.className =
        "feedback hint-box";

    feedback.innerHTML =
        "💡 DICA<br><br>" +
        mission.hint;

}


/* =========================
   PRÓXIMA MISSÃO
========================= */

function nextMission(){

    currentMission++;


    if(
        currentMission > totalMissions
    ){

        finishGame();

        return;

    }


    const mission =
        missions[currentMission - 1];


    document.getElementById(
        "missionTitle"
    ).textContent =
        mission.title;


    document.getElementById(
        "missionDescription"
    ).textContent =
        mission.description;


    document.getElementById(
        "targetText"
    ).textContent =
        mission.target;


    selectedTag = "";

    selectedText = "";


    document.getElementById(
        "generatedCode"
    ).textContent =
        "Clique nas opções acima para montar seu código...";


    document.getElementById(
        "generatedCode"
    ).className =
        "empty";


    document
        .querySelectorAll(".option")
        .forEach(btn =>
            btn.classList.remove("selected")
        );


    document.getElementById(
        "feedback"
    ).className =
        "feedback";


    document.getElementById(
        "nextButton"
    ).style.display =
        "none";


    updateProgress();

}


/* =========================
   PROGRESSO
========================= */

function updateProgress(){

    document.getElementById(
        "progressText"
    ).textContent =
        currentMission +
        " / " +
        totalMissions;


    const percentage =
        (currentMission / totalMissions) * 100;


    document.getElementById(
        "progressBar"
    ).style.width =
        percentage + "%";

}


/* =========================
   FINAL
========================= */

function finishGame(){

    xp += 100;

    document.getElementById(
        "xp"
    ).textContent =
        xp;


    document.getElementById(
        "complete"
    ).style.display =
        "flex";

}


/* =========================
   FASE 2
========================= */

async function goNextPhase(){
    if (window.SaveSystem) await SaveSystem.updateActivePhase(3);
    else localStorage.setItem("faseAtual", "3");
    window.location.href = "fase3.html";

}


/* =========================
   INICIALIZAÇÃO
========================= */

updateProgress();

const aberturaFase2 = document.getElementById("aberturaFase2");
const falaFase2 = document.getElementById("falaFase2");
const falasFase2 = [
    "A porta está trancada.",
    "Você pode me ajudar a abrir esta porta?",
    "Vamos começar aprendendo como uma página HTML organiza suas informações."
];
let falaFase2Atual = 0;

document.body.classList.add("fase2-em-dialogo");
falaFase2.textContent = falasFase2[falaFase2Atual];
falaFase2.addEventListener("click", function () {
    falaFase2Atual++;
    if (falaFase2Atual >= falasFase2.length) {
        aberturaFase2.classList.add("encerrada");
        document.body.classList.remove("fase2-em-dialogo");
        return;
    }
    falaFase2.textContent = falasFase2[falaFase2Atual];
});