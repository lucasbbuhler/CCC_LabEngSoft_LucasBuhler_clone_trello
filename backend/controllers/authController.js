const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendEmail");

const EXPIRACAO_TOKEN = "2h";

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  try {
    const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: EXPIRACAO_TOKEN }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no login." });
  }
};

exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ erro: "Nome, email e senha são obrigatórios." });
  }

  try {
    const existente = await db.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );
    if (existente.rows.length > 0) {
      return res.status(409).json({ erro: "E-mail já está em uso." });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const result = await db.query(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email",
      [nome, email, senha_hash]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao registrar usuário." });
  }
};

exports.recuperarSenha = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ erro: "Email é obrigatório." });
  }

  try {
    const result = await db.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const usuarioId = result.rows[0].id;
    const token = crypto.randomBytes(32).toString("hex");
    const expiraEm = new Date(Date.now() + 30 * 60 * 1000);

    await db.query(
      "INSERT INTO tokens_recuperacao (usuario_id, token, expira_em) VALUES ($1, $2, $3)",
      [usuarioId, token, expiraEm]
    );

    const link = `http://localhost:5173/resetar-senha/${token}`;

    await sendEmail(email, "Recuperação de senha", `Clique para redefinir sua senha: ${link}`);

    res.json({ mensagem: "Um link de recuperação foi enviado para o seu email." });
  } catch (err) {
    console.error("Erro ao processar recuperação de senha:", err);
    res.status(500).json({ erro: "Erro interno ao tentar recuperar a senha." });
  }
};

exports.resetarSenha = async (req, res) => {
  const { token, novaSenha } = req.body;

  if (!token || !novaSenha) {
    return res.status(400).json({ erro: "Token e nova senha são obrigatórios." });
  }

  try {
    const result = await db.query(
      "SELECT usuario_id, expira_em FROM tokens_recuperacao WHERE token = $1",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ erro: "Token inválido." });
    }

    const { usuario_id, expira_em } = result.rows[0];

    if (new Date() > new Date(expira_em)) {
      return res.status(400).json({ erro: "Token expirado." });
    }

    const senha_hash = await bcrypt.hash(novaSenha, 10);

    await db.query("UPDATE usuarios SET senha_hash = $1 WHERE id = $2", [
      senha_hash,
      usuario_id,
    ]);

    await db.query("DELETE FROM tokens_recuperacao WHERE token = $1", [token]);

    res.json({ mensagem: "Senha atualizada com sucesso." });
  } catch (err) {
    console.error("Erro ao redefinir senha:", err);
    res.status(500).json({ erro: "Erro ao redefinir senha." });
  }
};