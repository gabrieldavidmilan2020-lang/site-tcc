/* Abertura didática compartilhada: mantém a história consistente entre as fases. */
(() => {
  const etapa = (location.pathname.match(/fase(\d+)\.html/i) || [])[1] || (location.pathname.includes("final.html") ? "10" : null);
  const roteiro = {
    1: { titulo: "CAPÍTULO 1 · O SINAL", falas: ["Zero foi preso no servidor corrompido. Para abrir a primeira porta, vamos reconstruir a estrutura de uma página.", "HTML organiza o conteúdo: <html> envolve o documento, <body> guarda o que aparece e <h1> cria um título."] },
    2: { titulo: "CAPÍTULO 2 · A ESTRUTURA", falas: ["A primeira porta abriu, mas os arquivos do servidor continuam fora de ordem.", "Nesta missão, observe como as tags de abertura e fechamento trabalham em pares. Uma estrutura bem fechada evita erros na página."] },
    3: { titulo: "CAPÍTULO 3 · O MUNDO GANHA COR", falas: ["O caminho de Zero existe, porém o sistema ainda está sem identidade visual.", "CSS cuida da aparência: selecione um elemento e defina propriedades como cor, tamanho e fonte."] },
    4: { titulo: "CAPÍTULO 4 · IDENTIDADES", falas: ["Os setores do servidor estão parecidos demais; Zero precisa identificar cada painel corretamente.", "Use classes para estilos reutilizáveis e IDs para um elemento único. No CSS, classe usa ponto (.) e ID usa cerquilha (#)."] },
    5: { titulo: "CAPÍTULO 5 · FRAGMENTOS", falas: ["A fuga ativou uma defesa: o código foi espalhado pelo labirinto e um fantasma patrulha os corredores.", "Planeje sua rota com WASD, pegue todas as tags flutuantes e só então siga para a saída. Programar também é resolver problemas passo a passo."] },
    6: { titulo: "CAPÍTULO 6 · POSICIONAMENTO", falas: ["Zero encontrou a sala de navegação. Cada posição do mapa responde a uma regra CSS.", "left e top definem distância a partir da esquerda e do topo; right e bottom usam a direita e a base. O valor geralmente é dado em pixels (px)."] },
    7: { titulo: "CAPÍTULO 7 · PRECISÃO", falas: ["O próximo corredor exige coordenadas exatas para passar entre os obstáculos.", "Leia o objetivo, teste valores pequenos e observe o resultado. Ajustar CSS é experimentar, comparar e corrigir."] },
    8: { titulo: "CAPÍTULO 8 · DEPURAÇÃO", falas: ["O mapa foi corrompido: algumas regras foram escritas fora do lugar.", "Depurar significa procurar detalhes como chaves, dois-pontos, ponto e vírgula e tags fechadas. Um único símbolo pode impedir uma página de funcionar."] },
    9: { titulo: "CAPÍTULO 9 · A CENTRAL", falas: ["A energia do núcleo falhou e os cabos das tags foram desconectados.", "Arraste cada fio da abertura para o fechamento correspondente: <body> liga em </body>. Cada par correto restaura uma parte da energia."] },
    10: { titulo: "CAPÍTULO 10 · O NÚCLEO", falas: ["Chegamos ao núcleo que mantém Zero preso. Os painéis finais ainda têm erros de código.", "Repare cada painel conferindo a estrutura HTML e os fechamentos. Ao restaurar todos, a saída definitiva será aberta."] }
  };
  const capitulo = roteiro[etapa];
  if (!capitulo) return;

  const estilo = document.createElement("style");
  estilo.textContent = `
    #abertura-historia{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:20px;background:rgba(2,6,12,.88);backdrop-filter:blur(5px);font-family:"Courier New",monospace}
    .historia__painel{width:min(720px,100%);border:3px solid #37ff90;background:linear-gradient(135deg,#07151d,#101125);box-shadow:0 0 35px rgba(55,255,144,.28),9px 9px 0 #000;padding:clamp(20px,4vw,36px);color:#edfdf3}
    .historia__capitulo{margin:0 0 18px;color:#37ff90;font-size:12px;letter-spacing:.1em}.historia__texto{margin:0;min-height:84px;font-size:clamp(16px,2.4vw,21px);line-height:1.55}
    .historia__rodape{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:24px;color:#b9c7cd;font-size:12px}.historia__botao{border:2px solid #37ff90;background:#10271d;color:#effff5;padding:11px 18px;cursor:pointer;font:inherit;font-weight:bold}.historia__botao:hover,.historia__botao:focus{background:#37ff90;color:#07130c;outline:0}
  `;
  document.head.appendChild(estilo);
  const abertura = document.createElement("section");
  abertura.id = "abertura-historia";
  abertura.setAttribute("role", "dialog");
  abertura.setAttribute("aria-modal", "true");
  abertura.innerHTML = `<div class="historia__painel"><p class="historia__capitulo">${capitulo.titulo}</p><p class="historia__texto"></p><div class="historia__rodape"><span class="historia__passo"></span><button class="historia__botao" type="button">Continuar</button></div></div>`;
  document.body.appendChild(abertura);
  const texto = abertura.querySelector(".historia__texto");
  const passo = abertura.querySelector(".historia__passo");
  const botao = abertura.querySelector("button");
  let indice = 0;
  const mostrar = () => { texto.textContent = capitulo.falas[indice]; passo.textContent = `${indice + 1} / ${capitulo.falas.length}`; botao.textContent = indice === capitulo.falas.length - 1 ? "Começar missão" : "Continuar"; };
  botao.addEventListener("click", () => { if (++indice < capitulo.falas.length) mostrar(); else abertura.remove(); });
  mostrar();
})();
