const db = require("../db");

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

exports.buscarPorUsuario = async (usuario_id) => {
  const result = await db.query(
    `SELECT DISTINCT p.*
    FROM painel p
    LEFT JOIN membros_painel m ON m.painel_id = p.id
    WHERE p.criado_por = $1 OR m.usuario_id = $1`,
    [usuario_id]
  );
  return result.rows;
};
