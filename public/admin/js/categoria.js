document.addEventListener('DOMContentLoaded', () => {
    fetchCategorias();
});

async function fetchCategorias() {
    try {
        const response = await fetch('http://localhost:8080/trilha/categorias', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar categorias');

        const categorias = await response.json();
        const listElement = document.getElementById('categorias-list');

        categorias.content.forEach(categoria => {
            const card = document.createElement('div');
            card.className = "bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 border border-gray-200";
            card.innerHTML = `<div class="flex justify-between items-center">
                                <div>
                                <h2 class="text-xl font-bold text-gray-800">${categoria.nome}</h2>
                                <p class="text-sm text-gray-600">${categoria.descricao}</p>
                                <p class="text-xs mt-1 text-gray-400">ID: ${categoria.id}</p>
                                </div>
                            </div>
                            <div class="flex justify-end gap-4">
                                <a href="forms/form-categoria.html?id=${categoria.id}" class="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                                Editar
                                </a>
                                <a href="javascript:removerCategoria(${categoria.id})" class="text-red-600 hover:text-red-900 font-medium text-sm">
                                Excluir
                                </a>
                            </div>
                    `;
            listElement.appendChild(card);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

function removerCategoria(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        fetch(`http://localhost:8080/trilha/categorias/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao excluir categoria');
                alert('Categoria excluída com sucesso!');
                location.reload();
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao excluir categoria.');
            });
    }
}