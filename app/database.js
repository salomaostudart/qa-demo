// Banco de dados SQLite — equivalente simplificado do PostgreSQL
// Em producao, trocar por pg (node-postgres) + PostgreSQL
const Database = require('better-sqlite3')
const path = require('path')

const dbPath = process.env.DB_PATH || path.join(__dirname, 'tasks.db')
const db = new Database(dbPath)

// Cria a tabela se nao existir (mesmo SQL funciona no PostgreSQL)
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'em_andamento', 'concluida')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

module.exports = db
