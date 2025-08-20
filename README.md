  📌 Projeto Cadastro e Listagem de Usuários
📝 Descrição

Este projeto consiste em uma aplicação Angular integrada ao JSON Server para simulação de banco de dados.
Ele permite o cadastro de usuários com dados pessoais e objetos associados, além de uma página de listagem dos registros.

⚙️ Funcionalidades
✅ Cadastro de Usuários

Formulário com os seguintes campos:

Nome (obrigatório)

Nome do meio (opcional)

Sobrenome (obrigatório)

E-mail (obrigatório, formato válido)

CEP (obrigatório, formato 00000-000)

CPF (obrigatório, formato 000.000.000-00)

✅ Cadastro de Objetos (FormArray)

Campos para cada objeto:

Nome

Quantidade

Número de série

Possibilidade de adicionar/remover objetos dinamicamente.

✅ Ações do Formulário

Botão Cadastrar:

Valida os campos

Envia os dados para o JSON Server

Retorna mensagem de sucesso ou erro

✅ Listagem de Usuários

Página com tabela exibindo:

Nome completo

E-mail

CPF

Quantidade de objetos vinculados

(Opcional) Ações de visualizar detalhes e excluir usuário.

🛠️ Tecnologias Utilizadas

Angular
 – Reactive Forms (FormGroup e FormArray)

JSON Server
 – Simulação de banco de dados REST

Bootstrap
 (opcional para estilização)
