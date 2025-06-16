# Sistema de Gerenciamento de Investimentos

Sistema desenvolvido em Go para gerenciamento de investimentos, com interface web responsiva e visualização gráfica dos dados.

## Funcionalidades

- Cadastro de investimentos
- Listagem de investimentos
- Edição de investimentos
- Exclusão de investimentos
- Pesquisa de investimentos
- Visualização gráfica da distribuição por tipo
- Formatação automática de valores e datas
- Interface responsiva

## Tecnologias Utilizadas

- Backend: Go (Golang)
- Frontend: HTML, CSS, JavaScript
- Banco de Dados: SQLite
- Bibliotecas:
  - Gin (Framework Web)
  - Chart.js (Gráficos)
  - Flatpickr (Seletor de datas)

## Requisitos

- Go 1.16 ou superior
```bash
sudo apt-get install golang
```
- Navegador web moderno

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/DEV-GustavoMendes/gestao-investimento
cd controle-investimentos-fullstack
```

2. Instale as dependências:
```bash
go mod download
```

3. Execute o servidor:
```bash
go run main.go
```

4. Acesse a aplicação em `http://localhost:8080`

## Estrutura do Projeto


- `/frontend`: Contém todos os arquivos do frontend (HTML, CSS, JavaScript)
- `/handlers`: Contém os handlers da API em Go
- `main.go`: Arquivo principal do backend
- `investimentos.db`: Banco de dados SQLite


```
investimentos-go/
├── frontend/
│   ├── css/
│   ├── scripts/
│   └── index.html
├── handlers/
│   ├── db/
│   ├── models/
│   └── repository/
├── main.go
└── README.md
```



