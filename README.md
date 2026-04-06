# QA Demo — Projeto Completo de Testes

Projeto de demonstracao de QA testando uma unica aplicacao com 4 ferramentas diferentes.

## A Aplicacao

**Gerenciador de Tarefas** — CRUD completo com API REST + frontend.

- **Backend:** Node.js + Express
- **Banco:** SQLite (com scripts PostgreSQL equivalentes)
- **Frontend:** HTML + CSS + JavaScript vanilla

## Ferramentas de Teste

| Ferramenta | O que testa | Testes |
|---|---|---|
| **Cypress** | Interface (E2E) | 7 |
| **Playwright** | Interface (E2E) | 7 |
| **Postman** | API REST | 8 |
| **SQL** | Banco de dados | 8 queries |

**Total: 22 testes automatizados + 8 queries SQL de validacao**

### Cypress vs Playwright — Comparacao

Ambos testam os mesmos cenarios, permitindo comparacao direta:

| | Cypress | Playwright |
|---|---|---|
| Encontrar elemento | `cy.get(seletor)` | `page.locator(seletor)` |
| Digitar | `.type(texto)` | `.fill(texto)` |
| Clicar | `.click()` | `.click()` |
| Verificar texto | `.should('have.text', 'X')` | `expect(el).toHaveText('X')` |
| Async | Automatico (encadeamento) | Explicito (`await`) |

## Cenarios Testados

### E2E (Cypress + Playwright)
1. Exibir mensagem quando nao ha tarefas
2. Criar nova tarefa
3. Rejeitar tarefa com titulo vazio
4. Alterar status (pendente → em andamento → concluida)
5. Deletar tarefa
6. Atualizar contadores (total, pendentes, concluidas)
7. Criar tarefa com tecla Enter

### API (Postman)
1. GET — Listar tarefas
2. POST — Criar tarefa (201)
3. GET — Buscar por ID
4. PUT — Atualizar tarefa
5. DELETE — Remover tarefa
6. GET — Tarefa inexistente (404)
7. POST — Titulo vazio (400)
8. POST — Sem body (400)

### SQL (Validacao de dados)
1. Contagem total
2. Contagem por status
3. Tarefas pendentes
4. Concluidas hoje
5. Integridade (titulo vazio)
6. Status invalido
7. Criadas nos ultimos 7 dias
8. Tempo medio de conclusao

## Como rodar

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar o servidor
node app/server.js

# 3. Rodar testes Cypress (em outro terminal)
npx cypress run

# 4. Rodar testes Playwright
npx playwright test

# 5. Postman: importar postman/qa-demo-collection.json e clicar Run

# 6. SQL: executar scripts de sql/ no banco de sua escolha
```

## Estrutura

```
qa-demo/
  app/                          — Aplicacao
    server.js                   — API REST (Express)
    database.js                 — Configuracao do banco (SQLite)
    public/index.html           — Frontend
  cypress/                      — Testes E2E (Cypress)
    e2e/tasks.cy.js
  playwright/                   — Testes E2E (Playwright)
    tests/tasks.spec.js
  postman/                      — Testes de API
    qa-demo-collection.json     — Collection (importar no Postman)
  sql/                          — Queries SQL
    01-create-table.sql         — DDL (PostgreSQL)
    02-seed-data.sql            — Dados de teste
    03-queries-validacao.sql    — Queries de validacao QA
```

## Autor

Salomao Studart — [LinkedIn](https://linkedin.com/in/salomao-studart) | [GitHub](https://github.com/salomaostudart)
