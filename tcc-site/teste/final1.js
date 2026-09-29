const intro = document.getElementById("intro");
const fase = document.getElementById("fase");
const iniciar = document.getElementById("iniciar");

iniciar.addEventListener("click", () => {
    intro.classList.add("hidden");
    fase.classList.remove("hidden");
});

let tagSelecionada = null;
let acertos = 0;

const tags = document.querySelectorAll(".tag");
const significados = document.querySelectorAll(".significado");

tags.forEach(tag => {

    tag.addEventListener("click", () => {

        tags.forEach(t => t.classList.remove("selecionado"));

        tag.classList.add("selecionado");
        tagSelecionada = tag;
    });

});

significados.forEach(sig => {

    sig.addEventListener("click", () => {

        if(!tagSelecionada) return;

        const idTag = tagSelecionada.dataset.id;
        const idSig = sig.dataset.id;

        if(idTag === idSig){

            tagSelecionada.classList.add("correto");
            sig.classList.add("correto");

            tagSelecionada.disabled = true;
            sig.disabled = true;

            acertos++;

            if(acertos === 4){
                document.getElementById("mensagem").innerHTML =
                "🎉 Sistema Restaurado! Você dominou as tags HTML!";
            }

        }else{

            sig.classList.add("errado");

            setTimeout(() => {
                sig.classList.remove("errado");
            }, 500);

        }

        tagSelecionada.classList.remove("selecionado");
        tagSelecionada = null;

    });

});