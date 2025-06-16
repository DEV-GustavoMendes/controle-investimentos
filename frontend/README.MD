## Documentação do Projeto de Controle de Investimentos

**1. Visão Geral:**

* **Propósito:** Este projeto visa criar uma aplicação web intuitiva para gerenciar investimentos pessoais, permitindo o registro, acompanhamento e visualização de ativos financeiros.
* **Funcionalidades:**
    * Cadastro de investimentos: Formulário para registrar novos ativos (nome, tipo, valor, datas).
    * Listagem: Tabela dinâmica exibindo os investimentos cadastrados, com opções de edição e exclusão.
    * Visualização gráfica: Gráfico de pizza interativo mostrando a distribuição dos investimentos por tipo.
    * **Persistência de dados:** Os dados são armazenados no `localStorage` do navegador, garantindo a permanência das informações entre sessões.


**2. Fluxo de Navegação:**

* **Cadastro:** O usuário insere os dados do investimento e confirma o registro.
* **Listagem:** A tabela exibe os investimentos, com botões para edição e exclusão. O gráfico de pizza é atualizado automaticamente.
* **Ações do Usuário:**
    * Cadastro: Preenchimento do formulário → Confirmação → Atualização da tabela e gráfico.
    * Edição: Seleção do registro → Alteração dos dados → Confirmação.
    * Exclusão: Seleção do registro → Confirmação da exclusão.
    * Visualização: O gráfico reflete as alterações em tempo real.


**3. Componentes:**

* **Formulário:**
    * Entradas: Campos de texto, seleção e numéricos para os dados do investimento.
    * Saída: Validação dos dados, armazenamento no `localStorage` e atualização da interface.
* **Tabela:**
    * Entradas: Dados dos investimentos.
    * Saídas: Exibição dos dados e botões de ação (editar/excluir).
* **Gráfico:**
    * Entradas: Dados dos tipos de investimento.
    * Saídas: Representação gráfica da distribuição dos investimentos.
* **Botões:**
    * Editar: Carrega os dados do registro no formulário.
    * Excluir: Remove o registro e atualiza a interface.


**4. Design e Responsividade:**

* **Estilo:** Design minimalista, com foco na usabilidade e clareza da informação.
* **Responsividade:** Adaptação a diversos dispositivos (celulares, tablets, desktops), com otimização para telas maiores.
* **CSS:** Código organizado e comentado, facilitando a personalização e manutenção.


**5. Testes:**

* **Testes Unitários:** Validação da lógica dos componentes.
* **Testes de Integração:** Verificação da interação entre os componentes.
* **Testes End-to-End:** Simulação do fluxo de uso completo.
* **Testes de Responsividade:** Garantia da adaptação a diferentes telas.


**6. Implementação:**

* **Desenvolvimento:** Utilização de um computador com Linux Ubuntu 24.04.2 LTS, processador AMD Ryzen 7 8700g, 16GB de RAM e SSD.
* **Testes:** Realizados em diversos ambientes: Windows 11 com Google Chrome, tablets com navegador Brave e celulares com Google Chrome.
* **Ferramentas:** Utilização do DEV-TOOL dos navegadores para testes de responsividade.


**7. Detalhes Técnicos:**

* **JavaScript:**
    * Os dados são armazenados no `localStorage` do navegador.
    * Formatação de datas (ISO para DD/MM/AAAA) e valores monetários (BRL).
    * Código comentado para clareza e manutenibilidade.
* **HTML:** Estrutura lógica e organizada, com separação clara dos componentes.
* **CSS:** Código organizado, comentado e em ordem alfabética.


**8. Tecnologias Utilizadas:**

* **HTML:** Estruturação do conteúdo da aplicação.
* **CSS3:** Estilização e design da interface.
* **JavaScript:** Lógica da aplicação, manipulação de dados e interatividade.
* **Git:** Controle de versão do código.
* **Chart.js:** Geração do gráfico de pizza para visualização dos dados.


**9. Possíveis Problemas:**

* **Atualização do Gráfico:**
    * Após o cadastro, o gráfico pode não atualizar imediatamente ou não ser criado no primeiro registro.
    * Solução: Recarregar a página para garantir a atualização do gráfico.
* **Responsividade em Celulares:**
    * A tabela horizontal pode causar perda de elementos em telas de celular.
    * Recomendação: Utilizar telas maiores (tablets ou desktops) para melhor visualização.


**10. Competências (Não Obrigatórias) Concluídas:**

* **Validações Mais Detalhadas:**
    * Verificação de campos obrigatórios e formatos no front-end (ex.: valor numérico).
* **Exibição de Mensagens:**
    * Mensagens de sucesso ou erro ao cadastrar, atualizar ou deletar um investimento.
* **Gráfico Simples:**
    * Mostrar a distribuição dos tipos de investimentos usando a biblioteca Chart.js.


**11. Conclusão:**

* Este projeto de controle de investimentos foi desenvolvido com o objetivo de fornecer uma ferramenta simples e eficiente para o gerenciamento de ativos financeiros. A aplicação oferece funcionalidades essenciais como cadastro, listagem, edição e exclusão de investimentos, além de uma visualização gráfica da distribuição dos tipos de investimento. A aplicação foi projetada para ser responsiva e adaptável a diferentes dispositivos, embora apresente limitações em telas de celular devido à natureza da tabela de listagem. As tecnologias utilizadas (HTML, CSS3, JavaScript, Git e Chart.js) permitiram a criação de uma aplicação funcional e bem estruturada, com código comentado e organizado para facilitar a manutenção e futuras extensões.
