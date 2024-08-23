document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestions');
    let products = []; // Armazena os produtos carregados
    let categories = new Set(); // Armazena as categorias únicas

    // Carregar produtos
    function loadProducts() {
        fetch('https://raw.githubusercontent.com/cimasome/buscapreco/main/pdcts/Todos%20os%20produtos.json')
            .then(response => response.json())
            .then(data => {
                products = data;
                // Preencher o conjunto de categorias únicas
                products.forEach(product => {
                    if (product['Categoria']) {
                        categories.add(product['Categoria']);
                    }
                });
                console.log('Produtos carregados:', products);
                console.log('Categorias carregadas:', [...categories]);
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
                threshold: 0.5 // Ajuste o threshold conforme necessário
            });

            const results = fuse.search(query).slice(0, 4);
            const productSuggestions = results.map(result => result.item);

            // Adicionar sugestões de categorias
            const categorySuggestions = [...categories]
                .filter(category => category.toLowerCase().includes(query))
                .slice(0, 4); // Limitar a 4 sugestões de categorias

            console.log('Sugestões de produtos:', productSuggestions);
            console.log('Sugestões de categorias:', categorySuggestions);

            displaySuggestions(productSuggestions, categorySuggestions);
        } else {
            suggestionsContainer.style.display = 'none'; // Ocultar sugestões se a entrada estiver vazia
        }
    });
    function displaySuggestions(productSuggestions, categorySuggestions) {
        suggestionsContainer.innerHTML = ''; // Limpar conteúdo anterior
    
        if (productSuggestions.length > 0 || categorySuggestions.length > 0) {
            suggestionsContainer.style.display = 'flex'; // Mostrar o container se houver sugestões
    
            // Adicionar sugestões de categorias
            if (categorySuggestions.length > 0) {
                const categoriesContainer = document.createElement('div');
                categoriesContainer.classList.add('suggestions-categories');
    
                categorySuggestions.forEach(category => {
                    const categoryElement = document.createElement('div');
                    categoryElement.classList.add('suggestion-item', 'category-suggestion');
    
                    const title = document.createElement('p');
                    title.textContent = category;
                    title.classList.add('item-name');
    
                    categoryElement.appendChild(title);
    
                    categoryElement.addEventListener('click', () => {
                        searchInput.value = category;
                        searchBtn.click();
                    });
    
                    categoriesContainer.appendChild(categoryElement);
                });
    
                suggestionsContainer.appendChild(categoriesContainer);
            }
    
            // Adicionar sugestões de produtos
            if (productSuggestions.length > 0) {
                const productsContainer = document.createElement('div');
                productsContainer.classList.add('suggestions-products');
    
                productSuggestions.forEach(suggestion => {
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
    
                    productsContainer.appendChild(suggestionElement);
                });
    
                suggestionsContainer.appendChild(productsContainer);
            }
        } else {
            suggestionsContainer.style.display = 'none'; // Ocultar sugestões se não houver resultados
            // Opcional: mostrar uma mensagem de "nenhum resultado encontrado"
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'Nenhum resultado encontrado. Verifique a ortografia ou tente outros termos.';
            suggestionsContainer.appendChild(noResultsMessage);
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
