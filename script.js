// Função para carregar barbearias e adicionar comportamento de clique
document.addEventListener('DOMContentLoaded', function() {
    carregarBarbearias();
    verificarTemaSalvo();
});

function carregarBarbearias() {
    const barbearias = JSON.parse(localStorage.getItem('barbearias')) || [];
    const grid = document.getElementById('barbeariasGrid');

    barbearias.forEach(barbearia => {
        const div = document.createElement('div');
        div.classList.add('barbearia-item');
        div.textContent = barbearia.nome;

        // Ao clicar na barbearia, verifica o login do cliente
        div.addEventListener('click', function() {
            verificarLoginCliente(barbearia.id);
        });

        grid.appendChild(div);
    });
}

// Função para verificar se o cliente está logado
function verificarLoginCliente(barbeariaId) {
    const clienteLogado = JSON.parse(sessionStorage.getItem('clienteLogado'));

    if (clienteLogado) {
        // Cliente está logado, redirecionar para a página de agendamento
        window.location.href = `agendamento.html?barbeariaId=${barbeariaId}`;
    } else {
        // Cliente não está logado, redirecionar para a página de login
        sessionStorage.setItem('barbeariaSelecionada', barbeariaId); // Salvar a barbearia selecionada
        window.location.href = 'login_cliente.html';
    }
}

// Função para verificar login de outros tipos de usuário
function verificarLogin(tipo) {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    return usuarioLogado && usuarioLogado.tipo === tipo ? usuarioLogado : null;
}

// Função para login de usuário
function loginUsuario(tipo, email, senha) {
    const usuarios = JSON.parse(localStorage.getItem(tipo)) || [];
    const usuario = usuarios.find(usuario => usuario.email === email && usuario.senha === senha);

    if (usuario) {
        // Salvar usuário logado no sessionStorage
        sessionStorage.setItem('usuarioLogado', JSON.stringify({ tipo: tipo, id: usuario.id }));
        return { success: true };
    } else {
        return { success: false, message: 'Email ou senha incorretos.' };
    }
}

// Função para registrar usuário
function registrarUsuario(tipo, dados) {
    const usuarios = JSON.parse(localStorage.getItem(tipo)) || [];

    // Verificar se o email já está cadastrado
    if (usuarios.some(usuario => usuario.email === dados.email)) {
        return { success: false, message: 'Email já cadastrado.' };
    }

    dados.id = gerarIdUnico();
    usuarios.push(dados);
    localStorage.setItem(tipo, JSON.stringify(usuarios));
    return { success: true };
}

// Inicializar administrador padrão se não existir
(function() {
    const administradores = JSON.parse(localStorage.getItem('administradores')) || [];
    if (administradores.length === 0) {
        const adminPadrao = {
            id: gerarIdUnico(),
            nome: 'Administrador',
            email: 'admin@exemplo.com',
            senha: 'admin123'
        };
        administradores.push(adminPadrao);
        localStorage.setItem('administradores', JSON.stringify(administradores));
    }
})();

// Função para alternar entre tema claro e escuro
document.getElementById('themeToggleBtn').addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme); // Salva a preferência do usuário
});

// Verificar o tema salvo
function verificarTemaSalvo() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

function registrarUsuario(colecao, dados) {
    return fetch('/api/registrarCliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Erro ao registrar' };
        }
    })
    .catch(error => {
        return { success: false, message: 'Erro ao conectar com o servidor' };
    });
}
