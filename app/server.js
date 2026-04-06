const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require('./database')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// ==================== API REST ====================

// GET /api/tasks — listar todas as tarefas
app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all()
  res.json(tasks)
})

// GET /api/tasks/:id — buscar tarefa por ID
app.get('/api/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)
  if (!task) return res.status(404).json({ error: 'Tarefa nao encontrada' })
  res.json(task)
})

// POST /api/tasks — criar nova tarefa
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Titulo e obrigatorio' })
  }
  const result = db.prepare(
    'INSERT INTO tasks (title, description) VALUES (?, ?)'
  ).run(title.trim(), (description || '').trim())
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(task)
})

// PUT /api/tasks/:id — atualizar tarefa
app.put('/api/tasks/:id', (req, res) => {
  const { title, description, status } = req.body
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Tarefa nao encontrada' })

  db.prepare(`
    UPDATE tasks SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      status = COALESCE(?, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title || null, description || null, status || null, req.params.id)

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)
  res.json(task)
})

// DELETE /api/tasks/:id — remover tarefa
app.delete('/api/tasks/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Tarefa nao encontrada' })
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id)
  res.json({ message: 'Tarefa removida' })
})

// ==================== SERVIDOR ====================

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})

module.exports = { app, server }
