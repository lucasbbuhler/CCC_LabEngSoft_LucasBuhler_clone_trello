const model = require("../models/tarefasModel");

exports.getTarefas = async (req, res) => {
  try {
    const tarefas = await model.buscarTodas();
    res.json(tarefas);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar tarefas" });
  }
};

exports.criarTarefa = async (req, res) => {
  try {
    const { titulo, descricao, lista_id } = req.body;
    const criado_por = req.usuario.id;

    if (!titulo || !lista_id) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
    }

    const novaTarefa = await model.inserir({ titulo, descricao, lista_id, criado_por });
    res.status(201).json(novaTarefa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar tarefa" });
  }
};

exports.getTarefaPorId = async (req, res) => {
  try {
    const tarefa = await model.buscarPorId(req.params.id);
    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });
    res.json(tarefa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar tarefa" });
  }
};

exports.atualizarTarefa = async (req, res) => {
  try {
    const { titulo, descricao, lista_id } = req.body;
    const atualizada = await model.atualizar(req.params.id, { titulo, descricao, lista_id });
    if (!atualizada) return res.status(404).json({ erro: "Tarefa não encontrada" });
    res.json(atualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
};

exports.concluirTarefa = async (req, res) => {
  try {
    const { concluida } = req.body;
    const atualizada = await model.marcarConcluida(req.params.id, concluida);
    if (!atualizada) return res.status(404).json({ erro: "Tarefa não encontrada" });
    res.json(atualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar status da tarefa" });
  }
};

exports.removerTarefa = async (req, res) => {
  try {
    await model.remover(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao remover tarefa" });
  }
};
