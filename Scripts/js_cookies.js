function exibirAlertaCookies() {
    var cookieAlert = document.getElementById('cookieAlert');
    cookieAlert.innerHTML = `
        <p>Este site utiliza cookies para garantir a melhor experiência do usuário. Ao continuar navegando, você concorda com o uso de cookies. 
        <a href="Sobre_nós.html#seta3" class="privacy-link">Consulte nossa Política de Privacidade</a></p>
        <div class="buttons">
            <button onclick="aceitarCookies()">Aceitar</button>
            <button onclick="rejeitarCookies()">Rejeitar</button>
        </div>
    `;
    cookieAlert.style.display = 'flex';
}

function aceitarCookies() {
    criarCookie('aceitouCookies', 'true', 30); // Cookie expira em 30 dias
    var cookieAlert = document.getElementById('cookieAlert');
    cookieAlert.style.display = 'none';
}

function rejeitarCookies() {
    excluirCookie('aceitouCookies');
    var cookieAlert = document.getElementById('cookieAlert');
    cookieAlert.style.display = 'none';
}

setTimeout(exibirAlertaCookies, 5000); // 5 segundos

function criarCookie(nome, valor, dias) {
    var data = new Date();
    data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000));
    var expires = "expires=" + data.toUTCString();
    document.cookie = nome + "=" + valor + ";" + expires + ";path=/";
}

function excluirCookie(nome) {
    document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
