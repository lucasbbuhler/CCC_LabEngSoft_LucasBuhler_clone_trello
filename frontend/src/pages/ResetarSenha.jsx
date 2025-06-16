import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Botao from "../components/Botao"; // ajuste se necessário

export default function ResetarSenha() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/resetar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.erro || "Erro ao redefinir senha");
      }

      setMensagem("Senha redefinida com sucesso! Redirecionando...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
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
            Redefinir Senha
          </span>
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              htmlFor="novaSenha"
              style={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Nova senha*
            </label>
            <input
              id="novaSenha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "4px",
              }}
            />
          </div>

          <Botao type="submit" loading={carregando}>
            Redefinir
          </Botao>

          {mensagem && (
            <div style={{ color: "green", fontSize: "13px" }}>{mensagem}</div>
          )}
          {erro && (
            <div style={{ color: "red", fontSize: "13px" }}>{erro}</div>
          )}
        </form>
      </div>
    </div>
  );
}
