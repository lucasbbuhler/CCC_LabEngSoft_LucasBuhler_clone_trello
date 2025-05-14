const db = require("../db");

exports.listarPorTarefa = async (tarefa_id) => {
  const result = await db.query(
    `SELECT h.id, h.descricao, h.alterado_em, u.nome AS autor
     FROM historico h
     JOIN usuarios u ON u.id = h.usuario_id
     WHERE h.tarefa_id = $1
     ORDER BY h.alterado_em DESC`,
    [tarefa_id]
  );
  return result.rows;
};

exports.inserir = async ({ tarefa_id, usuario_id, descricao }) => {
  const result = await db.query(
    "INSERT INTO historico (tarefa_id, usuario_id, descricao) VALUES ($1, $2, $3) RETURNING *",
    [tarefa_id, usuario_id, descricao]
  );
  return result.rows[0];
};
