const model = require("../models/membrosPainelModel");
const db = require("../db");

exports.listarMembros = async (req, res) => {
  try {
    const membros = await model.listarPorPainel(req.params.painel_id);
    res.json(membros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar membros" });
  }
};

exports.adicionarMembro = async (req, res) => {
  try {
    const { usuario_id, painel_id, papel } = req.body;

    if (!usuario_id || !painel_id || !papel) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
    }

    const result = await db.query("SELECT * FROM painel WHERE id = $1", [painel_id]);
    const painel = result.rows[0];

    if (!painel) {
      return res.status(404).json({ erro: "Painel não encontrado" });
    }

    if (painel.criado_por !== req.usuario.id) {
      return res.status(403).json({ erro: "Apenas o criador pode adicionar membros." });
    }

    const novo = await model.adicionar({ usuario_id, painel_id, papel });
    res.status(201).json(novo);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao adicionar membro" });
  }
};

exports.removerMembro = async (req, res) => {
  try {
    const { usuario_id, painel_id } = req.params;

    const result = await db.query("SELECT * FROM painel WHERE id = $1", [painel_id]);
    const painel = result.rows[0];
    if (!painel || painel.criado_por !== req.usuario.id) {
      return res.status(403).json({ erro: "Apenas o criador pode remover membros." });
    }

    await model.remover(usuario_id, painel_id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao remover membro" });
  }
};

exports.atualizarPapel = async (req, res) => {
  try {
    const { usuario_id, painel_id, papel } = req.body;

    if (!usuario_id || !painel_id || !papel) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
    }

    const resultPainel = await db.query("SELECT * FROM painel WHERE id = $1", [painel_id]);
    const painel = resultPainel.rows[0];
    if (!painel || painel.criado_por !== req.usuario.id) {
      return res.status(403).json({ erro: "Apenas o criador pode alterar o papel de membros." });
    }

    const result = await db.query(
      "UPDATE membros_painel SET papel = $1 WHERE usuario_id = $2 AND painel_id = $3 RETURNING *",
      [papel, usuario_id, painel_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: "Membro não encontrado." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar papel." });
  }
};