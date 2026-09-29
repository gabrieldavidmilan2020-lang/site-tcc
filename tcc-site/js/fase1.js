document.addEventListener("DOMContentLoaded", function () {
    const falaAbertura = document.getElementById("falaAbertura");
    const opcoesAbertura = document.getElementById("opcoesAbertura");
    const sabeSim = document.getElementById("sabeSim");
    const sabeNao = document.getElementById("sabeNao");
    const proximaFase = document.getElementById("proximaFase");
    const continuarFala = document.getElementById("continuarFala");

    document.body.classList.add("intro-ativa");

    const falasIniciais = [
        "...",
        "Onde eu estou?",
        "Não consigo me lembrar de nada...",
        "Preciso descobrir o que aconteceu aqui."
    ];
    const explicacao = [
        "Tudo bem. Vamos começar pelo básico.",
        "HTML é a linguagem que organiza o conteúdo de uma página.",
        "As tags indicam o papel de cada parte: títulos, textos e imagens.",
        "Uma página HTML começa com <html> e organiza seu conteúdo dentro de <body>.",
        "Agora que você conhece o básico, pode me ajudar a fugir na próxima fase?"
    ];
    let indice = 0;
    let falasAtuais = falasIniciais;

    function mostrarFala(texto) {
        falaAbertura.classList.remove("fala-trocando");
        void falaAbertura.offsetWidth;
        falaAbertura.classList.add("fala-trocando");
        falaAbertura.textContent = texto;
    }

    function mostrarPergunta() {
        mostrarFala("Você já sabe programar?");
        opcoesAbertura.classList.remove("oculto");
        continuarFala.classList.add("oculto");
    }

    function prepararProximaFase(texto) {
        mostrarFala(texto);
        opcoesAbertura.classList.add("oculto");
        proximaFase.classList.remove("oculto");
    }

    async function irParaFaseDois() {
        proximaFase.disabled = true;
        proximaFase.textContent = "Abrindo a fase 2...";
        if (window.SaveSystem) await SaveSystem.updateActivePhase(2);
        else localStorage.setItem("faseAtual", "2");
        window.location.href = "fase2-arena.html";
    }

    mostrarFala(falasIniciais[indice]);
    continuarFala.classList.remove("oculto");
    continuarFala.addEventListener("click", function () {
        indice++;
        if (indice < falasAtuais.length) {
            mostrarFala(falasAtuais[indice]);
            return;
        }
        continuarFala.classList.add("oculto");
        if (falasAtuais === explicacao) {
            proximaFase.classList.remove("oculto");
            return;
        }
        mostrarPergunta();
    });

    sabeSim.addEventListener("click", function () {
        prepararProximaFase("Então me ajude a sair daqui!");
    });

    sabeNao.addEventListener("click", function () {
        opcoesAbertura.classList.add("oculto");
        falasAtuais = explicacao;
        indice = 0;
        continuarFala.textContent = "próximo balão";
        continuarFala.classList.remove("oculto");
        mostrarFala(falasAtuais[indice]);
    });

    proximaFase.addEventListener("click", irParaFaseDois);

});
