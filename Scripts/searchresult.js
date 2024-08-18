document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('products'); // Atualizado para o novo ID
    const classNameLink = document.getElementById('class-name-link'); // Novo ID para exibir o termo de pesquisa
    const query = new URLSearchParams(window.location.search).get('search');

    if (query) {
        // Exibir o termo de pesquisa no elemento class-name-link
        classNameLink.textContent = `Resultados para: ${query}`;

        fetch('pdcts/Todos%20os%20produtos.json')
            .then(response => response.json())
            .then(data => {
                // Configurar o Fuse.js para busca aproximada
                const options = {
                    keys: [
                        { name: 'Categoria', weight: 0.5 }, // Prioridade maior para Categoria
                        { name: 'Nome', weight: 0.3 },
                        { name: 'Classe', weight: 0.2 }
                    ],
                    threshold: 0.3 // O valor pode ser ajustado para a sensibilidade da busca
                };
                const fuse = new Fuse(data, options);

                // Realizar a busca aproximada
                const results = fuse.search(query);
                const filteredProducts = results.map(result => result.item);

                // Exibir os produtos filtrados
                displayProducts(filteredProducts, resultsContainer);
            })
            .catch(error => {
                console.error('Erro ao carregar os produtos:', error);
                resultsContainer.textContent = `Erro ao carregar os produtos: ${error.message}`;
            });
    } else {
        resultsContainer.textContent = 'Nenhum termo de pesquisa fornecido.';
    }
});

function displayProducts(productsData, container) {
    container.innerHTML = ''; // Limpar conteúdo anterior

    productsData.forEach(row => {
        const productElement = createProductElement(row);
        container.appendChild(productElement);
    });
}

function createProductElement(row) {
    const productLink = document.createElement('a');
    productLink.classList.add('produto');
    productLink.href = row['Link'] ? row['Link'].replace(/\\\//g, '/') : '#'; // Corrigir o formato do link
    productLink.target = '_blank'; // Abrir em nova guia

    const productContainer = document.createElement('div');
    productContainer.classList.add('product-container');
    productContainer.style.position = 'relative'; // Garantir que o ícone seja posicionado corretamente

    const productInfo = document.createElement('div');
    productInfo.classList.add('product-info');
    productInfo.style.textAlign = 'start';

    const productNameElement = document.createElement('p');
    productNameElement.classList.add('intra-titulo');
    const productName = row['Nome'] || 'Nome do Produto';
    productNameElement.textContent = productName.length > 80 ? productName.slice(0, 80) + '...' : productName;

    const productSales = document.createElement('h5');
    productSales.classList.add('vendidos');
    const vendas = parseInt(row['Vendas'].toString().replace(/\./g, ''));
    const vendasFormatada = vendas.toLocaleString('pt-BR');
    productSales.innerHTML = vendas === 1 
        ? '<i class="fa-solid fa-fire-flame-curved" style="color: #ff0000;"></i> 1 Vendido' 
        : `<i class="fa-solid fa-fire-flame-curved" style="color: #ff0000;"></i> ${vendasFormatada} Vendidos`;

    productInfo.appendChild(productNameElement);
    productInfo.appendChild(productSales);

    const productImage = document.createElement('img');
    productImage.src = row['URL'] ? decodeURIComponent(row['URL']) : '';
    productImage.alt = row['Nome'] || 'Produto sem nome';
    productImage.classList.add('product-image');

    // Adicionando o ícone de nacionalidade
    const nationalityIcon = document.createElement('i');
    nationalityIcon.classList.add('fa-solid');
    nationalityIcon.style.position = 'absolute';
    nationalityIcon.style.top = '10px';
    nationalityIcon.style.right = '5px';
    nationalityIcon.style.fontSize = '1.1em';
    nationalityIcon.style.padding = '2%';
    nationalityIcon.style.color = '#ea6900'; // Cor do ícone
    nationalityIcon.style.backgroundColor = '#ffffff'; // Cor de fundo branca
    nationalityIcon.style.zIndex = '999'; // Adiciona um z-index para garantir que o ícone fique acima de outros elementos
    
    if (row['Local'] === 'Nacional') {
        nationalityIcon.classList.add('fa-location-dot'); // ícone para produto nacional
    } else if (row['Local'] === 'Importado') {
        nationalityIcon.classList.add('fa-earth-americas'); // ícone para produto importado
    }

    if (window.matchMedia("(max-width: 428px)").matches) {
        nationalityIcon.style.top = '10px'; // Mantém a posição no topo
        nationalityIcon.style.right = '5px'; // Mantém a posição à direita
        nationalityIcon.style.left = 'auto'; // Remove o left
        nationalityIcon.style.margin = '0'; // Remove a margem para evitar sobreposição
        nationalityIcon.style.padding = '1%'; // Ajusta o padding para uma melhor apresentação em telas menores
        nationalityIcon.style.borderBottomLeftRadius = '10px'; // Arredonda a borda inferior esquerda
        nationalityIcon.style.borderBottomRightRadius = '0'; // Remove arredondamento da borda inferior direita
        nationalityIcon.style.borderTopLeftRadius = '0'; // Remove arredondamento da borda superior esquerda
        nationalityIcon.style.borderTopRightRadius = '0'; // Remove arredondamento da borda superior direita
    } else {
        nationalityIcon.style.borderBottomLeftRadius = '10px'; // Apenas arredondamento para telas maiores
        nationalityIcon.style.borderBottomRightRadius = '0'; // Remove arredondamento da borda inferior direita
        nationalityIcon.style.borderTopLeftRadius = '0'; // Remove arredondamento da borda superior esquerda
        nationalityIcon.style.borderTopRightRadius = '0'; // Remove arredondamento da borda superior direita
    }

    // Adicionar o ícone ao container do produto
    productContainer.appendChild(nationalityIcon);
    productContainer.appendChild(productImage);
    productContainer.appendChild(productInfo);
    productLink.appendChild(productContainer);

    return productLink;
}
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestions');
    let products = []; // Armazena os produtos carregados

    // Carregar produtos
    function loadProducts() {
        fetch('./pdcts/Todos%20os%20produtos.json')
            .then(response => response.json())
            .then(data => {
                products = data;
                console.log('Produtos carregados:', products);
            })
            .catch(error => {
                console.error('Erro ao carregar os produtos:', error);
            });
    }

    loadProducts(); // Carregar produtos ao carregar a página

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `resultados.html?search=${encodeURIComponent(query)}`;
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
            const fuse = new Fuse(products, {
                keys: ['Nome', 'Categoria', 'Classe'],
                threshold: 0.4
            });

            const results = fuse.search(query).slice(0, 4);
            const suggestions = results.map(result => result.item);

            console.log('Sugestões:', suggestions);
            displaySuggestions(suggestions);
        } else {
            suggestionsContainer.style.display = 'none'; // Ocultar sugestões se a entrada estiver vazia
        }
    });

    function displaySuggestions(suggestions) {
        suggestionsContainer.innerHTML = ''; // Limpar conteúdo anterior

        if (suggestions.length > 0) {
            suggestionsContainer.style.display = 'flex'; // Mostrar o container se houver sugestões

            suggestions.forEach(suggestion => {
                const suggestionElement = document.createElement('div');
                suggestionElement.classList.add('suggestion-item');

                const img = document.createElement('img');
                img.src = suggestion['URL'] ? decodeURIComponent(suggestion['URL']) : 'default-image.png';
                img.alt = suggestion['Nome'] || 'Imagem do Produto';
                img.classList.add('suggestion-image');

                const title = document.createElement('p');
                title.textContent = suggestion['Nome'] || 'Nome do Produto';
                title.classList.add('item-name');

                suggestionElement.appendChild(img);
                suggestionElement.appendChild(title);

                suggestionElement.addEventListener('click', () => {
                    searchInput.value = suggestion['Nome'];
                    searchBtn.click();
                });

                suggestionsContainer.appendChild(suggestionElement);
            });
        } else {
            suggestionsContainer.style.display = 'none'; // Ocultar sugestões se não houver resultados
        }
    }

    // Função para fechar sugestões se o clique for fora do contêiner
    function handleClickOutside(event) {
        if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            suggestionsContainer.style.display = 'none'; // Ocultar o container de sugestões
        }
    }

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // Para suportar toques em dispositivos móveis
});
