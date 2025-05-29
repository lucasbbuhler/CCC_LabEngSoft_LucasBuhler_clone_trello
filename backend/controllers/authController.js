const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
