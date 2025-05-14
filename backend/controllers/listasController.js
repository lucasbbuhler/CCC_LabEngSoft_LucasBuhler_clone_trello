const model = require("../models/listasModel");

exports.getTodas = async (req, res) => {
  try {
    const listas = await model.buscarTodas();
    res.json(listas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar listas" });
  }
};

exports.getPorId = async (req, res) => {
  try {
    const lista = await model.buscarPorId(req.params.id);
    if (!lista) return res.status(404).json({ erro: "Lista não encontrada" });
    res.json(lista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar lista" });
  }
};

exports.getPorPainel = async (req, res) => {
  try {
    const listas = await model.buscarPorPainel(req.params.painel_id);
    res.json(listas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar listas do painel" });
  }
};

exports.criar = async (req, res) => {
  try {
    const { titulo, painel_id } = req.body;
    const criado_por = req.usuario.id;
    if (!titulo || !painel_id) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
    }
    const nova = await model.inserir({ titulo, painel_id });
    res.status(201).json(nova);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar lista" });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { titulo } = req.body;
    const atualizada = await model.atualizar(req.params.id, { titulo });
    if (!atualizada) return res.status(404).json({ erro: "Lista não encontrada" });
    res.json(atualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar lista" });
  }
};

exports.remover = async (req, res) => {
  try {
    await model.remover(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao remover lista" });
  }
};
