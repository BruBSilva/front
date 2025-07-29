const user = sessionStorage.getItem('user');
const token = user ? JSON.parse(user).token : null;

document.addEventListener("DOMContentLoaded", function() {
  if (!sessionStorage.getItem('user')) {
    window.location.href = '/admin/login.html';
  }

  fetch('/admin/menu.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('menu-container').innerHTML = data;
    document.getElementById('btnLogout').addEventListener('click', function() {
      sessionStorage.removeItem('user');
      window.location.href = '/admin/login.html';
    });
  })
  .catch(error => console.error('Erro ao carregar o menu:', error));
});