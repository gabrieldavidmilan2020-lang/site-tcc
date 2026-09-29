document.addEventListener("DOMContentLoaded", () => {

    // ===== SAVE =====
    let save = { pontos: 0 };
    try {
        save = SaveSystem.getSave();
        SaveSystem.atualizarFase(4);
    } catch {}

    // ===== ELEMENTOS =====
    const falaZero = document.getElementById("falaZero");
    const btnAvancar = document.getElementById("btnAvancar");
    const btnVoltar = document.getElementById("btnVoltar");
    const desafio = document.getElementById("desafio");
    const exemplo = document.getElementById("quadroExemplo");
    const codigo = document.getElementById("codigo");
    const btnValidar = document.getElementById("btnValidar");
    const proximaFase = document.getElementById("proximaFase");
    const transicao = document.getElementById("transicao");

    const caixas = document.querySelectorAll(".caixa");

    // ===== HISTÓRIA =====
   const falas = [
  {
    texto: "Tudo o que você vê aqui é uma página da web. Ela existe, mas ainda não tem estilo.",
    exemplo: "Texto simples, sem cor ou forma"
  },
  {
    texto: "CSS é a linguagem que usamos para mudar a aparência das páginas.",
    exemplo: "CSS = cores, tamanhos e bordas"
  },
  {
    texto: "No CSS, precisamos dizer QUEM vai receber o estilo.",
    exemplo: "Primeiro escolhemos o elemento"
  },
  {
    texto: "Uma CLASSE é um nome que você escolhe para marcar vários elementos iguais.",
    exemplo: "class='destaque'"
  },
  {
    texto: "No HTML, usamos a palavra class para dar esse nome ao elemento.",
    exemplo: "<div class='destaque'>Caixa</div>"
  },
  {
    texto: "No CSS, usamos um ponto antes do nome para indicar que é uma classe.",
    exemplo: ".destaque { }"
  },
  {
    texto: "As chaves { } dizem onde começam e terminam as regras de estilo.",
    exemplo: "{ regras ficam aqui }"
  },
  {
    texto: "Dentro das chaves, escrevemos propriedades e valores.",
    exemplo: "propriedade: valor;"
  },
  {
    texto: "A propriedade background muda a cor de fundo do elemento.",
    exemplo: "background: green;"
  },
  {
    texto: "O ponto e vírgula ; indica que a regra terminou.",
    exemplo: "Sempre finalize com ;"
  },
  {
    texto: "Quando você junta tudo, cria um estilo reutilizável.",
    exemplo: ".destaque { background: green; }"
  },
  {
    texto: "Agora vamos falar de algo diferente: o ID.",
    exemplo: "id='especial'"
  },
  {
    texto: "Um ID é usado quando um elemento precisa ser único na página.",
    exemplo: "Só pode existir UM"
  },
  {
    texto: "No CSS, usamos # antes do nome para indicar um ID.",
    exemplo: "#especial { }"
  },
  {
    texto: "A propriedade border cria uma linha ao redor do elemento.",
    exemplo: "border: 3px solid red;"
  },
  {
    texto: "3px é a espessura da borda.",
    exemplo: "px = pixels"
  },
  {
    texto: "solid define o tipo da linha: contínua.",
    exemplo: "existem outros tipos"
  },
  {
    texto: "red é a cor da borda.",
    exemplo: "cores podem variar"
  },
  {
    texto: "Classe = vários elementos com o mesmo estilo.",
    exemplo: "Reutilizável"
  },
  {
    texto: "ID = um único elemento com estilo exclusivo.",
    exemplo: "Identidade única"
  },
  {
    texto: "Agora você entende cada parte do que está digitando.",
    exemplo: "Missão quase completa"
  },
  {
    texto: "Use classe e ID corretamente para estilizar o sistema.",
    exemplo: "Missão liberada!"
  }
];



    let i = 0;
    falaZero.innerText = falas[i].texto;
    exemplo.innerText = falas[i].exemplo || "";

    btnAvancar.onclick = () => {
        if (i < falas.length - 1) {
            i++;
            falaZero.innerText = falas[i].texto;
            exemplo.innerText = falas[i].exemplo || "";
        } else {
            desafio.classList.remove("oculto");
            falaZero.innerText = "Resolva a missão";
        }
    };

    btnVoltar.onclick = () => {
        if (i > 0) {
            i--;
            falaZero.innerText = falas[i].texto;
            exemplo.innerText = falas[i].exemplo || "";
        }
    };

    // ===== VALIDAR =====
    btnValidar.onclick = () => {

        const css = codigo.value.toLowerCase();

        const classeOk = css.includes(".destaque");
        const idOk = css.includes("#especial");

        if (classeOk && idOk) {

            caixas.forEach(c => {
                if (c.classList.contains("destaque")) {
                    c.style.background = "green";
                }
            });

            document.getElementById("especial").style.border =
                "3px solid red";

            falaZero.innerText =
                "Perfeito! Agora o sistema tem identidade.";

            proximaFase.classList.remove("oculto");

            try {
                SaveSystem.adicionarPontos(10);
                SaveSystem.marcarFaseCompleta(4);
            } catch {}

        } else {
            falaZero.innerText =
                "Algo não está certo. Lembre-se: classe usa ponto, id usa #.";
        }
    };

    // ===== IA =====
    const btnAjuda = document.getElementById("btnAjuda");
    const janelaIA = document.getElementById("janelaIA");
    const fecharIA = document.getElementById("fecharIA");
    const enviarIA = document.getElementById("enviarIA");
    const inputIA = document.getElementById("inputIA");
    const chatIA = document.getElementById("chatIA");
    const topoIA = document.getElementById("topoIA");

    btnAjuda.onclick = () => janelaIA.classList.remove("oculto");
    fecharIA.onclick = () => janelaIA.classList.add("oculto");

    enviarIA.onclick = () => {
        if (!inputIA.value.trim()) return;
        chatIA.innerHTML += `<div><b>Você:</b> ${inputIA.value}</div>`;
        chatIA.innerHTML += `<div><b>IA:</b> Classes agrupam, IDs são únicos.</div>`;
        inputIA.value = "";
        chatIA.scrollTop = chatIA.scrollHeight;
    };

    // ===== ARRASTAR IA =====
    let drag = false, ox = 0, oy = 0;
    topoIA.onmousedown = e => {
        drag = true;
        ox = e.clientX - janelaIA.offsetLeft;
        oy = e.clientY - janelaIA.offsetTop;
    };
    document.onmousemove = e => {
        if (drag) {
            janelaIA.style.left = e.clientX - ox + "px";
            janelaIA.style.top = e.clientY - oy + "px";
        }
    };
    document.onmouseup = () => drag = false;

    // ===== TRANSIÇÃO =====
    proximaFase.onclick = () => {
        SaveSystem.atualizarFase(5);
        transicao.classList.add("ativa");
        setTimeout(() => location.href = "fase5.html", 1000);
    };

});
function nextPhase() {
    const transition = document.getElementById("transition");

    // inicia fade out
    transition.classList.add("active");

    setTimeout(() => {
        // aqui você troca de fase
        // EXEMPLOS:

        // opção 1: recarregar
        // location.reload();

        // opção 2: ir para outra fase
        window.location.href = "labirinto.html";

        // opção 3: resetar variáveis
        // loadNextMaze();

    }, 800); // tempo igual ao CSS
}
window.addEventListener("load", () => {
    const transition = document.getElementById("transition");
    transition.classList.add("active");

    setTimeout(() => {
        transition.classList.remove("active");
    }, 100);
});
const botaoProximaFase = document.getElementById("proximaFase");

botaoProximaFase.addEventListener("click", () => {
    // troca para a próxima página
    window.location.href = "fase5.html";
});
botaoProximaFase.classList.remove("oculto");
/* ===== SAVE AUTOMÁTICO DA FASE ===== */
if (window.SaveSystem) {
    SaveSystem.updateActivePhase(4);
} else {
    localStorage.setItem("faseAtual", 4);
} 