const db = require("../db");

exports.buscarTodas = async () => {
  const result = await db.query(
    "SELECT * FROM tarefas ORDER BY criado_em DESC"
  );
  return result.rows;
};

exports.inserir = async ({ titulo, descricao, lista_id, criado_por }) => {
  const result = await db.query(
    "INSERT INTO tarefas (titulo, descricao, lista_id, criado_por) VALUES ($1, $2, $3, $4) RETURNING *",
    [titulo, descricao, lista_id, criado_por]
  );
  return result.rows[0];
};

exports.buscarPorId = async (id) => {
  const result = await db.query("SELECT * FROM tarefas WHERE id = $1", [id]);
  return result.rows[0];
};

exports.atualizar = async (id, campos ) => {
  const atual = await exports.buscarPorId(id);
  if (!atual) return null;

  const titulo = campos.titulo ?? atual.titulo;
  const descricao = campos.descricao ?? atual.descricao;
  const lista_id = campos.lista_id ?? atual.lista_id;

  const result = await db.query(
    "UPDATE tarefas SET titulo = $1, descricao = $2, lista_id = $3 WHERE id = $4 RETURNING *",
    [titulo, descricao, lista_id, id]
  );
  return result.rows[0];
};

exports.marcarConcluida = async (id, status) => {
  const result = await db.query(
    "UPDATE tarefas SET concluida = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
};

exports.remover = async (id) => {
  await db.query("DELETE FROM tarefas WHERE id = $1", [id]);
};
