const membrosModel = require("../models/membrosPainelModel");
const painelModel = require("../models/painelModel");

async function verificarPermissao(painel_id, usuario_id, papeisPermitidos = []) {
  const painel = await painelModel.buscarPorId(painel_id);
  if (!painel) return false;

  if (painel.criado_por === usuario_id) return true;

  const membro = await membrosModel.buscarPorPainelEUsuario(painel_id, usuario_id);
  if (!membro) return false;

  return papeisPermitidos.includes(membro.papel);
}

module.exports = { verificarPermissao };
