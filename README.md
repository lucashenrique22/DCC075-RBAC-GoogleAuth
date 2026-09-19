# DCC075 — RBAC

Implementação de um sistema simples de **Role-Based Access Control (RBAC)** para a disciplina de Segurança em Sistemas de Computação.

## Objetivo

O projeto demonstra o controle de acesso baseado em papéis (RBAC), no qual os usuários possuem um papel (*role*) e cada papel possui um conjunto de permissões.

A estrutura utilizada é:

```text
Usuário
   ↓
Papel (Role)
   ↓
Permissões
```

## Cenário

Foi utilizado como cenário um sistema de gestão empresarial, com três papéis:

* **Administrador**
* **Gerente**
* **Coordenador**

Cada papel possui diferentes permissões de acordo com suas responsabilidades no sistema.

## Papéis e permissões

| Permissão             | Administrador | Gerente | Coordenador |
| --------------------- | :-----------: | :-----: | :---------: |
| Visualizar usuários   |       ✓       |    ✓    |      ✗      |
| Criar usuários        |       ✓       |    ✗    |      ✗      |
| Editar usuários       |       ✓       |    ✗    |      ✗      |
| Excluir usuários      |       ✓       |    ✗    |      ✗      |
| Visualizar relatórios |       ✓       |    ✓    |      ✓      |
| Criar relatórios      |       ✓       |    ✓    |      ✓      |
| Excluir relatórios    |       ✓       |    ✓    |      ✗      |
| Configurar sistema    |       ✓       |    ✗    |      ✗      |

## Estrutura do projeto

```text
src/
├── rbac/
│   ├── permissions.js
│   ├── roles.js
│   └── rbac.js
│
├── users/
│   └── users.js
│
└── index.js
```

### `permissions.js`

Define as permissões disponíveis no sistema.

### `roles.js`

Define os papéis existentes e as permissões associadas a cada papel.

### `rbac.js`

Contém a função responsável por verificar se determinado papel possui uma permissão.

Exemplo:

```javascript
temPermissao('GERENTE', PERMISSIONS.USUARIO_EXCLUIR);
```

retorna `false`, enquanto:

```javascript
temPermissao('ADMINISTRADOR', PERMISSIONS.USUARIO_EXCLUIR);
```

retorna `true`.

### `users.js`

Contém os usuários utilizados na demonstração e a associação de cada usuário ao seu papel.

### `index.js`

Realiza testes simples da implementação, verificando as permissões de um usuário.

## Como executar

O projeto utiliza JavaScript com Bun.

Após instalar o Bun, execute:

```bash
bun run src/index.js
```

O resultado esperado é semelhante a:

```text
Usuário: Gerente
Papel: GERENTE

Pode visualizar usuários: true
Pode excluir usuários: false
Pode criar relatórios: true
```

## Tecnologias

* JavaScript
* Bun

## Atividade

Este projeto corresponde à implementação inicial de RBAC solicitada na disciplina de Segurança em Sistemas de Computação.

A implementação será posteriormente integrada a um fluxo de autenticação utilizando **OAuth 2.0 do Google**, permitindo utilizar a identidade do usuário autenticado como entrada para o controle de autorização baseado em papéis.
