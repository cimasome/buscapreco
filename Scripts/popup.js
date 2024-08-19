
// Função para criar e exibir o popup após 5 segundos
setTimeout(function() {
    var popupContainer = document.createElement('div');
    popupContainer.className = 'meu-popup-wrapper';
    popupContainer.innerHTML = `
        <div class="meu-popup-content">
            <img src="assets/images/popup.webp" data-src-small="assets/images/popupm.webp" alt="Anúncio" class="meu-popup-img">
            <div class="meu-popup-buttons">
                <a href="https://amzn.to/3yjuwyw" class="meu-popup-button" target="_blank">Comprar agora</a>
                <a href="#" class="meu-popup-button" onclick="fecharMeuPopup(event)">Fechar anúncio</a>
            </div>
        </div>
    `;
    document.body.appendChild(popupContainer);
    updatePopupImage(); // Atualizar a imagem conforme o tamanho da tela
}, 5000); // 5000 milissegundos = 5 segundos

// Função para fechar o popup
function fecharMeuPopup(event) {
    event.preventDefault(); // Prevenir o comportamento padrão do link
    var popup = document.querySelector('.meu-popup-wrapper');
    if (popup) {
        popup.remove();
    }
}

// Função para atualizar a imagem conforme o tamanho da tela
function updatePopupImage() {
    var img = document.querySelector('.meu-popup-img');
    if (window.innerWidth <= 1200) {
        img.src = img.getAttribute('data-src-small');
    } else {
        img.src = "assets/images/popup.webp";
    }
}

// Atualiza a imagem ao redimensionar a janela
window.addEventListener('resize', updatePopupImage);
