window.onload = function() {
    loadAndDisplayProducts('pdcts/Todos%20os%20produtos.json', 'mais-vendidos');
    loadAndDisplayProducts('pdcts/infoprodutos.json', 'info-produtos'); // Adicionando o segundo carregamento de produtos
};

// Variável para controlar a quantidade máxima de itens
let maxItems = 20;

// Função para carregar dados dos produtos e exibir em um contêiner específico
function loadAndDisplayProducts(url, containerId) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Exibir apenas os itens mais vendidos de cada classe na seção 'mais-vendidos'
            if (containerId === 'mais-vendidos') {
                let topProductsByClass = {};

                data.forEach(row => {
                    const productClass = row['Classe'];
                    // Garantir que row.Vendas seja tratado como string
                    const sales = parseInt(row['Vendas'].toString().replace(/\./g, ''));

                    if (!topProductsByClass[productClass] || sales > topProductsByClass[productClass]['Vendas']) {
                        topProductsByClass[productClass] = { ...row, 'Vendas': sales };
                    }
                });

                // Converter o objeto de volta para um array de produtos
                const topProducts = Object.values(topProductsByClass);

                // Ordenar os produtos em ordem decrescente de vendas
                topProducts.sort((a, b) => b['Vendas'] - a['Vendas']);

                // Exibir apenas os itens mais vendidos de cada classe
                displayProducts(topProducts.slice(0, maxItems), containerId);
            } else {
                // Exibir todos os produtos na seção 'info-produtos'
                displayProducts(data, containerId);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar os produtos:', error);
            document.getElementById(containerId).textContent = `Erro ao carregar os produtos: ${error.message}`;
        });
}

// Função para exibir produtos em um contêiner específico
function displayProducts(productsData, containerId) {
    const productsContainer = document.getElementById(containerId);
    productsContainer.innerHTML = ''; // Limpar conteúdo anterior

    productsData.forEach(row => {
        const productLink = createProductElement(row);
        productsContainer.appendChild(productLink);
    });

    // Adicionar eventos de clique aos novos produtos exibidos
    addClickEventToProducts();
}

// Função para criar elemento de produto
function createProductElement(row) {
    // Criar o link do produto
    const productLink = document.createElement('a');
    productLink.classList.add('produto');
    productLink.href = row['Link'] ? row['Link'].replace(/\\\//g, '/') : '#'; // Corrigir o formato do link
    productLink.target = '_blank'; // Abrir em nova guia
    productLink.style.position = 'relative'; // Adiciona posição relativa para o link

    const nationalityIcon = document.createElement('i');
    nationalityIcon.classList.add('fa-solid');
    nationalityIcon.style.position = 'absolute';
    nationalityIcon.style.top = '15px';
    nationalityIcon.style.right = '5px';
    nationalityIcon.style.fontSize = '1.1em';
    nationalityIcon.style.padding = '2%';
    nationalityIcon.style.color = '#ea6900'; // Cor do ícone
    nationalityIcon.style.backgroundColor = '#ffffff'; // Cor de fundo branca
    nationalityIcon.style.borderBottomLeftRadius = '10px'; // Border radius na borda inferior esquerda
    nationalityIcon.style.zIndex = '999'; // Adiciona um z-index para garantir que o ícone fique acima de outros elementos

    if (row['Local'] === 'Nacional') {
        nationalityIcon.classList.add('fa-location-dot'); // ícone para produto nacional
    } else if (row['Local'] === 'Importado') {
        nationalityIcon.classList.add('fa-earth-americas'); // ícone para produto importado
    }

    if (window.matchMedia("(max-width: 428px)").matches) {
        nationalityIcon.style.left = 'auto'; // Remove o left
        nationalityIcon.style.top = '5px';
        nationalityIcon.style.right = '5px'; // Posiciona à direita
        nationalityIcon.style.margin = '0'; // Remove a margem
        nationalityIcon.style.padding = '1%'; // Ajusta o padding para uma melhor apresentação em telas menores
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
    // Garantir que row.Vendas seja tratado como string
    const vendas = parseInt(row['Vendas'].toString().replace(/\./g, ''));
    const vendasFormatada = vendas.toLocaleString('pt-BR');
    if (isNaN(vendas) || vendas === 0) {
        productSales.innerHTML = '<i class="fa-solid fa-dice-d6" style="color: #74C0FC;"></i> 0 Vendidos';
    } else if (vendas === 1) {
        productSales.innerHTML = '<i class="fa-solid fa-fire-flame-curved" style="color: #ff0000;"></i> 1 Vendido';
    } else {
        productSales.innerHTML = `<i class="fa-solid fa-fire-flame-curved" style="color: #ff0000;"></i> ${vendasFormatada} Vendidos`;
    }

    // Adicionar os elementos ao DOM
    productInfo.appendChild(productNameElement);
    productInfo.appendChild(productSales);
    
    // Remover a parte relacionada à criação de preços
    // priceContainer e seus elementos (originalPrice e productPrice) foram removidos.

    // Imagem do produto
    const productImage = document.createElement('img');
    let imageUrl = row['URL'] ? decodeURIComponent(row['URL']) : '';
    imageUrl = imageUrl.replace(/^\.\.\//, 'assets/');
    productImage.src = imageUrl;
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

    return productLink;
}

// Função para adicionar evento de clique aos links de produtos
function addClickEventToProducts() {
    const productLinks = document.querySelectorAll('.produto');
    productLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Evitar que o link abra diretamente
            const productUrl = this.href; // URL do produto
            showPopup(productUrl); // Mostrar o pop-up com a URL do produto
        });
    });
}

// Função para exibir o pop-up
function showPopup(link) {
    // Verifica se já existe um pop-up ativo
    if (document.querySelector('.popup')) {
        return; // Se já existir, não cria um novo
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
        window.open(link, '_blank'); // Abre o link em uma nova guia
        document.body.removeChild(popup); // Remove o pop-up
    });

    const noButton = document.createElement('button');
    noButton.textContent = 'Não';
    noButton.classList.add('no-button');
    noButton.addEventListener('click', function() {
        document.body.removeChild(popup); // Remove o pop-up se o usuário clicar em 'Não'
    });

    popupContent.appendChild(message);
    popupContent.appendChild(yesButton);
    popupContent.appendChild(noButton);
    popup.appendChild(popupContent);
    document.body.appendChild(popup);
}

