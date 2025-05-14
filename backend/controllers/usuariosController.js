const model = require("../models/usuariosModel");

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await model.buscarTodos();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
};

exports.getUsuarioPorId = async (req, res) => {
  try {
    const usuario = await model.buscarPorId(req.params.id);
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
};

exports.atualizarUsuario = async (req, res) => {
  try {
    const { nome, email, senha_hash } = req.body;
    const atualizado = await model.atualizar(req.params.id, {
      nome,
      email,
      senha_hash,
    });
    if (!atualizado)
      return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json(atualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar usuário" });
  }
};

exports.deletarUsuario = async (req, res) => {
  try {
    await model.remover(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao remover usuário" });
  }
};
