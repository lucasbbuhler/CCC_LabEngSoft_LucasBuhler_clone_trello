const model = require("../models/tarefasModel");
const listasModel = require("../models/listasModel");
const painelModel = require("../models/painelModel");
const membrosModel = require("../models/membrosPainelModel");

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
    const { titulo, descricao, lista_id, posicao = 0 } = req.body;
    const criado_por = req.usuario.id;

    if (!titulo || !lista_id) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
    }

    const novaTarefa = await model.inserir({
      titulo,
      descricao,
      lista_id,
      criado_por,
      posicao,
    });
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
    const tarefa = await model.buscarPorId(req.params.id);
    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

    const lista = await listasModel.buscarPorId(tarefa.lista_id);
    const painel = await painelModel.buscarPorId(lista.painel_id);
    const isMembro = await membrosModel.verificarMembro(
      painel.id,
      req.usuario.id
    );

    if (tarefa.criado_por !== req.usuario.id && !isMembro) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para editar esta tarefa." });
    }

    const { titulo, descricao, lista_id } = req.body;
    const atualizada = await model.atualizar(req.params.id, {
      titulo,
      descricao,
      lista_id,
    });

    res.json(atualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
};

exports.concluirTarefa = async (req, res) => {
  try {
    const tarefa = await model.buscarPorId(req.params.id);
    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

    const lista = await listasModel.buscarPorId(tarefa.lista_id);
    const painel = await painelModel.buscarPorId(lista.painel_id);
    const isMembro = await membrosModel.verificarMembro(
      painel.id,
      req.usuario.id
    );

    if (tarefa.criado_por !== req.usuario.id && !isMembro) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para alterar esta tarefa." });
    }

    const { concluida } = req.body;
    const atualizada = await model.marcarConcluida(req.params.id, concluida);
    res.json(atualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar status da tarefa" });
  }
};

exports.removerTarefa = async (req, res) => {
  try {
    const tarefa = await model.buscarPorId(req.params.id);
    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

    const lista = await listasModel.buscarPorId(tarefa.lista_id);
    const painel = await painelModel.buscarPorId(lista.painel_id);
    const isMembro = await membrosModel.verificarMembro(
      painel.id,
      req.usuario.id
    );

    if (tarefa.criado_por !== req.usuario.id && !isMembro) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para remover esta tarefa." });
    }

    await model.remover(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao remover tarefa" });
  }
};

exports.getTarefasPorLista = async (req, res) => {
  try {
    const lista_id = req.params.lista_id;
    const tarefas = await model.buscarPorLista(lista_id);
    res.json(tarefas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar tarefas da lista" });
  }
};

exports.atualizarPosicao = async (req, res) => {
  try {
    const tarefa = await model.buscarPorId(req.params.id);
    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

    const lista = await listasModel.buscarPorId(tarefa.lista_id);
    const painel = await painelModel.buscarPorId(lista.painel_id);
    const isMembro = await membrosModel.verificarMembro(
      painel.id,
      req.usuario.id
    );

    if (painel.criado_por !== req.usuario.id && !isMembro) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para reordenar esta tarefa." });
    }

    const { posicao } = req.body;
    if (typeof posicao !== "number") {
      return res.status(400).json({ erro: "A posição deve ser um número." });
    }

    const atualizada = await model.atualizarPosicao(req.params.id, posicao);
    res.json(atualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar posição da tarefa." });
  }
};
