const model = require("../models/historicoModel");

exports.getPorTarefa = async (req, res) => {
  try {
    const registros = await model.listarPorTarefa(req.params.tarefa_id);
    res.json(registros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar histórico" });
  }
};

exports.criar = async (req, res) => {
  try {
    const { tarefa_id, descricao } = req.body;
    const usuario_id = req.usuario.id;

    if (!tarefa_id || !usuario_id || !descricao) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
    }

    const novo = await model.inserir({ tarefa_id, usuario_id, descricao });
    res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar registro de histórico" });
  }
};
