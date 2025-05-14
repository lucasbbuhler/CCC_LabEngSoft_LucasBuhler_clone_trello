const db = require("../db");

exports.listarPorTarefa = async (tarefa_id) => {
  const result = await db.query(
    "SELECT * FROM anexos WHERE tarefa_id = $1 ORDER BY enviado_em DESC",
    [tarefa_id]
  );
  return result.rows;
};

exports.inserir = async ({ tarefa_id, nome_arquivo, url, tamanho, usuario_id }) => {
  const result = await db.query(
    "INSERT INTO anexos (tarefa_id, nome_arquivo, url, tamanho, usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [tarefa_id, nome_arquivo, url, tamanho, usuario_id]
  );
  return result.rows[0];
};

exports.remover = async (id) => {
  await db.query("DELETE FROM anexos WHERE id = $1", [id]);
};
