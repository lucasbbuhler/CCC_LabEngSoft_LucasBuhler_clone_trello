const db = require("../db");

exports.listarPorPainel = async (painel_id) => {
  const result = await db.query(
    `SELECT mp.usuario_id, u.nome, u.email, mp.papel
     FROM membros_painel mp
     JOIN usuarios u ON u.id = mp.usuario_id
     WHERE mp.painel_id = $1`,
    [painel_id]
  );
  return result.rows;
};

exports.adicionar = async ({ usuario_id, painel_id, papel }) => {
  const result = await db.query(
    "INSERT INTO membros_painel (usuario_id, painel_id, papel) VALUES ($1, $2, $3) RETURNING *",
    [usuario_id, painel_id, papel]
  );
  return result.rows[0];
};

exports.remover = async (usuario_id, painel_id) => {
  await db.query(
    "DELETE FROM membros_painel WHERE usuario_id = $1 AND painel_id = $2",
    [usuario_id, painel_id]
  );
};

exports.verificarMembro = async (painel_id, usuario_id) => {
  const result = await db.query(
    "SELECT 1 FROM membros_painel WHERE painel_id = $1 AND usuario_id = $2",
    [painel_id, usuario_id]
  );
  return result.rowCount > 0;
};
