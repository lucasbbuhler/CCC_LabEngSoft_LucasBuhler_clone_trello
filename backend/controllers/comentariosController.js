const model = require("../models/comentariosModel");

exports.getPorTarefa = async (req, res) => {
  try {
    const comentarios = await model.listarPorTarefa(req.params.tarefa_id);
    res.json(comentarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar comentários" });
  }
};

exports.criar = async (req, res) => {
  try {
    const { tarefa_id, texto } = req.body;
    const usuario_id = req.usuario.id;

    if (!tarefa_id || !usuario_id || !texto) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
    }

    const novo = await model.inserir({ tarefa_id, usuario_id, texto });
    res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar comentário" });
  }
};

exports.remover = async (req, res) => {
  try {
    await model.remover(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao remover comentário" });
  }
};
