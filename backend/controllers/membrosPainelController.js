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
    await model.remover(usuario_id, painel_id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao remover membro" });
  }
};