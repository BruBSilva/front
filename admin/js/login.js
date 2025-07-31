document.addEventListener('DOMContentLoaded', function () {
    const user = sessionStorage.getItem('user');
    if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser.role === 'ADMIN') {
            window.location.href = '/admin/lista-trilhas.html';
        } else {
            alert('Acesso negado. Usuário não é administrador.');
        }
    }
});

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const btnLogin = document.getElementById('btnLogin');
    btnLogin.disabled = true;
    btnLogin.textContent = 'Carregando...';


    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    fetch('http://localhost:8080/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao fazer login");
            }
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem('user', JSON.stringify(data));
            if (data.role == "ADMIN") {                                                                                                                                 
                window.location.href = '/admin/lista-trilhas.html';
            } else {
                alert('Acesso negado. Usuário não é administrador.');
                sessionStorage.removeItem('user');
                window.location.href = '/admin/login.html';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha ao fazer login. Verifique suas credenciais.');
        }).finally(() => {
            btnLogin.disabled = false;
            btnLogin.textContent = 'Entrar';
        });
});