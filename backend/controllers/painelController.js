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

    const painelAtual = await model.buscarPorId(req.params.id);
    if (!painelAtual)
      return res.status(404).json({ erro: "Painel não encontrado" });

    const novoTitulo = titulo ?? painelAtual.titulo;
    const novaDescricao = descricao ?? painelAtual.descricao;
    const novoPublico = publico ?? painelAtual.publico;

    const atualizado = await model.atualizar(req.params.id, {
      titulo: novoTitulo,
      descricao: novaDescricao,
      publico: novoPublico,
    });

    res.json(atualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar painel" });
  }
};

exports.remover = async (req, res) => {
  const { id } = req.params;
  try {
    await model.remover(id);
    res.status(204).send();
  } catch (err) {
    if (err.code === "23503") {
      return res.status(400).json({
        erro: "O painel não pode ser excluído porque ainda possui membros, listas ou tarefas vinculadas.",
      });
    }
    console.error("Erro ao excluir painel:", err);
    res.status(500).json({ erro: "Erro ao excluir painel." });
  }
};

exports.listarPorUsuario = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const paineis = await model.buscarPorUsuario(usuario_id);
    res.json(paineis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar painéis do usuário" });
  }
};
