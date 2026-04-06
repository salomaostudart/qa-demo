-- Criacao da tabela de tarefas (PostgreSQL)
-- Este script e compativel com PostgreSQL 14+

CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT DEFAULT '',
    status      VARCHAR(20) DEFAULT 'pendente'
                CHECK (status IN ('pendente', 'em_andamento', 'concluida')),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index para buscas por status (otimizacao)
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Comentarios na tabela (boa pratica PostgreSQL)
COMMENT ON TABLE tasks IS 'Gerenciador de tarefas — QA Demo';
COMMENT ON COLUMN tasks.status IS 'pendente, em_andamento ou concluida';
