const db = require("../db");

exports.buscarTodos = async () => {
  const result = await db.query(
    "SELECT id, nome, email FROM usuarios ORDER BY id"
  );
  return result.rows;
};

exports.inserir = async ({ nome, email, senha_hash }) => {
  const result = await db.query(
    "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email",
    [nome, email, senha_hash]
  );
  return result.rows[0];
};

exports.buscarPorId = async (id) => {
  const result = await db.query(
    "SELECT id, nome, email FROM usuarios WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

exports.atualizar = async (id, { nome, email, senha_hash }) => {
  const result = await db.query(
    "UPDATE usuarios SET nome = $1, email = $2, senha_hash = $3 WHERE id = $4 RETURNING id, nome, email",
    [nome, email, senha_hash, id]
  );
  return result.rows[0];
};

exports.remover = async (id) => {
  await db.query("DELETE FROM usuarios WHERE id = $1", [id]);
};
