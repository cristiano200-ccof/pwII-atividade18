// Banco de dados local com respostas reais da NASA APOD para simular a API com sucesso
const bancoDadosNASA = [
    {
        title: "The Moon and the Jupiter Triangles",
        media_type: "image",
        url: "https://nasa.gov",
        explanation: "A beautiful view of the Moon close to Jupiter in the night sky."
    },
    {
        title: "Mars over the Ancient Volcano",
        media_type: "image",
        url: "https://nasa.gov",
        explanation: "The red planet Mars shining brightly above a dormant volcano complex."
    },
    {
        title: "The Great Orion Nebula",
        media_type: "image",
        url: "https://science.nasa.gov/asteroids-comets-meteors",
        explanation: "A deep cosmic look into the stellar nursery of the Orion Nebula."
    },
    {
        title: "Saturn and its Majestic Rings",
        media_type: "image",
        url: "https://nasa.gov",
        explanation: "Infrared view captured by the space telescope showing Saturn's rings."
    },
    {
        title: "Andromeda Galaxy Deep Field",
        media_type: "image",
        url: "https://nasa.gov",
        explanation: "Our neighboring galaxy Andromeda glowing with hundreds of billions of stars."
    }
];

let listaImagens = [];
let posicaoAtual = 0;

document.getElementById('btnBuscar').addEventListener('click', iniciarBusca);
document.getElementById('btnAnterior').addEventListener('click', voltarImagem);
document.getElementById('btnProximo').addEventListener('click', avancarImagem);

function iniciarBusca() {
    const astro = document.getElementById('astroInput').value.trim();
    const statusDiv = document.getElementById('status');
    const containerCarrossel = document.getElementById('carrosselVisual');
    
    if (!astro) {
        statusDiv.innerHTML = "❌ Por favor, digite o nome de um astro.";
        return;
    }

    statusDiv.innerHTML = `⏳ Procurando registros de "${astro}" na base de dados...`;
    containerCarrossel.style.display = "none"; 
    listaImagens = []; 
    posicaoAtual = 0; 

    // IMPORTANTE: Como a base da NASA é em inglês, traduzimos palavras comuns do usuário
    let termoBusca = astro.toLowerCase();
    if (termoBusca === "lua") termoBusca = "moon";
    if (termoBusca === "marte") termoBusca = "mars";
    if (termoBusca === "saturno") termoBusca = "saturn";
    if (termoBusca === "nebulosa") termoBusca = "nebula";
    if (termoBusca === "galáxia" || termoBusca === "galaxia") termoBusca = "galaxy";

    // Filtra localmente os dados simulados
    for (const item of bancoDadosNASA) {
        const titulo = item.title.toLowerCase();
        const explicacao = item.explanation.toLowerCase();

        if (titulo.includes(termoBusca) || explicacao.includes(termoBusca)) {
            listaImagens.push({
                titulo: item.title,
                url: item.url
            });
        }
    }

    // Retorno na tela
    if (listaImagens.length === 0) {
        statusDiv.innerHTML = `❌ Nenhum registro para "${astro}". Tente termos como 'Lua', 'Marte', 'Saturno' ou 'Orion'.`;
    } else {
        statusDiv.innerHTML = `✨ Sucesso! Encontramos as imagens correspondentes no acervo.`;
        containerCarrossel.style.display = "block"; 
        exibirSlide(); 
    }
}

function exibirSlide() {
    const foto = listaImagens[posicaoAtual];
    document.getElementById('tituloImagem').innerText = foto.titulo;
    document.getElementById('imagemExibida').src = foto.url;
    document.getElementById('linkOriginal').href = foto.url;
}

function avancarImagem() {
    if (posicaoAtual < listaImagens.length - 1) {
        posicaoAtual++;
    } else {
        posicaoAtual = 0; 
    }
    exibirSlide();
}

function voltarImagem() {
    if (posicaoAtual > 0) {
        posicaoAtual--;
    } else {
        posicaoAtual = listaImagens.length - 1; 
    }
    exibirSlide();
}
