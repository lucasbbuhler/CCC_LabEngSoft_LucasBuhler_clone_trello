const model = require("../models/listasModel");
const { verificarPermissao } = require("../utils/permissoes");

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
    if (!titulo || !painel_id) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
    }
    const temPermissao = await verificarPermissao(painel_id, req.usuario.id, [
      "admin",
      "editor",
    ]);
    if (!temPermissao) {
      return res.status(403).json({
        erro: "Você não tem permissão para criar listas neste painel.",
      });
    }

    const nova = await model.inserir({ titulo, painel_id, posicao: 0 });
    res.status(201).json(nova);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar lista" });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const lista = await model.buscarPorId(req.params.id);
    if (!lista) return res.status(404).json({ erro: "Lista não encontrada" });

    const temPermissao = await verificarPermissao(
      lista.painel_id,
      req.usuario.id,
      ["admin", "editor"]
    );
    if (!temPermissao) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para editar esta lista." });
    }

    const { titulo } = req.body;
    const atualizada = await model.atualizar(req.params.id, { titulo });
    res.json(atualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar lista" });
  }
};

exports.remover = async (req, res) => {
  try {
    const lista = await model.buscarPorId(req.params.id);
    if (!lista) return res.status(404).json({ erro: "Lista não encontrada" });

    const temPermissao = await verificarPermissao(
      lista.painel_id,
      req.usuario.id,
      ["admin", "editor"]
    );
    if (!temPermissao) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para remover esta lista." });
    }

    await model.remover(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    if (err.code === "23503") {
      return res.status(400).json({
        erro: "A lista não pode ser excluída porque ainda possui tarefas vinculadas.",
      });
    }
    res.status(500).json({ erro: "Erro ao remover lista" });
  }
};

exports.atualizarPosicao = async (req, res) => {
  try {
    const lista = await model.buscarPorId(req.params.id);
    if (!lista) return res.status(404).json({ erro: "Lista não encontrada" });

    const temPermissao = await verificarPermissao(
      lista.painel_id,
      req.usuario.id,
      ["admin", "editor"]
    );
    if (!temPermissao) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para reordenar esta lista." });
    }

    const { posicao } = req.body;
    if (typeof posicao !== "number") {
      return res.status(400).json({ erro: "A posição deve ser um número." });
    }

    const atualizada = await model.atualizarPosicao(req.params.id, posicao);
    res.json(atualizada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar posição da lista." });
  }
};
