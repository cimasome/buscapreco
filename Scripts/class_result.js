document.addEventListener('DOMContentLoaded', function() {
    // Função para obter parâmetros da URL
    function getParameterByName(name) {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    }

    function createProductElement(row) {
        // Criar o link do produto
        const productLink = document.createElement('a');
        productLink.classList.add('produto');
        productLink.href = row['Link'] ? row['Link'].replace(/\\\//g, '/') : '#'; // Corrigir o formato do link
        productLink.style.position = 'relative'; // Adiciona posição relativa para o link
    
        // Criar ícone de nacionalidade
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
    
        // Criar o contêiner principal do produto
        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');
    
        // Criar a seção para as informações do produto
        const productInfo = document.createElement('div');
        productInfo.classList.add('product-info');
        productInfo.style.textAlign = 'start'; // Alinha todo o conteúdo à esquerda, exceto o título
    
        // Título do produto
        const productNameElement = document.createElement('p');
        productNameElement.classList.add('intra-titulo');
        const productName = row['Nome'] || 'Nome do Produto';
        productNameElement.textContent = productName.length > 80 ? productName.slice(0, 80) + '...' : productName;
    
        // Número de vendidos
        const productSales = document.createElement('h5');
        productSales.classList.add('vendidos');
        const vendas = row['Vendas']; // Lê o valor diretamente da coluna Vendas
        if (!vendas || vendas === '0') {
            productSales.innerHTML = '<i class="fa-solid fa-dice-d6" style="color: #74C0FC;"></i> 0 Vendidos';
        } else {
            const vendasFormatadas = vendas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            const label = vendas === '1' ? 'Vendido' : 'Vendidos';
            productSales.innerHTML = `<i class="fa-solid fa-fire-flame-curved" style="color: #ff0000;"></i> ${vendasFormatadas} ${label}`;
        }
    
        // Adicionar os elementos ao DOM
        productInfo.appendChild(productNameElement);
        productInfo.appendChild(productSales);
    
        // Imagem do produto
        const productImage = document.createElement('img');
        productImage.src = row['URL']; // Usar a URL fornecida no JSON
        productImage.alt = row['Nome'] || 'Produto sem nome';
        productImage.classList.add('product-image');
    
        // Adicionar a imagem ao contêiner principal
        productContainer.appendChild(productImage);
    
        // Adicionar ícone de nacionalidade ao link do produto
        productLink.appendChild(nationalityIcon);
    
        // Adicionar o contêiner do produto às informações do produto
        productContainer.appendChild(productInfo);
    
        // Adicionar o contêiner do produto ao link
        productLink.appendChild(productContainer);
    
        // Adicionar evento de clique ao produto
        productLink.addEventListener('click', function(event) {
            event.preventDefault(); // Evitar que o link abra diretamente
            const productUrl = this.href; // URL do produto
            showPopup(productUrl); // Mostrar o pop-up com a URL do produto
        });
    
        return productLink;
    }
    
    // Função para exibir o pop-up
    function showPopup(link) {
        // Verificar se um pop-up já existe
        if (document.querySelector('.popup')) {
            return; // Não criar um novo pop-up se já existir um
        }

        const popup = document.createElement('div');
        popup.classList.add('popup');

        const popupContent = document.createElement('div');
        popupContent.classList.add('popup-content');

        const message = document.createElement('p');
        message.textContent = 'Você será redirecionado à página do produto. Deseja continuar?';

        const yesButton = document.createElement('button');
        yesButton.textContent = 'Sim';
        yesButton.classList.add('yes-button');
        yesButton.addEventListener('click', function() {
            // Redirecionar o usuário para a página do produto
            window.open(link, '_blank');
            document.body.removeChild(popup); // Remover o pop-up após redirecionar
        });

        const noButton = document.createElement('button');
        noButton.textContent = 'Não';
        noButton.classList.add('no-button');
        noButton.addEventListener('click', function() {
            // Fechar o pop-up ao clicar no botão Não
            document.body.removeChild(popup); // Remover o pop-up ao clicar em Não
        });

        popupContent.appendChild(message);
        popupContent.appendChild(yesButton);
        popupContent.appendChild(noButton);

        popup.appendChild(popupContent);
        document.body.appendChild(popup);
    }

    // Obter a classe escolhida a partir da URL
    const classeEscolhida = getParameterByName('classe');
    const categoriaEscolhida = getParameterByName('categoria');

    if (classeEscolhida) {
        let displayText = ''; // Inicializa o texto de exibição como vazio
        
        if (categoriaEscolhida) {
            displayText = categoriaEscolhida; // Define o texto de exibição apenas como a categoria
        } else {
            displayText = classeEscolhida; // Se não houver categoria, exibe o nome da classe
        }

        const classNameLink = document.getElementById('class-name-link');
        if (classNameLink) { 
            classNameLink.textContent = displayText;
        } else {
            console.error('Elemento com ID "class-name-link" não encontrado.');
        }

        document.getElementById('class-name-link').textContent = displayText;

        // Fazer a requisição para obter os dados do JSON
        fetch('./Todos%20os%20produtos.json')
            .then(response => response.json())
            .then(data => {
                // Filtrar os produtos pela classe e categoria escolhida
                let produtosFiltrados = data.filter(produto =>
                    produto.Classe === classeEscolhida &&
                    (!categoriaEscolhida || produto.Categoria === categoriaEscolhida) // Filtrar pela categoria se especificada
                );

                // Função para converter o valor de vendas em número
                function parseNumber(value) {
                    return parseInt(value.toString().replace(/\./g, ''), 10);
                }

                // Ordenar os produtos por número de vendas, do maior para o menor
                produtosFiltrados.sort((a, b) => parseNumber(b.Vendas) - parseNumber(a.Vendas));



                const productsContainer = document.getElementById('products');
                const loadMoreBtn = document.getElementById('loadMoreBtn');
                let filter = ''; // Variável para armazenar o filtro atual

                function renderProducts(produtos, limit) {
                    // Limpar o container antes de renderizar os produtos
                    productsContainer.innerHTML = '';
                
                    // Renderizar os produtos filtrados e ordenados até o limite
                    produtos.slice(0, limit).forEach(produto => {
                        // Criar o elemento de produto usando a função createProductElement
                        const productElement = createProductElement(produto);
                        productsContainer.appendChild(productElement);
                    });
                
                    // Verificar se ainda há mais produtos a serem exibidos
                    if (limit < produtos.length) {
                        loadMoreBtn.style.display = 'block';
                    } else {
                        loadMoreBtn.style.display = 'none';
                    }
                }

                // Renderizar os produtos iniciais
                renderProducts(produtosFiltrados, 20);

                // Contador para controlar quantos produtos foram exibidos
                let displayedCount = 20;

                // Adicionar evento ao botão "Carregar mais produtos"
                loadMoreBtn.addEventListener('click', function() {
                    displayedCount += 20;
                    renderProducts(produtosFiltrados, displayedCount);
                });
    

            })
            .catch(error => {
                console.error('Erro ao carregar dados do JSON:', error);
            });
    } else {
        console.error('Nenhuma classe foi especificada na URL.');
    }
});

