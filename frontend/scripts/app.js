// URL base da API Go
const API_URL = 'http://localhost:8080/api/investimentos';

// Formatação de datas
function formatarDataParaAPI(dataStr) {
    // Converte de DD/MM/YYYY para YYYY-MM-DD
    if (!dataStr) return '';
    const partes = dataStr.split('/');
    if (partes.length !== 3) return dataStr;
    return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
}

function formatarDataParaExibicao(dataStr) {
    // Converte de YYYY-MM-DD para DD/MM/YYYY
    if (!dataStr) return '';
    // Remove qualquer parte de hora que possa existir
    dataStr = dataStr.split('T')[0];
    const partes = dataStr.split('-');
    if (partes.length !== 3) return dataStr;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Formatação de valores monetários
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Formatar valor para exibição no input
function formatarValorInput(valor) {
    // Remove todos os caracteres não numéricos
    const numero = valor.replace(/\D/g, '');
    
    // Converte para centavos
    const centavos = numero.padStart(3, '0');
    const reais = centavos.slice(0, -2);
    const centavosFormatados = centavos.slice(-2);
    
    // Formata o número
    return `R$ ${reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavosFormatados}`;
}

// Formatar valor para envio à API
function formatarValorParaAPI(valor) {
    // Remove todos os caracteres não numéricos
    const numero = valor.replace(/\D/g, '');
    
    // Converte para número decimal
    return parseFloat(numero) / 100;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar máscara de valor
    const valorInput = document.getElementById('valor');
    valorInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        value = (value / 100).toFixed(2) + '';
        value = value.replace('.', ',');
        value = value.replace(/(\d)(\d{3})(\d{3}),/g, '$1.$2.$3,');
        value = value.replace(/(\d)(\d{3}),/g, '$1.$2,');
        this.value = 'R$ ' + value;
    });

    // Configurar datepickers
    flatpickr(".datepicker", {
        locale: "pt",
        dateFormat: "d/m/Y",
        allowInput: true
    });

    // Carregar investimentos iniciais
    carregarInvestimentos();
});

// Validação do formulário
function validarFormulario(investimento) {
    const erros = [];

    // Validar nome
    if (!investimento.nome.trim()) {
        erros.push('O nome do investimento é obrigatório');
    }

    // Validar tipo
    if (!investimento.tipo.trim()) {
        erros.push('O tipo do investimento é obrigatório');
    }

    // Validar valor
    if (investimento.valor <= 0) {
        erros.push('O valor do investimento deve ser maior que zero');
    }

    // Validar data de início
    const dataInicio = new Date(investimento.data_inicio);
    if (isNaN(dataInicio.getTime())) {
        erros.push('Data de início inválida');
    } else if (dataInicio > new Date()) {
        erros.push('A data de início não pode estar no futuro');
    }

    // Validar data de vencimento
    const dataVencimento = new Date(investimento.data_vencimento);
    if (isNaN(dataVencimento.getTime())) {
        erros.push('Data de vencimento inválida');
    } else if (dataVencimento < dataInicio) {
        erros.push('A data de vencimento deve ser posterior à data de início');
    }

    return erros;
}

// Função para mostrar mensagem de erro
function mostrarErro(mensagem) {
    alert(`❌ Erro: ${mensagem}`);
}

// Função para mostrar mensagem de sucesso
function mostrarSucesso(mensagem) {
    alert(`✅ ${mensagem}`);
}

// Variável global para o gráfico
let investmentsChart = null;

// Função para criar o gráfico
function criarGrafico(investimentos) {
    const ctx = document.getElementById('investmentsChart').getContext('2d');
    
    // Destruir o gráfico anterior se existir
    if (investmentsChart) {
        investmentsChart.destroy();
    }

    // Agrupar investimentos por tipo
    const tipos = {};
    investimentos.forEach(inv => {
        tipos[inv.tipo] = (tipos[inv.tipo] || 0) + inv.valor;
    });

    // Preparar dados para o gráfico
    const labels = Object.keys(tipos);
    const valores = Object.values(tipos);

    // Criar o novo gráfico
    investmentsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#8AC249'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const valor = context.raw;
                            return `${context.label}: ${formatarMoeda(valor)}`;
                        }
                    }
                }
            }
        }
    });
}

// Função para atualizar dados sem mostrar mensagem
async function atualizarDados() {
    try {
        const response = await fetch(API_URL);
        const investimentos = await response.json();
        atualizarTabela(investimentos);
        criarGrafico(investimentos);
    } catch (error) {
        console.error('Erro ao carregar investimentos:', error);
    }
}

// Cadastro de investimento
document.getElementById('formCadastro').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const investimento = {
        nome: document.getElementById('nome').value,
        tipo: document.getElementById('tipo').value,
        valor: parseFloat(document.getElementById('valor').value.replace(/\D/g, '')) / 100,
        data_inicio: formatarDataParaAPI(document.getElementById('dataInicio').value),
        data_vencimento: formatarDataParaAPI(document.getElementById('dataVencimento').value)
    };

    // Validar formulário
    const erros = validarFormulario(investimento);
    if (erros.length > 0) {
        mostrarErro('Por favor, corrija os seguintes erros:\n' + erros.join('\n'));
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(investimento)
        });

        if (response.ok) {
            // Primeiro limpar o formulário
            document.getElementById('formCadastro').reset();
            
            // Depois mostrar a mensagem
            mostrarSucesso(`Investimento "${investimento.nome}" cadastrado com sucesso! 🎉`);
            
            // Por último atualizar os dados
            setTimeout(() => {
                atualizarDados();
            }, 100);
        } else {
            const erro = await response.json();
            mostrarErro(erro.error);
        }
    } catch (error) {
        mostrarErro('Não foi possível conectar ao servidor. Por favor, tente novamente.');
        console.error(error);
    }
});

// Busca de investimentos
document.getElementById('searchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const termo = document.getElementById('searchInput').value.trim();
    
    try {
        const response = await fetch(`${API_URL}/buscar?termo=${encodeURIComponent(termo)}`);
        const investimentos = await response.json();
        atualizarTabela(investimentos);
        criarGrafico(investimentos);
    } catch (error) {
        console.error('Erro na busca:', error);
    }
});

// Carregar todos os investimentos
async function carregarInvestimentos() {
    await atualizarDados();
}

// Atualizar tabela
function atualizarTabela(investimentos) {
    const tbody = document.querySelector('#tabelaInvestimentos tbody');
    tbody.innerHTML = '';

    investimentos.forEach(inv => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${inv.nome}</td>
            <td>${inv.tipo}</td>
            <td>${formatarMoeda(inv.valor)}</td>
            <td>${formatarDataParaExibicao(inv.data_inicio)}</td>
            <td>${formatarDataParaExibicao(inv.data_vencimento)}</td>
            <td>
                <button class="btn-editar" data-id="${inv.id}">Editar</button>
                <button class="btn-deletar" data-id="${inv.id}">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Adiciona eventos aos botões
    document.querySelectorAll('.btn-deletar').forEach(btn => {
        btn.addEventListener('click', async function() {
            const id = this.getAttribute('data-id');
            const nome = this.closest('tr').querySelector('td').textContent;
            
            if (confirm(`Tem certeza que deseja excluir o investimento "${nome}"?`)) {
                try {
                    const response = await fetch(`${API_URL}/${id}`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        // Primeiro mostrar a mensagem
                        mostrarSucesso(`Investimento "${nome}" excluído com sucesso! 🗑️`);
                        
                        // Depois atualizar os dados
                        setTimeout(() => {
                            atualizarDados();
                        }, 100);
                    } else {
                        const erro = await response.json();
                        mostrarErro(erro.error);
                    }
                } catch (error) {
                    mostrarErro('Não foi possível conectar ao servidor. Por favor, tente novamente.');
                    console.error('Erro ao deletar:', error);
                }
            }
        });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editarInvestimento(id);
        });
    });
}

// Editar investimento
async function editarInvestimento(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const investimento = await response.json();
        
        if (!investimento) {
            mostrarErro('Investimento não encontrado.');
            return;
        }
        
        // Preenche o formulário
        document.getElementById('nome').value = investimento.nome;
        document.getElementById('tipo').value = investimento.tipo;
        document.getElementById('valor').value = formatarMoeda(investimento.valor);
        document.getElementById('dataInicio').value = formatarDataParaExibicao(investimento.data_inicio);
        document.getElementById('dataVencimento').value = formatarDataParaExibicao(investimento.data_vencimento);
        
        // Altera o botão para "Atualizar"
        const btnSubmit = document.querySelector('#formCadastro button[type="submit"]');
        btnSubmit.textContent = 'Atualizar';
        btnSubmit.onclick = async function(e) {
            e.preventDefault();
            
            const investimentoAtualizado = {
                nome: document.getElementById('nome').value,
                tipo: document.getElementById('tipo').value,
                valor: parseFloat(document.getElementById('valor').value.replace(/\D/g, '')) / 100,
                data_inicio: formatarDataParaAPI(document.getElementById('dataInicio').value),
                data_vencimento: formatarDataParaAPI(document.getElementById('dataVencimento').value)
            };

            // Validar formulário
            const erros = validarFormulario(investimentoAtualizado);
            if (erros.length > 0) {
                mostrarErro('Por favor, corrija os seguintes erros:\n' + erros.join('\n'));
                return;
            }
            
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(investimentoAtualizado)
                });
                
                if (response.ok) {
                    // Primeiro limpar o formulário e resetar o botão
                    document.getElementById('formCadastro').reset();
                    btnSubmit.textContent = 'Cadastrar';
                    btnSubmit.onclick = null;
                    
                    // Depois mostrar a mensagem
                    mostrarSucesso(`Investimento "${investimentoAtualizado.nome}" atualizado com sucesso! ✨`);
                    
                    // Por último atualizar os dados
                    setTimeout(() => {
                        atualizarDados();
                    }, 100);
                } else {
                    const erro = await response.json();
                    mostrarErro(erro.error);
                }
            } catch (error) {
                mostrarErro('Não foi possível conectar ao servidor. Por favor, tente novamente.');
                console.error('Erro ao atualizar:', error);
            }
        };
        
        // Rolagem para o formulário
        document.getElementById('cadastro').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarErro('Não foi possível carregar o investimento para edição.');
        console.error('Erro ao carregar investimento para edição:', error);
    }
}