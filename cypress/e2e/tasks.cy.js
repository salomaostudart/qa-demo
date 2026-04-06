/// <reference types="cypress" />

// Cypress — Testes E2E do Gerenciador de Tarefas
// Testa a interface do usuario (frontend)

describe('Gerenciador de Tarefas — Cypress', () => {

  beforeEach(() => {
    // Limpa tarefas via API antes de cada teste
    cy.request('GET', '/api/tasks').then(res => {
      res.body.forEach(task => {
        cy.request('DELETE', `/api/tasks/${task.id}`)
      })
    })
    cy.visit('/')
  })

  it('deve exibir mensagem quando nao ha tarefas', () => {
    cy.get('[data-test="empty-message"]')
      .should('be.visible')
      .and('contain', 'Nenhuma tarefa cadastrada')
  })

  it('deve criar uma nova tarefa', () => {
    cy.get('[data-test="task-input"]').type('Estudar Cypress')
    cy.get('[data-test="add-button"]').click()

    cy.get('[data-test="task-item"]').should('have.length', 1)
    cy.get('[data-test="task-title"]').should('contain', 'Estudar Cypress')
    cy.get('[data-test="task-status"]').should('contain', 'Pendente')
  })

  it('nao deve criar tarefa com titulo vazio', () => {
    cy.get('[data-test="add-button"]').click()
    cy.get('[data-test="empty-message"]').should('be.visible')
  })

  it('deve alterar status da tarefa (pendente → em andamento → concluida)', () => {
    // Cria tarefa
    cy.get('[data-test="task-input"]').type('Tarefa de teste')
    cy.get('[data-test="add-button"]').click()

    // Pendente → Em andamento
    cy.get('[data-test="task-status"]').click()
    cy.get('[data-test="task-status"]').should('contain', 'Em andamento')

    // Em andamento → Concluida
    cy.get('[data-test="task-status"]').click()
    cy.get('[data-test="task-status"]').should('contain', 'Concluida')
  })

  it('deve deletar uma tarefa', () => {
    cy.get('[data-test="task-input"]').type('Tarefa pra deletar')
    cy.get('[data-test="add-button"]').click()
    cy.get('[data-test="task-item"]').should('have.length', 1)

    cy.get('[data-test="task-delete"]').click()
    cy.get('[data-test="empty-message"]').should('be.visible')
  })

  it('deve atualizar contadores ao criar e concluir tarefas', () => {
    // Cria 2 tarefas
    cy.get('[data-test="task-input"]').type('Tarefa 1')
    cy.get('[data-test="add-button"]').click()
    cy.get('[data-test="task-input"]').type('Tarefa 2')
    cy.get('[data-test="add-button"]').click()

    cy.get('[data-test="stat-total"]').should('have.text', '2')
    cy.get('[data-test="stat-pendentes"]').should('have.text', '2')
    cy.get('[data-test="stat-concluidas"]').should('have.text', '0')

    // Conclui primeira tarefa (2 cliques: pendente → andamento → concluida)
    cy.get('[data-test="task-status"]').first().click()
    cy.get('[data-test="task-status"]').first().click()

    cy.get('[data-test="stat-concluidas"]').should('have.text', '1')
  })

  it('deve criar tarefa com Enter', () => {
    cy.get('[data-test="task-input"]').type('Tarefa via Enter{enter}')
    cy.get('[data-test="task-item"]').should('have.length', 1)
  })
})
