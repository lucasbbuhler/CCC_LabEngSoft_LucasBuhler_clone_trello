const db = require("../db");

exports.buscarTodas = async () => {
  const result = await db.query("SELECT * FROM listas ORDER BY id");
  return result.rows;
};

exports.buscarPorId = async (id) => {
  const result = await db.query("SELECT * FROM listas WHERE id = $1", [id]);
  return result.rows[0];
};

exports.buscarPorPainel = async (painel_id) => {
  const result = await db.query("SELECT * FROM listas WHERE painel_id = $1 ORDER BY posicao ASC", [painel_id]);
  return result.rows;
};

exports.inserir = async ({ titulo, painel_id, posicao = 0 }) => {
  const result = await db.query(
    "INSERT INTO listas (titulo, painel_id, posicao) VALUES ($1, $2, $3) RETURNING *",
    [titulo, painel_id, posicao]
  );
  return result.rows[0];
};

exports.atualizar = async (id, { titulo }) => {
  const result = await db.query(
    "UPDATE listas SET titulo = $1 WHERE id = $2 RETURNING *",
    [titulo, id]
  );
  return result.rows[0];
};

exports.remover = async (id) => {
  await db.query("DELETE FROM listas WHERE id = $1", [id]);
};

exports.atualizarPosicao = async (id, novaPosicao) => {
  const result = await db.query(
    "UPDATE listas SET posicao = $1 WHERE id = $2 RETURNING *",
    [novaPosicao, id]
  );
  return result.rows[0];
};
