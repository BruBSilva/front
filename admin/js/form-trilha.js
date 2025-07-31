const params = new URLSearchParams(window.location.search);
const id = params.get("id");
document.addEventListener('DOMContentLoaded', () => {
    fetchCategorias();

    if (id) {
        fetch(`http://localhost:8080/trilha/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao buscar trilha');
                return response.json();
            })
            .then(trilha => {
                document.getElementById('nome').value = trilha.nome;
                document.getElementById('descricao').value = trilha.descricao;
                document.getElementById('categoria').value = trilha.categoria.id;
                document.getElementById('nomeConquista').value = trilha.conquista.nome;
                document.getElementById('descricaoConquista').value = trilha.conquista.descricao;
                document.getElementById('xpGanho').value = trilha.conquista.xpGanho;
                document.getElementById('idConquista').value = trilha.conquista.id;
                const modulosList = document.getElementById('modulos-list');
                trilha.modulos.forEach(modulo => {
                    const row = document.createElement('tr');
                    row.setAttribute("conquista-nome", modulo.conquista.nome);
                    row.setAttribute("conquista-descricao", modulo.conquista.descricao);
                    row.setAttribute("conquista-xp", modulo.conquista.xpGanho);
                    row.innerHTML = `
                                <td>${modulo.titulo}</td>
                                <td>${modulo.conteudo}</td>
                                <td>${modulo.ordem}</td>
                                <td><button type="button" onclick="editarModulo(this)">Editar</button></td>
                                <td><button type="button" onclick="removerModulo(this)">Remover</button></td>
                            `;
                    modulosList.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao carregar trilha');
            });
    }
});

const quill = new Quill('#editor', {
    theme: 'snow'
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
        const select = document.getElementById('categoria');

        categorias.content.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

function adicionarModulo() {
    const titulo = document.getElementById('nomeModulo').value;
    const conteudo = document.getElementById('conteudoModulo').value = quill.root.innerHTML;
    const ordem = document.getElementById('ordemModulo').value;
    let conquista = {
        nome: document.getElementById('nomeConquistaModulo').value,
        descricao: document.getElementById('descricaoConquistaModulo').value,
        xpGanho: document.getElementById('xpGanhoModulo').value
    }

    if (!titulo || !conteudo || !ordem || !conquista) return;

    const moduloData = {
        titulo,
        conteudo,
        ordem: parseInt(ordem, 10),
        conquista
    };

    const modulosList = document.getElementById('modulos-list');
    const row = document.createElement('tr');
    row.setAttribute("conquista-nome", moduloData.conquista.nome);
    row.setAttribute("conquista-descricao", moduloData.conquista.descricao);
    row.setAttribute("conquista-xp", moduloData.conquista.xpGanho);
    row.innerHTML = `
                <td>${moduloData.titulo}</td>
                <td>${moduloData.conteudo}</td>
                <td>${moduloData.ordem}</td>
                <td><button type="button" onclick="editarModulo(this)">Editar</button></td>
                <td><button type="button" onclick="removerModulo(this)">Remover</button></td>
            `;
    modulosList.appendChild(row);

    document.getElementById('nomeModulo').value = '';
    document.getElementById('conteudoModulo').value = '';
    document.getElementById('ordemModulo').value = '';
    document.getElementById('nomeConquistaModulo').value = '';
    document.getElementById('descricaoConquistaModulo').value = '';
    document.getElementById('xpGanhoModulo').value = '';
    quill.root.innerHTML = '';
}

function editarModulo(button) {
    const row = button.parentElement.parentElement;
    const titulo = row.cells[0].textContent;
    const conteudo = row.cells[1].innerHTML;
    const ordem = row.cells[2].textContent;
    const conquistaNome = row.getAttribute("conquista-nome");
    const conquistaDescricao = row.getAttribute("conquista-descricao");
    const conquistaXp = row.getAttribute("conquista-xp");

    document.getElementById('nomeModulo').value = titulo;
    document.getElementById('conteudoModulo').value = conteudo;
    document.getElementById('ordemModulo').value = ordem;
    document.getElementById('nomeConquistaModulo').value = conquistaNome;
    document.getElementById('descricaoConquistaModulo').value = conquistaDescricao;
    document.getElementById('xpGanhoModulo').value = conquistaXp;
    quill.root.innerHTML = conteudo;

    removerModulo(button);
}

function removerModulo(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

function enviarFormulario(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const categoria = document.getElementById('categoria').value;
    const conquista = {
        id: document.getElementById('idConquista').value,
        nome: document.getElementById('nomeConquista').value,
        descricao: document.getElementById('descricaoConquista').value,
        xpGanho: document.getElementById('xpGanho').value
    }
    const modulosJSON = JSON.parse(JSON.stringify(Array.from(document.querySelectorAll('#modulos-list tr')).map(row => {
        return {
            titulo: row.cells[0].textContent,
            conteudo: row.cells[1].innerHTML,
            ordem: parseInt(row.cells[2].textContent, 10),
            conquista: {
                nome: row.getAttribute("conquista-nome"),
                descricao: row.getAttribute("conquista-descricao"),
                xpGanho: row.getAttribute("conquista-xp")
            }
        };
    })));

    const dados = {
        nome: nome,
        descricao: descricao,
        categoria: { id: categoria },
        conquista,
        modulos: modulosJSON
    };

    let url = 'http://localhost:8080/trilha';
    let metodo = 'POST';

    if (id) {
        url += '/' + id;
        metodo = 'PUT';
        dados.id = id;
        conquista.id = document.getElementById('idConquista').value;
    }

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)
    })
        .then(response => {
            if (!response.ok) throw new Error('Erro na requisição');
            return response.json();
        })
        .then(data => {
            console.log('Sucesso:', data);
            document.getElementById('cadastrada').textContent = 'Trilha cadastrada com sucesso!';
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('cadastrada').textContent = 'Erro ao cadastrar trilha.';
        });
}