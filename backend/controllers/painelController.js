const model = require("../models/painelModel");
const membrosModel = require("../models/membrosPainelModel");


exports.getPorId = async (req, res) => {
  try {
    const painel = await model.buscarPorId(req.params.id);
    if (!painel) return res.status(404).json({ erro: "Painel não encontrado" });
    res.json(painel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar painel" });
  }
};

exports.criar = async (req, res) => {
  try {
    const { titulo, descricao, publico } = req.body;
    const criado_por = req.usuario.id;

    if (!titulo || criado_por === undefined) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
    }

    const novo = await model.inserir({
      titulo,
      descricao,
      publico,
      criado_por,
    });

    exports.criar = async (req, res) => {
      try {
        const { titulo, descricao, publico } = req.body;
        const criado_por = req.usuario.id;
    
        if (!titulo || criado_por === undefined) {
          return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
        }
    
        const novo = await model.inserir({
          titulo,
          descricao,
          publico,
          criado_por,
        });
    
        await membrosModel.adicionar({
          usuario_id: criado_por,
          painel_id: novo.id,
          papel: "admin",
        });
    
        res.status(201).json(novo);
      } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao criar painel" });
      }
    };
    
    res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar painel" });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { titulo, descricao, publico } = req.body;
    const atualizado = await model.atualizar(req.params.id, {
      titulo,
      descricao,
      publico,
    });
    if (!atualizado)
      return res.status(404).json({ erro: "Painel não encontrado" });
    res.json(atualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar painel" });
  }
};

exports.remover = async (req, res) => {
  try {
    await model.remover(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao remover painel" });
  }
};

exports.listarPorUsuario = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const painel = await model.buscarPorUsuario(usuario_id);
    res.json(painel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar painéis do usuário" });
  }
};
