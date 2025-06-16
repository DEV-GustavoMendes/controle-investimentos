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
- Navegador web moderno

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/investimentos-go.git
cd investimentos-go
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

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 