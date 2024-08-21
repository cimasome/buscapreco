document.addEventListener('DOMContentLoaded', function() {
    const todasAsCategoriasDiv = document.getElementById('todasascategorias');
    const categoriasContainer = document.getElementById('categorias-container');
    const bannerProdutos = document.querySelector('.banner-produtos');
    const popupCategorias = document.getElementById('popup-categorias');
    const popupCategoriasContainer = document.getElementById('popup-categorias-container');
    const closePopup = document.querySelector('.popup-close-button');
    const verTodosProdutosButton = document.getElementById('ver-todos-produtos');
    const bannerProdutosContainer = document.getElementById('banner-produtos-container');

    let classeEscolhida = '';
    let currentClasses = [];

    function criarCategoriasDinamicamente(data) {
        const classes = [...new Set(data.map(produto => produto.Classe))];

        function atualizarClassesExibidas() {
            // Limpar o conteúdo atual da banner-produtos
            bannerProdutosContainer.innerHTML = '';

            let numeroDeClasses = 4; // Valor padrão
            if (window.matchMedia('(max-width: 1000px)').matches) {
                numeroDeClasses = 5;
            }

            currentClasses = classes.slice(0, numeroDeClasses);

            // Adicionar as classes ao banner-produtos
            currentClasses.forEach(classe => {
                const novoLink = document.createElement('a');
                novoLink.classList.add('categorias');
                novoLink.href = `products.html?classe=${encodeURIComponent(classe)}`;
                novoLink.textContent = classe;

                // Criar a imagem baseada no nome da classe
                const novaImagem = document.createElement('img');
                novaImagem.src = `assets/images/${encodeURIComponent(classe)}.webp`;
                novaImagem.alt = `Imagem da categoria ${classe}`;
                novoLink.appendChild(novaImagem);

                // Adicionar o evento de clique para abrir o pop-up de filtragem
                novoLink.addEventListener('click', function(event) {
                    event.preventDefault(); // Prevenir comportamento padrão do link
                    classeEscolhida = classe; // Armazenar a classe escolhida
                    mostrarPopupCategorias(classe, data);
                });

                bannerProdutosContainer.appendChild(novoLink);
            });

            // Adicionar o elemento "Todas as categorias" ao final
            const maisCategoriasDiv = document.createElement('div');
            maisCategoriasDiv.classList.add('mais-categorias', 'categorias');
            maisCategoriasDiv.id = 'todasascategorias';
            maisCategoriasDiv.style.cursor = 'pointer';
            maisCategoriasDiv.innerHTML = `
                <div class="categorias-text">
                    <span>Todas as categorias</span>
                </div>
                <img src="assets/images/todasascategorias.webp" alt="Todas as Categorias" id="todasascategorias-img">
            `;
            bannerProdutosContainer.appendChild(maisCategoriasDiv);

            // Adicionar evento de clique no elemento "Todas as categorias"
            maisCategoriasDiv.addEventListener('click', function() {
                bannerProdutos.style.display = 'none';
                categoriasContainer.innerHTML = '';

                fetch('https://raw.githubusercontent.com/cimasome/buscapreco/main/pdcts/Todos%20os%20produtos.json')
                    .then(response => response.json())
                    .then(data => {
                        const classesCriadas = [];
                        data.forEach(produto => {
                            const classe = produto.Classe;
                            if (!classesCriadas.includes(classe)) {
                                classesCriadas.push(classe);
                            }
                        });

                        classesCriadas.sort((a, b) => a.localeCompare(b));

                        classesCriadas.forEach(classe => {
                            const novoLink = document.createElement('a');
                            novoLink.classList.add('categorias');
                            novoLink.href = '#';
                            novoLink.textContent = classe;

                            const produto = data.find(produto => produto.Classe === classe);
                            if (produto && produto.Imagem) {
                                const novaImagem = document.createElement('img');
                                novaImagem.src = `../assets/images/${produto.Imagem}.webp`;
                                novaImagem.alt = `Imagem da categoria ${classe}`;
                                novoLink.appendChild(novaImagem);
                            }

                            novoLink.addEventListener('click', function(event) {
                                event.preventDefault();
                                classeEscolhida = classe;
                                mostrarPopupCategorias(classe, data);
                            });

                            categoriasContainer.appendChild(novoLink);

                            setTimeout(() => {
                                novoLink.classList.add('exibidas');
                            }, 10);
                        });

                        if (categoriasContainer.children.length > 0) {
                            const mostrarMenosLink = document.createElement('a');
                            mostrarMenosLink.textContent = 'Mostrar menos';
                            mostrarMenosLink.href = '#';
                            mostrarMenosLink.classList.add('categorias', 'mostrar-menos-link');
                            categoriasContainer.appendChild(mostrarMenosLink);

                            mostrarMenosLink.addEventListener('click', function(event) {
                                event.preventDefault();
                                const categorias = categoriasContainer.querySelectorAll('.categorias');
                                categorias.forEach(categoria => {
                                    categoria.classList.remove('exibidas');
                                });

                                setTimeout(() => {
                                    categoriasContainer.innerHTML = '';
                                    bannerProdutos.style.display = 'grid';
                                }, 10);
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao carregar dados do JSON:', error);
                    });
            });
        }

        // Chamar a função de atualização ao carregar a página
        atualizarClassesExibidas();

        // Adicionar listener para mudanças de tamanho da tela
        window.addEventListener('resize', function() {
            atualizarClassesExibidas();
        });
    }

    function mostrarPopupCategorias(classeEscolhida, data) {
        popupCategoriasContainer.innerHTML = '';
        verTodosProdutosButton.style.display = 'block';

        const categoriasRelacionadas = data
            .filter(produto => produto.Classe === classeEscolhida)
            .map(produto => produto.Categoria);

        const categoriasUnicas = [...new Set(categoriasRelacionadas)];

        categoriasUnicas.forEach(categoria => {
            const categoriaElemento = document.createElement('a');
            categoriaElemento.classList.add('popup-category-item');
            categoriaElemento.href = `products.html?classe=${encodeURIComponent(classeEscolhida)}&categoria=${encodeURIComponent(categoria)}`;
            categoriaElemento.textContent = categoria;
            popupCategoriasContainer.appendChild(categoriaElemento);
        });

        popupCategorias.style.display = 'flex';
    }

    closePopup.addEventListener('click', function() {
        popupCategorias.style.display = 'none';
    });

    verTodosProdutosButton.addEventListener('click', function() {
        window.location.href = `products.html?classe=${encodeURIComponent(classeEscolhida)}`;
    });

    popupCategorias.addEventListener('click', function(event) {
        if (event.target === popupCategorias) {
            popupCategorias.style.display = 'none';
        }
    });

    // Carregar e criar categorias ao iniciar
    fetch('https://raw.githubusercontent.com/cimasome/buscapreco/main/pdcts/Todos%20os%20produtos.json')
        .then(response => response.json())
        .then(data => {
            criarCategoriasDinamicamente(data);
        })
        .catch(error => {
            console.error('Erro ao carregar dados do JSON:', error);
        });
});
