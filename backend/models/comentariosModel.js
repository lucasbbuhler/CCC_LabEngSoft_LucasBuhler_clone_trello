const db = require("../db");

exports.listarPorTarefa = async (tarefa_id) => {
  const result = await db.query(
    `SELECT c.id, c.texto, c.criado_em, u.nome AS autor
     FROM comentarios c
     JOIN usuarios u ON u.id = c.usuario_id
     WHERE c.tarefa_id = $1
     ORDER BY c.criado_em DESC`,
    [tarefa_id]
  );
  return result.rows;
};

exports.inserir = async ({ tarefa_id, usuario_id, texto }) => {
  const result = await db.query(
    "INSERT INTO comentarios (tarefa_id, usuario_id, texto) VALUES ($1, $2, $3) RETURNING *",
    [tarefa_id, usuario_id, texto]
  );
  return result.rows[0];
};

exports.remover = async (id) => {
  await db.query("DELETE FROM comentarios WHERE id = $1", [id]);
};
