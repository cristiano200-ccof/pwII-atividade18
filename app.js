// Adiciona o evento de clique ao botão de busca assim que o arquivo é carregado
document.getElementById('btnBuscar').addEventListener('click', executarBusca);

async function executarBusca() {
    // Captura os elementos de entrada da interface
    const apiKey = document.getElementById('apiKey').value;
    const amostragem = document.getElementById('amostragem').value;
    const termoAstro = document.getElementById('buscaAstro').value.trim();
    
    // Captura os contêineres de resposta
    const statusMsg = document.getElementById('statusMessage');
    const galeria = document.getElementById('galeriaResultados');
    
    // Validação inicial para garantir que o usuário digitou um termo
    if (!termoAstro) {
        statusMsg.innerHTML = "❌ Erro: Insira o nome de um astro para pesquisar.";
        return;
    }

    // Atualiza o estado da tela para o modo de carregamento
    statusMsg.innerHTML = `⏳ Acessando banco de dados da NASA e filtrando por "${termoAstro}"...`;
    galeria.innerHTML = "";

    // Configura a URL utilizando o parâmetro 'count' para trazer registros aleatórios da API
    const urlNasa = `https://nasa.gov{apiKey}&count=${amostragem}`;

    try {
        // Realiza a requisição assíncrona para a API da NASA
        const response = await fetch(urlNasa);
        
        // Verifica se a resposta foi bem-sucedida (status 200)
        if (!response.ok) {
            throw new Error("Falha na comunicação com a API. Verifique se a sua API Key está correta.");
        }
        
        const dados = await response.json();
        const termoLower = termoAstro.toLowerCase();
        let correspondencias = 0;

        // Itera sobre o lote de dados recebido para aplicar a filtragem
        for (const item of dados) {
            const titulo = item.title || "";
            const explicacao = item.explanation || "";
            const tipoMidia = item.media_type || "";

            // Filtro: Garante que o registro é uma imagem e contém o termo no título ou descrição
            if (tipoMidia === "image" && (titulo.toLowerCase().includes(termoLower) || explicacao.toLowerCase().includes(termoLower))) {
                correspondencias++;
                
                // Prioriza a imagem em alta resolução (hdurl), se não houver, usa a padrão (url)
                const linkImagem = item.hdurl || item.url;
                
                // Cria a estrutura HTML do cartão dinamicamente
                const elementoCard = document.createElement('div');
                elementoCard.className = 'astro-card';
                
                elementoCard.innerHTML = `
                    <h2>${titulo}</h2>
                    <p><small>📅 Registro de: ${item.date}</small></p>
                    <img src="${linkImagem}" alt="${titulo}" loading="lazy">
                    <div>
                        <a href="${linkImagem}" target="_blank" download="nasa_${item.date}.jpg" class="btn-download">💾 Ver/Baixar Alta Resolução</a>
                    </div>
                    <details>
                        <summary>📖 Ler descrição científica (Original em Inglês)</summary>
                        <p style="line-height: 1.6; margin-top: 12px;">${explicacao}</p>
                    </details>
                `;
                
                // Insere o cartão gerado dentro da galeria na tela
                galeria.appendChild(elementoCard);
            }
        }

        // Retorno visual baseado se encontrou algo ou não na amostragem
        if (correspondencias === 0) {
            statusMsg.innerHTML = `❌ Nenhum resultado para "${termoAstro}" nesta rodada de sorteio. Tente clicar em buscar novamente para varrer novas fotos.`;
        } else {
            statusMsg.innerHTML = `✨ Busca concluída! Exibindo ${correspondencias} links de imagem encontrados.`;
        }

    } catch (erro) {
        // Captura e exibe qualquer erro de rede ou chave de API inválida
        statusMsg.innerHTML = `❌ Erro operacional: ${erro.message}`;
    }
}
