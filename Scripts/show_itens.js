document.addEventListener('DOMContentLoaded', function() {
    // Capturando elementos do DOM
    const searchInput = document.getElementById('searchInput');
    const searchBox = document.querySelector('.search-box');
    const suggestionsContainer = document.querySelector('.suggestions-container');
    const productsContainer = document.getElementById('products');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const initialLimit = 30;
    let displayedCount = 0;
    let allProducts = []; // Todos os produtos
    let filteredProducts = []; // Produtos filtrados
    let displayedProducts = []; // Produtos atualmente exibidos

    function getParameterByName(name) {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    }

    function createProductElement(row) {
        const productLink = document.createElement('a');
        productLink.classList.add('produto');
        productLink.href = row['Link'] ? row['Link'].replace(/\\\//g, '/') : '#';
        productLink.target = '_blank';
        productLink.style.position = 'relative';

        const nationalityIcon = document.createElement('i');
        nationalityIcon.style.zIndex = '999'; // Adiciona um z-index para garantir que o ícone fique acima de outros elementos
        nationalityIcon.classList.add('fa-solid');
        nationalityIcon.style.position = 'absolute';
        nationalityIcon.style.top = '15px';
        nationalityIcon.style.right = '15px';
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
            nationalityIcon.style.right = '5px';
            nationalityIcon.style.top = '5px';
            nationalityIcon.style.left = 'auto'; // Remove o right para ajustar com base no left
            nationalityIcon.style.margin = '0'; // Remove a margem para evitar sobreposição
            nationalityIcon.style.padding = '1%'; // Ajusta o padding para uma melhor apresentação em telas menores
            nationalityIcon.style.borderBottomLeftRadius = '10px'; // Arredonda a borda inferior esquerda
            nationalityIcon.style.borderBottomRightRadius = '10px'; // Arredonda a borda inferior direita
            nationalityIcon.style.borderTopLeftRadius = '0'; // Remove arredondamento da borda superior esquerda
            nationalityIcon.style.borderTopRightRadius = '0'; // Remove arredondamento da borda superior direita
        } else {
            nationalityIcon.style.right = '15px';
            nationalityIcon.style.top = '15px';
            nationalityIcon.style.borderBottomLeftRadius = '10px'; // Apenas arredondamento para telas maiores
            nationalityIcon.style.borderBottomRightRadius = '0'; // Remove arredondamento da borda inferior direita
            nationalityIcon.style.borderTopLeftRadius = '0'; // Remove arredondamento da borda superior esquerda
            nationalityIcon.style.borderTopRightRadius = '0'; // Remove arredondamento da borda superior direita
        }


        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');

        const productInfo = document.createElement('div');
        productInfo.classList.add('product-info');
        productInfo.style.textAlign = 'start';

        const productNameElement = document.createElement('p');
        productNameElement.classList.add('intra-titulo');
        const productName = row['Nome'] || 'Nome do Produto';
        productNameElement.textContent = productName.length > 80 ? productName.slice(0, 80) + '...' : productName;

        const productSales = document.createElement('h5');
        productSales.classList.add('vendidos');
        function parseNumber(value) {
        return parseInt(value.toString().replace(/\./g, ''), 10);
    }

        function formatNumberWithDots(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        const vendas = parseNumber(row['Vendas']);
        if (isNaN(vendas) || vendas === 0) {
            productSales.innerHTML = '<i class="fa-solid fa-dice-d6" style="color: #74C0FC;"></i> 0 Vendidos';
        } else if (vendas === 1) {
            productSales.innerHTML = '<i class="fa-solid fa-fire-flame-curved" style="color: #ff0000;"></i> 1 Vendido';
        } else {
            productSales.innerHTML = `<i class="fa-solid fa-fire-flame-curved" style="color: #ff0000;"></i> ${formatNumberWithDots(vendas)} Vendidos`;
        }



        // Adicionar os elementos ao DOM
        productInfo.appendChild(productNameElement);
        productInfo.appendChild(productSales);
    

        const productImage = document.createElement('img');
        productImage.src = row['URL'];
        productImage.alt = row['Nome'] || 'Produto sem nome';
        productImage.classList.add('product-image');

        productContainer.appendChild(productImage);
        productLink.appendChild(nationalityIcon);
        productContainer.appendChild(productInfo);
        productLink.appendChild(productContainer);

        // Adicionar evento de clique para exibir o pop-up
        productLink.addEventListener('click', function(event) {
            event.preventDefault(); // Evitar que o link abra diretamente
            const productUrl = this.href; // URL do produto
            showPopup(productUrl); // Mostrar o pop-up com a URL do produto
        });

        return productLink;
    }

    function showPopup(link) {
        // Verifica se já existe um pop-up presente no documento
        if (document.querySelector('.popup')) {
            return; // Sai da função se um pop-up já estiver presente
        }
        
        const popup = document.createElement('div');  // Cria o elemento div para o pop-up
        popup.classList.add('popup');  // Adiciona a classe 'popup' para estilização
    
        const popupContent = document.createElement('div');  // Cria o elemento div para o conteúdo do pop-up
        popupContent.classList.add('popup-content');  // Adiciona a classe 'popup-content' para estilização
    
        const message = document.createElement('p');  // Cria o elemento p para a mensagem
        message.textContent = 'Você será redirecionado à página do produto. Deseja continuar?';  // Define o texto da mensagem
    
        const yesButton = document.createElement('button');  // Cria o botão "Sim"
        yesButton.textContent = 'Sim';  // Define o texto do botão "Sim"
        yesButton.classList.add('yes-button');  // Adiciona a classe 'yes-button' para estilização
        yesButton.addEventListener('click', function() {
            window.open(link, '_blank');  // Redireciona para a página do produto
            document.body.removeChild(popup);  // Remove o pop-up após o redirecionamento
        });
    
        const noButton = document.createElement('button');  // Cria o botão "Não"
        noButton.textContent = 'Não';  // Define o texto do botão "Não"
        noButton.classList.add('no-button');  // Adiciona a classe 'no-button' para estilização
        noButton.addEventListener('click', function() {
            document.body.removeChild(popup);  // Remove o pop-up ao clicar em "Não"
        });
    
        popupContent.appendChild(message);  // Adiciona a mensagem ao conteúdo do pop-up
        popupContent.appendChild(yesButton);  // Adiciona o botão "Sim" ao conteúdo do pop-up
        popupContent.appendChild(noButton);  // Adiciona o botão "Não" ao conteúdo do pop-up
    
        popup.appendChild(popupContent);  // Adiciona o conteúdo ao pop-up
        document.body.appendChild(popup);  // Adiciona o pop-up ao corpo do documento
    }

    // Função para calcular a distância de Levenshtein
    function levenshtein(a, b) {
        const tmp = [];
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        for (let i = 0; i <= b.length; i++) {
            tmp[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            tmp[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                tmp[i][j] = b[i - 1] === a[j - 1]
                    ? tmp[i - 1][j - 1]
                    : Math.min(tmp[i - 1][j - 1] + 1, Math.min(tmp[i][j - 1] + 1, tmp[i - 1][j] + 1));
            }
        }
        return tmp[b.length][a.length];
    }

    // Função para calcular a similaridade de strings
    function stringSimilarity(str1, str2) {
        const distance = levenshtein(str1, str2);
        const maxLength = Math.max(str1.length, str2.length);
        return (maxLength - distance) / maxLength;
    }

    function renderProducts(produtos) {
        productsContainer.innerHTML = '';
        produtos.forEach(produto => {
            const productElement = createProductElement(produto);
            productsContainer.appendChild(productElement);
        });
    }

    // Função para atualizar as sugestões
    function updateSuggestions() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        suggestionsContainer.style.display = 'none'; // Esconde a caixa de sugestões inicialmente
        suggestionsContainer.innerHTML = ''; // Limpa as sugestões anteriores
    
        if (searchTerm.length < 2) return; // Evita mostrar sugestões para termos muito curtos
    
        // Filtra produtos para sugestões
        const filteredSuggestions = allProducts.filter(produto => {
            return produto.Nome.toLowerCase().includes(searchTerm);
        });
    
        // Limita a 4 sugestões
        const topSuggestions = filteredSuggestions.slice(0, 4);
    
        topSuggestions.forEach(produto => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            
            // Cria a imagem
            const image = document.createElement('img');
            image.src = produto.URL; // Supondo que a URL da imagem esteja no campo 'URL'
            suggestionItem.appendChild(image);
            
            // Cria o nome do item
            const itemName = document.createElement('div');
            itemName.classList.add('item-name');
            itemName.textContent = produto.Nome;
            suggestionItem.appendChild(itemName);
            
            suggestionItem.addEventListener('click', function() {
                searchInput.value = produto.Nome;
                suggestionsContainer.innerHTML = ''; // Limpa as sugestões
                suggestionsContainer.style.display = 'none'; // Esconde a caixa de sugestões
                filterProducts(); // Filtra os produtos com o termo selecionado
            });
            suggestionsContainer.appendChild(suggestionItem);
        });
    
        if (topSuggestions.length > 0) {
            suggestionsContainer.style.display = 'flex'; // Mostra a caixa de sugestões
        } else {
            suggestionsContainer.innerHTML = '<div class="suggestion-item">Nenhuma sugestão encontrada</div>';
            suggestionsContainer.style.display = 'flex'; // Mostra a caixa de sugestões
        }
    }
    
    // Função para esconder as sugestões quando clicar fora
    function hideSuggestions(event) {
        if (!searchBox.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            suggestionsContainer.style.display = 'none'; // Esconde a caixa de sugestões
        }
    }

    searchInput.addEventListener('input', updateSuggestions);
    // Adiciona o evento de clique fora para esconder as sugestões
    document.addEventListener('click', hideSuggestions);


     function filterProducts() {
        const searchTerm = searchInput.value.trim().toLowerCase();
    
        // Filtrando produtos com base no termo de busca no nome ou na classe
        filteredProducts = allProducts.filter(produto => {
            const nomeProduto = produto.Nome.toLowerCase();
            const classeProduto = produto.Classe.toLowerCase();
    
            return nomeProduto.includes(searchTerm) ||
                   classeProduto.includes(searchTerm) ||
                   stringSimilarity(nomeProduto, searchTerm) > 0.5 ||
                   stringSimilarity(classeProduto, searchTerm) > 0.5;
        });
    
        const url = new URL(window.location.href);
        url.searchParams.set('pesquisa', searchTerm);
        history.pushState(null, '', url);
    
        filteredProducts.sort((a, b) => parseInt(b.Vendas) - parseInt(a.Vendas));
    
        displayedProducts = filteredProducts.slice(0, initialLimit);
        renderProducts(displayedProducts);
    
        displayedCount = displayedProducts.length;
    
        if (displayedCount < filteredProducts.length) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    const classeEscolhida = getParameterByName('classe');
    if (classeEscolhida) {
        document.getElementById('local-name-link').textContent = classeEscolhida === 'Nacional' ? 'Produtos Nacionais' : 'Produtos Importados';

        fetch('./Todos%20os%20produtos.json')
            .then(response => response.json())
            .then(data => {
                allProducts = data.filter(produto => produto.Local === classeEscolhida);
                filteredProducts = allProducts;

                // Ordenar produtos pelo número de vendas (decrescente) apenas para a exibição inicial
                function parseNumber(value) {
                    return parseInt(value.toString().replace(/\./g, ''), 10);
                }
                
                filteredProducts.sort((a, b) => parseNumber(b.Vendas) - parseNumber(a.Vendas));
                
                displayedProducts = filteredProducts.slice(0, initialLimit);
                renderProducts(displayedProducts);
                displayedCount = displayedProducts.length;

                if (displayedCount < filteredProducts.length) {
                    loadMoreBtn.style.display = 'block';
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Erro ao carregar dados do JSON:', error);
            });
    } else {
        console.error('Nenhuma classe foi especificada na URL.');
    }

    const termoPesquisa = getParameterByName('pesquisa');
    if (termoPesquisa) {
        searchInput.value = termoPesquisa; // Preenche o campo de busca com o termo da pesquisa na URL
        filterProducts(); // Filtra automaticamente os produtos com base no termo de pesquisa
    }

    // Adicionando evento de escuta para o botão de pesquisa
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', function() {
        filterProducts();
    });

    // Adicionando evento de escuta para a tecla "Enter" no campo de busca
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            filterProducts();
        }
    });

    loadMoreBtn.addEventListener('click', function() {
        const novosProdutos = filteredProducts.slice(displayedCount, displayedCount + initialLimit);
        displayedProducts = displayedProducts.concat(novosProdutos); // Atualiza a lista de produtos exibidos

        // Adiciona novos produtos sem reordenar os já exibidos
        novosProdutos.forEach(produto => {
            const productElement = createProductElement(produto);
            productsContainer.appendChild(productElement);
        });

        displayedCount += novosProdutos.length;

        if (displayedCount >= filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
});
