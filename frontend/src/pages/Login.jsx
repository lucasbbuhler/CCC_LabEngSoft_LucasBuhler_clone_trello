import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erro || "Erro ao fazer login");
      }

      const data = await res.json();
      login(data.usuario, data.token);
      navigate("/");
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
          maxWidth: "400px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontWeight: "bold", color: "#333" }}>
          <span style={{ borderBottom: "3px solid #03076b" }}>
            Faça o seu login
          </span>
        </h2>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              htmlFor="email"
              style={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Seu e-mail*
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
            <label
              htmlFor="senha"
              style={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Sua senha*
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
            ENTRAR
          </button>

          {erro && (
            <div
              style={{ color: "red", fontSize: "13px", marginTop: "0.5rem" }}
            >
              {erro}
            </div>
          )}
        </form>

        <p style={{ textAlign: "center", fontSize: "14px" }}>
          <a
            href="/esqueci-senha"
            style={{
              color: "#007bff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Esqueceu a senha?
          </a>
        </p>

        <p style={{ marginTop: "1rem", fontSize: "14px", textAlign: "center" }}>
          Ainda não tem conta?{" "}
          <a
            href="/register"
            style={{
              color: "#007bff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Registre-se aqui!
          </a>
        </p>
      </div>
    </div>
  );
}
