import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro("");

    if (!nome || !email || !senha || !confirmarSenha) {
      return setErro("Todos os campos são obrigatórios.");
    }

    if (senha !== confirmarSenha) {
      return setErro("As senhas não coincidem.");
    }

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erro || "Erro ao cadastrar");
      }

      navigate("/login");
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f9f9f9 50%, #03076b 50%)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2.5rem",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontWeight: "bold", color: "#333" }}>
          <span style={{ borderBottom: "3px solid #03076b" }}>
            Crie sua conta
          </span>
        </h2>

        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label htmlFor="nome" style={{ fontWeight: "bold", fontSize: "14px" }}>
              Nome completo*
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "4px",
              }}
            />
          </div>

          <div>
            <label htmlFor="email" style={{ fontWeight: "bold", fontSize: "14px" }}>
              E-mail*
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "4px",
              }}
            />
          </div>

          <div>
            <label htmlFor="senha" style={{ fontWeight: "bold", fontSize: "14px" }}>
              Senha*
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "4px",
              }}
            />
          </div>

          <div>
            <label htmlFor="confirmar" style={{ fontWeight: "bold", fontSize: "14px" }}>
              Confirmar senha*
            </label>
            <input
              id="confirmar"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "4px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px",
              border: "none",
              borderRadius: "999px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            CADASTRAR
          </button>

          {erro && (
            <div style={{ color: "red", fontSize: "13px", marginTop: "0.5rem" }}>
              {erro}
            </div>
          )}
        </form>

        <p style={{ marginTop: "1rem", fontSize: "14px", textAlign: "center" }}>
          Já tem uma conta?{" "}
          <Link
            to="/login"
            style={{
              color: "#007bff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
