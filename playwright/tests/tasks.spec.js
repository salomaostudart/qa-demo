// Playwright — Testes E2E do Gerenciador de Tarefas
// Mesmos cenarios do Cypress, sintaxe diferente

const { test, expect, request } = require('@playwright/test')

// Limpa tarefas antes de cada teste
test.beforeEach(async ({ page }) => {
  const api = await request.newContext({ baseURL: 'http://localhost:3000' })
  const res = await api.get('/api/tasks')
  const tasks = await res.json()
  for (const task of tasks) {
    await api.delete(`/api/tasks/${task.id}`)
  }
  await page.goto('/')
})

test.describe('Gerenciador de Tarefas — Playwright', () => {

  test('deve exibir mensagem quando nao ha tarefas', async ({ page }) => {
    await expect(page.locator('[data-test="empty-message"]')).toBeVisible()
    await expect(page.locator('[data-test="empty-message"]')).toContainText('Nenhuma tarefa cadastrada')
  })

  test('deve criar uma nova tarefa', async ({ page }) => {
    await page.locator('[data-test="task-input"]').fill('Estudar Playwright')
    await page.locator('[data-test="add-button"]').click()

    await expect(page.locator('[data-test="task-item"]')).toHaveCount(1)
    await expect(page.locator('[data-test="task-title"]')).toContainText('Estudar Playwright')
    await expect(page.locator('[data-test="task-status"]')).toContainText('Pendente')
  })

  test('nao deve criar tarefa com titulo vazio', async ({ page }) => {
    await page.locator('[data-test="add-button"]').click()
    await expect(page.locator('[data-test="empty-message"]')).toBeVisible()
  })

  test('deve alterar status da tarefa', async ({ page }) => {
    await page.locator('[data-test="task-input"]').fill('Tarefa de teste')
    await page.locator('[data-test="add-button"]').click()

    // Pendente → Em andamento
    await page.locator('[data-test="task-status"]').click()
    await expect(page.locator('[data-test="task-status"]')).toContainText('Em andamento')

    // Em andamento → Concluida
    await page.locator('[data-test="task-status"]').click()
    await expect(page.locator('[data-test="task-status"]')).toContainText('Concluida')
  })

  test('deve deletar uma tarefa', async ({ page }) => {
    await page.locator('[data-test="task-input"]').fill('Tarefa pra deletar')
    await page.locator('[data-test="add-button"]').click()
    await expect(page.locator('[data-test="task-item"]')).toHaveCount(1)

    await page.locator('[data-test="task-delete"]').click()
    await expect(page.locator('[data-test="empty-message"]')).toBeVisible()
  })

  test('deve atualizar contadores', async ({ page }) => {
    await page.locator('[data-test="task-input"]').fill('Tarefa 1')
    await page.locator('[data-test="add-button"]').click()
    await expect(page.locator('[data-test="task-item"]')).toHaveCount(1)

    await page.locator('[data-test="task-input"]').fill('Tarefa 2')
    await page.locator('[data-test="add-button"]').click()
    await expect(page.locator('[data-test="task-item"]')).toHaveCount(2)

    await expect(page.locator('[data-test="stat-total"]')).toHaveText('2')
    await expect(page.locator('[data-test="stat-pendentes"]')).toHaveText('2')

    // Conclui primeira (2 cliques: pendente → andamento → concluida)
    await page.locator('[data-test="task-status"]').first().click()
    await expect(page.locator('[data-test="task-status"]').first()).toContainText('Em andamento')
    await page.locator('[data-test="task-status"]').first().click()
    await expect(page.locator('[data-test="task-status"]').first()).toContainText('Concluida')

    await expect(page.locator('[data-test="stat-concluidas"]')).toHaveText('1')
  })

  test('deve criar tarefa com Enter', async ({ page }) => {
    await page.locator('[data-test="task-input"]').fill('Tarefa via Enter')
    await page.locator('[data-test="task-input"]').press('Enter')
    await expect(page.locator('[data-test="task-item"]')).toHaveCount(1)
  })
})
