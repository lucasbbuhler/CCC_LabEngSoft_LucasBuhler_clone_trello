const model = require("../models/anexosModel");

exports.getPorTarefa = async (req, res) => {
  try {
    const anexos = await model.listarPorTarefa(req.params.tarefa_id);
    res.json(anexos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar anexos" });
  }
};

exports.criar = async (req, res) => {
  try {
    const { tarefa_id, nome_arquivo, url, tamanho } = req.body;
    const usuario_id = req.usuario.id;

    if (!tarefa_id || !nome_arquivo || !url || !usuario_id) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
    }

    const novo = await model.inserir({ tarefa_id, nome_arquivo, url, tamanho, usuario_id });
    res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar anexo" });
  }
};

exports.remover = async (req, res) => {
  try {
    await model.remover(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao remover anexo" });
  }
};
