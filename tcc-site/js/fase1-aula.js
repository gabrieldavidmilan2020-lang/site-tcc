document.addEventListener("DOMContentLoaded", () => {
  const abertura = document.querySelector("#abertura");
  const fala = document.querySelector("#falaAbertura");
  const opcoes = document.querySelector("#opcoesAbertura");
  const continuar = document.querySelector("#continuarFala");
  const proximaFase = document.querySelector("#proximaFase");
  const aula = document.querySelector("#aulaHtml");
  const slides = [
    {
      tag: "<html>", explicacao: "A tag html envolve o documento inteiro. Pense nela como a moldura que contém todas as outras partes da página.",
      codigo: "<html>\n  <!-- head e body ficam aqui -->\n</html>", aba: "Documento HTML",
      resultado: "O navegador recebe um documento organizado. A tag html não aparece como texto na página."
    },
    {
      tag: "<head>", explicacao: "A área head guarda informações sobre a página que ajudam o navegador. Ela fica no documento, mas não é a área principal que o visitante lê.",
      codigo: "<head>\n  <meta charset=\"UTF-8\">\n  <title>Minha página</title>\n</head>", aba: "Minha página",
      resultado: "Essas informações não aparecem como conteúdo no espaço branco da página. O navegador usa esses dados."
    },
    {
      tag: "<title>", explicacao: "A tag title define o nome da página mostrado na aba do navegador. Ela fica dentro da área head.",
      codigo: "<head>\n  <title>Minha página</title>\n</head>", aba: "Minha página",
      resultado: "Veja o nome “Minha página” na aba acima. Ele não vira um título dentro do conteúdo da página."
    },
    {
      tag: "<body>", explicacao: "A área body contém o que aparece para quem visita o site: títulos, parágrafos, imagens, botões e outros conteúdos.",
      codigo: "<body>\n  conteúdo visível da página\n</body>", aba: "Minha página",
      resultado: "O conteúdo colocado dentro de body aparece na área principal da página."
    },
    {
      tag: "<h1>", explicacao: "A tag h1 marca o título principal do conteúdo. Em geral, cada página tem um título principal que ajuda a entender o assunto.",
      codigo: "<body>\n  <h1>Minha primeira página</h1>\n</body>", aba: "Minha página",
      resultado: "Minha primeira página", tipo: "titulo"
    },
    {
      tag: "<p>", explicacao: "A tag p representa um parágrafo. Use-a para escrever uma ou mais frases que explicam o assunto da página.",
      codigo: "<body>\n  <p>Estou aprendendo HTML.</p>\n</body>", aba: "Minha página",
      resultado: "Estou aprendendo HTML. Cada parte do conteúdo tem uma função.", tipo: "paragrafo"
    }
  ];
  let atual = 0;

  function mostrarSlide() {
    const slide = slides[atual];
    document.querySelector("#passoAula").textContent = `EXEMPLO ${atual + 1} / ${slides.length}`;
    document.querySelector("#nomeTag").textContent = slide.tag;
    document.querySelector("#explicaTag").textContent = slide.explicacao;
    document.querySelector("#codigoTag").textContent = slide.codigo;
    document.querySelector("#abaNavegador").textContent = slide.aba;
    document.querySelector("#notaResultado").textContent = slide.resultado;
    const preview = document.querySelector("#resultadoTag");
    preview.replaceChildren();
    preview.className = `resultado-pagina ${slide.tipo || "vazio"}`;
    if (slide.tipo === "titulo") {
      const titulo = document.createElement("h1");
      titulo.textContent = slide.resultado;
      preview.append(titulo);
    } else if (slide.tipo === "paragrafo") {
      const paragrafo = document.createElement("p");
      paragrafo.textContent = "Estou aprendendo HTML.";
      preview.append(paragrafo);
      const complemento = document.createElement("p");
      complemento.textContent = "Cada parte do conteúdo tem uma função.";
      preview.append(complemento);
    } else if (atual === 3) {
      const amostra = document.createElement("span");
      amostra.textContent = "Conteúdo visível da página";
      preview.append(amostra);
    }
    const botao = document.querySelector("#proximoExemplo");
    botao.textContent = atual === slides.length - 1 ? "CONCLUIR EXPLICAÇÃO ▶" : "PRÓXIMO EXEMPLO ▶";
  }

  function comecarAula(texto) {
    fala.textContent = texto;
    opcoes.classList.add("oculto");
    continuar.classList.add("oculto");
    abertura.classList.add("aula-ativa");
    aula.classList.remove("oculto");
    mostrarSlide();
  }

  document.addEventListener("click", event => {
    if (event.target.closest("#sabeSim")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      comecarAula("Zero: Ótimo! Vamos revisar as partes principais com exemplos. Você verá o código e o resultado de cada uma.");
    } else if (event.target.closest("#sabeNao")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      comecarAula("Zero: Sem problema. Vou explicar cada parte com calma e mostrar como ela aparece no navegador.");
    } else if (event.target.closest("#proximoExemplo")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (atual < slides.length - 1) {
        atual++;
        mostrarSlide();
      } else {
        aula.classList.add("oculto");
        abertura.classList.remove("aula-ativa");
        fala.textContent = "Zero: Agora você viu como cada parte tem uma função e como o navegador apresenta o conteúdo. Quando estiver pronto, vamos para a próxima fase!";
        proximaFase.classList.remove("oculto");
      }
    }
  }, true);
});
