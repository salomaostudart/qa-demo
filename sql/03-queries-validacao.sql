-- Queries de validacao — o QA roda isso pra verificar o estado do banco
-- Compativel com PostgreSQL e SQLite

-- 1. Contagem total de tarefas
SELECT COUNT(*) AS total_tarefas FROM tasks;

-- 2. Contagem por status
SELECT status, COUNT(*) AS quantidade
FROM tasks
GROUP BY status
ORDER BY quantidade DESC;

-- 3. Tarefas pendentes (as que precisam de atencao)
SELECT id, title, created_at
FROM tasks
WHERE status = 'pendente'
ORDER BY created_at ASC;

-- 4. Tarefas concluidas hoje
SELECT id, title, updated_at
FROM tasks
WHERE status = 'concluida'
  AND DATE(updated_at) = DATE('now');

-- 5. Verificar integridade: tarefas sem titulo (nao deveria existir)
SELECT id, title, status
FROM tasks
WHERE title IS NULL OR title = '';

-- 6. Verificar status invalido (nao deveria existir por causa do CHECK)
SELECT id, title, status
FROM tasks
WHERE status NOT IN ('pendente', 'em_andamento', 'concluida');

-- 7. Tarefas criadas nos ultimos 7 dias
SELECT id, title, status, created_at
FROM tasks
WHERE created_at >= DATE('now', '-7 days')
ORDER BY created_at DESC;

-- 8. Tempo medio entre criacao e conclusao
SELECT AVG(
  JULIANDAY(updated_at) - JULIANDAY(created_at)
) AS dias_medio_conclusao
FROM tasks
WHERE status = 'concluida';
