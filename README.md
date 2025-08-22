# 📌 Projeto Cadastro e Listagem de Usuários

## 📝 Descrição

Este projeto é uma aplicação Angular integrada ao JSON Server para simulação de banco de dados.  
Permite o cadastro de usuários com dados pessoais e objetos associados, além de uma página de listagem dos registros com diversas funcionalidades de importação, exportação e exclusão em massa.

---

## ⚙️ Funcionalidades

### ✅ Cadastro de Usuários

- Formulário com os seguintes campos:
  - Nome (obrigatório)
  - Nome do meio (opcional)
  - Sobrenome (obrigatório)
  - E-mail (obrigatório, formato válido)
  - CEP (obrigatório, formato 00000-000)
  - CPF (obrigatório, formato 000.000.000-00)
- Cadastro de Objetos (FormArray):
  - Nome do objeto
  - Quantidade
  - Número(s) de série
  - Possibilidade de adicionar/remover objetos dinamicamente
- Botão "Cadastrar":
  - Valida os campos
  - Envia os dados para o JSON Server
  - Retorna mensagem de sucesso ou erro
- Edição de usuários já cadastrados

---

### ✅ Listagem de Usuários

- Página com tabela exibindo:
  - Nome completo
  - E-mail
  - CPF
  - Objetos vinculados (tipo, quantidade, números de série)
- Ações:
  - Editar usuário
  - Excluir usuário individualmente
  - Seleção múltipla de usuários via checkbox
  - Exclusão em massa de usuários selecionados
- Importação de usuários via planilha CSV:
  - Não remove usuários existentes ao importar
  - Verifica conflitos por CPF e exibe aviso com os usuários não cadastrados por conflito
  - Cadastra apenas os novos usuários da planilha
- Exportação de usuários para planilha CSV
- Checkbox para selecionar todos os usuários da lista

---

### ✅ Outras Funcionalidades

- Validação de formulários reativa (Reactive Forms)
- Feedback visual de sucesso e erro
- Integração com JSON Server para simulação de API REST
- Estrutura modular e organizada de componentes Angular

---

## 🛠️ Tecnologias Utilizadas

- **Angular**
  - Reactive Forms (FormGroup e FormArray)
  - Angular Material (botões, ícones, etc)
- **JSON Server**
  - Simulação de banco de dados REST
- **Bootstrap** (opcional para estilização)
- **ngx-papaparse** (importação/exportação CSV)

---

## 🚀 Como executar

1. Instale as dependências:
   ```
   npm install
   ```
2. Inicie o JSON Server:
   ```
   npx json-server --watch db.json
   ```
3. Inicie a aplicação Angular:
   ```
   ng serve
   ```
4. Acesse em [http://localhost:4200](http://localhost:4200)

---

## 🤖 Assistente

Este projeto contou com o auxílio do bot **GitHub Copilot** para automação de código, sugestões e resolução de dúvidas técnicas durante o desenvolvimento.

---

## 📄 Observações

- O projeto é apenas para fins de estudo e simulação, não sendo recomendado para produção.
- Para dúvidas ou sugestões, abra uma issue neste repositório.
