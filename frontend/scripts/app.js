// URL base da API Go
const API_URL = 'http://localhost:8080/api/investimentos';


function formatarDataParaAPI(dataStr) {
    if (!dataStr) return '';
    const partes = dataStr.split('/');
    if (partes.length !== 3) return dataStr;
    return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
}

function formatarDataParaExibicao(dataStr) {

    if (!dataStr) return '';
    dataStr = dataStr.split('T')[0];
    const partes = dataStr.split('-');
    if (partes.length !== 3) return dataStr;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}


function formatarValorInput(valor) {
    const numero = valor.replace(/\D/g, '');
    
    const centavos = numero.padStart(3, '0');
    const reais = centavos.slice(0, -2);
    const centavosFormatados = centavos.slice(-2);
    
    return `R$ ${reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavosFormatados}`;
}


function formatarValorParaAPI(valor) {
    const numero = valor.replace(/\D/g, '');
    return parseFloat(numero) / 100;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
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

    carregarInvestimentos();
});

function validarFormulario(investimento) {
    const erros = [];

    if (!investimento.nome.trim()) {
        erros.push('O nome do investimento é obrigatório');
    }


    if (!investimento.tipo.trim()) {
        erros.push('O tipo do investimento é obrigatório');
    }


    if (investimento.valor <= 0) {
        erros.push('O valor do investimento deve ser maior que zero');
    }


    const dataInicio = new Date(investimento.data_inicio);
    if (isNaN(dataInicio.getTime())) {
        erros.push('Data de início inválida');
    } else if (dataInicio > new Date()) {
        erros.push('A data de início não pode estar no futuro');
    }


    const dataVencimento = new Date(investimento.data_vencimento);
    if (isNaN(dataVencimento.getTime())) {
        erros.push('Data de vencimento inválida');
    } else if (dataVencimento < dataInicio) {
        erros.push('A data de vencimento deve ser posterior à data de início');
    }

    return erros;
}


function mostrarErro(mensagem) {
    alert(`❌ Erro: ${mensagem}`);
}

function mostrarSucesso(mensagem) {
    alert(`✅ ${mensagem}`);
}


let investmentsChart = null;


function criarGrafico(investimentos) {
    const ctx = document.getElementById('investmentsChart').getContext('2d');
    

    if (investmentsChart) {
        investmentsChart.destroy();
    }

    
    if (!investimentos || investimentos.length === 0) {
        return;
    }

   
    const tipos = {};
    investimentos.forEach(inv => {
        tipos[inv.tipo] = (tipos[inv.tipo] || 0) + inv.valor;
    });

    
    const labels = Object.keys(tipos);
    const valores = Object.values(tipos);

    
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


document.getElementById('formCadastro').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const investimento = {
        nome: document.getElementById('nome').value,
        tipo: document.getElementById('tipo').value,
        valor: parseFloat(document.getElementById('valor').value.replace(/\D/g, '')) / 100,
        data_inicio: formatarDataParaAPI(document.getElementById('dataInicio').value),
        data_vencimento: formatarDataParaAPI(document.getElementById('dataVencimento').value)
    };

    
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
            document.getElementById('formCadastro').reset();
            
            mostrarSucesso(`Investimento "${investimento.nome}" cadastrado com sucesso! 🎉`);
            
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


document.getElementById('searchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const termo = document.getElementById('searchInput').value.trim();
    
    if (!termo) {
        await atualizarDados();
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/buscar?termo=${encodeURIComponent(termo)}`);
        if (!response.ok) {
            throw new Error('Erro na busca');
        }
        const investimentos = await response.json();
        
        if (investimentos.length === 0) {
            mostrarErro('Nenhum investimento encontrado com os critérios informados.');
        }
        
        atualizarTabela(investimentos);
        criarGrafico(investimentos);
    } catch (error) {
        console.error('Erro na busca:', error);
        mostrarErro('Erro ao realizar a busca. Por favor, tente novamente.');
    }
});


document.getElementById('searchInput').addEventListener('input', async function(e) {
    const termo = this.value.trim();
    
    if (termo.length >= 2) {
        try {
            const response = await fetch(`${API_URL}/buscar?termo=${encodeURIComponent(termo)}`);
            if (!response.ok) {
                throw new Error('Erro na busca');
            }
            const investimentos = await response.json();
            atualizarTabela(investimentos);
            criarGrafico(investimentos);
        } catch (error) {
            console.error('Erro na busca:', error);
        }
    } else if (termo.length === 0) {
        await atualizarDados();
    }
});


async function carregarInvestimentos() {
    await atualizarDados();
}


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
                        
                        mostrarSucesso(`Investimento "${nome}" excluído com sucesso! 🗑️`);
                        
                        const tbody = document.querySelector('#tabelaInvestimentos tbody');
                        const totalInvestimentos = tbody.querySelectorAll('tr').length;
                        
                        if (totalInvestimentos === 1) {
                            
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } else {
                            
                            setTimeout(() => {
                                atualizarDados();
                            }, 100);
                        }
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


async function editarInvestimento(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const investimento = await response.json();
        
        if (!investimento) {
            mostrarErro('Investimento não encontrado.');
            return;
        }
        
        
        document.getElementById('nome').value = investimento.nome;
        document.getElementById('tipo').value = investimento.tipo;
        document.getElementById('valor').value = formatarMoeda(investimento.valor);
        document.getElementById('dataInicio').value = formatarDataParaExibicao(investimento.data_inicio);
        document.getElementById('dataVencimento').value = formatarDataParaExibicao(investimento.data_vencimento);
        
        
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
                    
                    document.getElementById('formCadastro').reset();
                    btnSubmit.textContent = 'Cadastrar';
                    btnSubmit.onclick = null;                   
                    
                    mostrarSucesso(`Investimento "${investimentoAtualizado.nome}" atualizado com sucesso! ✨`);
                    
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
        
        document.getElementById('cadastro').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarErro('Não foi possível carregar o investimento para edição.');
        console.error('Erro ao carregar investimento para edição:', error);
    }
}