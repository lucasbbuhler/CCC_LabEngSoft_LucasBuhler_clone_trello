const db = require("../db");

exports.buscarTodos = async () => {
  const result = await db.query("SELECT * FROM painel ORDER BY id");
  return result.rows;
};

exports.buscarPorId = async (id) => {
  const result = await db.query("SELECT * FROM painel WHERE id = $1", [id]);
  return result.rows[0];
};

exports.inserir = async ({ titulo, descricao, publico, criado_por }) => {
  const result = await db.query(
    "INSERT INTO painel (titulo, descricao, publico, criado_por) VALUES ($1, $2, $3, $4) RETURNING *",
    [titulo, descricao, publico, criado_por]
  );
  return result.rows[0];
};

exports.atualizar = async (id, { titulo, descricao, publico }) => {
  const result = await db.query(
    "UPDATE painel SET titulo = $1, descricao = $2, publico = $3 WHERE id = $4 RETURNING *",
    [titulo, descricao, publico, id]
  );
  return result.rows[0];
};

exports.remover = async (id) => {
  await db.query("DELETE FROM painel WHERE id = $1", [id]);
};
