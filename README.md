# DCC075 — RBAC + Google OAuth2

Implementação de um sistema simples de **Role-Based Access Control (RBAC)** integrado à autenticação via **Google OAuth2**, desenvolvido para a disciplina de Segurança em Sistemas de Computação.

O projeto contempla duas atividades:

- **Atividade 1:** Implementação de um controle de acesso baseado em papéis (RBAC).
- **Atividade 2:** Integração da autenticação via Google OAuth2 com o RBAC desenvolvido anteriormente.

## 1. Objetivo

O projeto demonstra a aplicação dos conceitos de autenticação e autorização em um sistema de gestão empresarial.

A autenticação é realizada pelo Google, enquanto a autorização é responsabilidade do próprio sistema, utilizando o modelo RBAC.

Dessa forma, após o login, o e-mail verificado retornado pelo Google é utilizado para identificar o usuário cadastrado, consultar seu papel (*role*) e determinar suas permissões.

O fluxo utilizado é:

```text
Login com Google
       ↓
Autenticação OAuth2
       ↓
Identificação do usuário pelo e-mail
       ↓
Consulta ao usuário cadastrado
       ↓
Identificação do papel (Role)
       ↓
Verificação das permissões (RBAC)
       ↓
Exibição da página autenticada
```

## 2. Cenário

Foi utilizado como cenário um sistema de gestão empresarial, com três papéis:

- **Administrador**
- **Gerente**
- **Coordenador**

Cada papel possui diferentes permissões de acordo com suas responsabilidades no sistema.

### Papéis e permissões

| Permissão | Administrador | Gerente | Coordenador |
|---|:---:|:---:|:---:|
| Visualizar usuários | ✓ | ✓ | ✗ |
| Criar usuários | ✓ | ✗ | ✗ |
| Editar usuários | ✓ | ✗ | ✗ |
| Excluir usuários | ✓ | ✗ | ✗ |
| Visualizar relatórios | ✓ | ✓ | ✓ |
| Criar relatórios | ✓ | ✓ | ✓ |
| Excluir relatórios | ✓ | ✓ | ✗ |
| Configurar sistema | ✓ | ✗ | ✗ |

## 3. Atividade 1 — Implementação do RBAC

O RBAC (*Role-Based Access Control*) é um modelo de autorização no qual as permissões são associadas a papéis, e não diretamente aos usuários.

A estrutura utilizada é:

```text
Usuário
   ↓
Papel (Role)
   ↓
Permissões
```

As permissões são centralizadas em `permissions.js`, enquanto os papéis e suas respectivas permissões são definidos em `roles.js`.

A função `temPermissao()`, implementada em `rbac.js`, é responsável por verificar se determinado papel possui autorização para executar uma ação.

Exemplo:

```javascript
temPermissao('GERENTE', PERMISSIONS.USUARIO_EXCLUIR);
```

Retorna `false`, enquanto:

```javascript
temPermissao('ADMINISTRADOR', PERMISSIONS.USUARIO_EXCLUIR);
```

Retorna `true`.

Caso o papel informado não exista, a função também retorna `false`, negando o acesso por padrão.

Os usuários utilizados na demonstração são definidos em memória, no arquivo `users.js`, com seus respectivos papéis.

## 4. Atividade 2 — Integração com Google OAuth2

A segunda atividade consiste na integração do RBAC desenvolvido anteriormente com a autenticação utilizando o Google.

Para isso, foi utilizado o fluxo de autorização OAuth2, com validação do ID Token retornado pelo Google.

### Funcionamento

1. O usuário acessa o sistema e seleciona a opção de login com Google.
2. O sistema redireciona o usuário para a autenticação do Google.
3. Após a autenticação, o Google redireciona o usuário para a rota `/callback`.
4. O backend recebe o código de autorização, obtém os tokens e valida o ID Token.
5. O sistema utiliza o e-mail verificado retornado pelo Google para localizar o usuário cadastrado.
6. Caso o usuário exista e possua um papel válido, uma sessão autenticada é criada.
7. Na página autenticada, o RBAC consulta o papel do usuário e verifica suas permissões.
8. O resultado do controle de acesso é exibido, indicando quais operações são permitidas ou negadas.

**Importante:** o Google é responsável por autenticar a identidade do usuário, mas não determina suas permissões dentro da aplicação. Essa responsabilidade pertence ao RBAC implementado no sistema.

Uma conta Google que não esteja previamente cadastrada no sistema não recebe acesso à aplicação.

### Gerenciamento de sessões

Foi utilizada a biblioteca `express-session` para manter o estado de autenticação entre as requisições.

Após o login, a sessão armazena a identificação local do usuário, permitindo que o backend consulte seus dados e permissões sem depender de parâmetros enviados pela URL.

O projeto também utiliza o parâmetro `state` no fluxo OAuth2 para auxiliar na proteção contra ataques CSRF.

### Exibição do controle de acesso

Após a autenticação, a página `/welcome` apresenta:

- Nome do usuário cadastrado;
- E-mail;
- Papel associado ao usuário;
- Relação de permissões permitidas e negadas pelo RBAC.

Dessa forma, é possível visualizar o resultado da integração entre autenticação e autorização.

## 5. Estrutura do projeto

```text
DCC075-RBAC-GoogleAuth/
│
├── src/
│   ├── auth/
│   │   ├── google.js
│   │   └── middleware.js
│   │
│   ├── rbac/
│   │   ├── permissions.js
│   │   ├── roles.js
│   │   └── rbac.js
│   │
│   ├── users/
│   │   └── users.js
│   │
│   └── index.js
│
├── public/
│   └── index.html
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Descrição dos principais arquivos

| Arquivo | Responsabilidade |
|---|---|
| `permissions.js` | Define as permissões disponíveis no sistema. |
| `roles.js` | Define os papéis e suas respectivas permissões. |
| `rbac.js` | Implementa a função de verificação de permissões. |
| `users.js` | Armazena os usuários da demonstração e seus papéis. |
| `google.js` | Implementa a comunicação com o Google OAuth2 e a validação do ID Token. |
| `middleware.js` | Verifica se existe uma sessão autenticada antes de permitir o acesso às rotas protegidas. |
| `index.js` | Configura o servidor Express, as sessões, as rotas e a integração entre OAuth2 e RBAC. |

## 6. Tecnologias utilizadas

- JavaScript
- Bun
- Node.js (APIs compatíveis)
- Express
- Google OAuth2 (`google-auth-library`)
- express-session
- dotenv

## 7. Como executar

### Pré-requisitos

- Bun instalado;
- Conta Google;
- Projeto configurado no Google Cloud Console;
- Credenciais OAuth2 do tipo Aplicativo da Web.

### 7.1. Clonar o repositório

```bash
git clone https://github.com/lucashenrique22/DCC075-RBAC-GoogleAuth.git

cd DCC075-RBAC-GoogleAuth
```

### 7.2. Instalar as dependências

```bash
bun install
```

### 7.3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como referência.

```env
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/callback

SESSION_SECRET=sua_chave_aleatoria
```

A chave da sessão pode ser gerada utilizando:

```bash
openssl rand -hex 32
```

No Google Cloud Console, configure a URI de redirecionamento autorizada:

```text
http://localhost:3000/callback
```

**Atenção:** o arquivo `.env` contém credenciais e não deve ser enviado ao repositório público.

### 7.4. Configurar um usuário para teste

Os usuários definidos em `src/users/users.js` são fictícios e utilizados exclusivamente para demonstrar o funcionamento do RBAC.

Para testar a integração com o Google OAuth2, substitua temporariamente o e-mail de um dos usuários pelo e-mail da conta Google que será utilizada na autenticação.

Exemplo:

```javascript
{
    name: 'Administrador',
    email: 'seu-email@gmail.com',
    role: 'ADMINISTRADOR'
}
```

Após realizar o login com essa conta, o sistema identificará o usuário cadastrado e exibirá suas permissões.

Para testar os diferentes níveis de autorização, altere o atributo `role` para `ADMINISTRADOR`, `GERENTE` ou `COORDENADOR`, reinicie o servidor e realize uma nova autenticação.

**Observação:** para executar o projeto com credenciais OAuth próprias, é necessário configurar o Google Cloud Console e cadastrar `http://localhost:3000/callback` como URI de redirecionamento autorizada. Caso o aplicativo esteja em modo de testes, a conta utilizada também deverá estar autorizada como usuário de teste.

### 7.5. Iniciar o servidor

Execute:

```bash
bun run src/index.js
```

Acesse no navegador:

```text
http://localhost:3000
```

Selecione a opção de login com Google.

Após a autenticação, o sistema exibirá a página autenticada com o papel do usuário e o resultado das verificações de permissões.

## 8. Considerações finais

O projeto demonstra a diferença entre dois conceitos fundamentais de Segurança em Sistemas de Computação:

- **Autenticação:** verifica a identidade do usuário, realizada neste projeto por meio do Google OAuth2.
- **Autorização:** determina quais ações o usuário autenticado pode executar, utilizando o RBAC desenvolvido na primeira atividade.

A implementação utiliza usuários cadastrados em memória, sem persistência em banco de dados, pois seu objetivo é demonstrar os conceitos solicitados nas atividades acadêmicas.

O armazenamento padrão de sessões utilizado também é destinado à demonstração local, não sendo uma configuração preparada para produção.

A integração permite demonstrar que autenticar um usuário não significa conceder acesso irrestrito ao sistema: suas permissões continuam sendo determinadas pelo papel associado a ele na aplicação.
