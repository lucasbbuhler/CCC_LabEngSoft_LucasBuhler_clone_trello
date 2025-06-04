import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function CompartilharPainel({ painelId, onFechar }) {
  const { token } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [membros, setMembros] = useState([]);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarMembros() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/membros/${painelId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dados = await res.json();
        setMembros(dados);
      } catch (err) {
        console.error("Erro ao carregar membros:", err);
      }
    }
    carregarMembros();
  }, [painelId, token]);

  const compartilhar = async () => {
    setErro("");
    try {
      const resUser = await fetch(
        `http://localhost:3001/api/usuarios/email/${email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!resUser.ok) {
        setErro("Usuário não encontrado.");
        return;
      }

      const usuario = await resUser.json();

      const res = await fetch("http://localhost:3001/api/membros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuario_id: usuario.id,
          painel_id: painelId,
          papel: "membro", // fixo por ora
        }),
      });

      if (!res.ok) throw new Error("Erro ao compartilhar");

      const novoMembro = await res.json();
      setMembros([...membros, novoMembro]);
      setEmail("");
    } catch (err) {
      setErro("Erro ao compartilhar painel.");
      console.error(err);
    }
  };

  const remover = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/membros/${id}/${painelId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembros((m) => m.filter((m) => m.usuario_id !== id));
    } catch (err) {
      console.error("Erro ao remover membro:", err);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        zIndex: 2000,
        minWidth: "360px",
      }}
    >
      <h2
        style={{
          marginBottom: "1rem",
          borderBottom: "2px solid #007bff",
          paddingBottom: "4px",
          color: "#000",
        }}
      >
        Compartilhar Painel
      </h2>

      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="email"
          style={{ fontWeight: "bold", fontSize: "14px", color: "#000" }}
        >
          E-mail do usuário
        </label>
        <input
          id="email"
          type="email"
          placeholder="Digite o e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginTop: "6px",
          }}
        />
      </div>

      <button
        onClick={compartilhar}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "10px",
          borderRadius: "999px",
          cursor: "pointer",
          width: "100%",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        Adicionar membro
      </button>

      {erro && (
        <div style={{ color: "red", fontSize: "13px", marginBottom: "1rem" }}>
          {erro}
        </div>
      )}

      <h4 style={{ marginBottom: "0.5rem", fontWeight: "bold", color: "#000" }}>
        Membros atuais
      </h4>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          maxHeight: "180px",
          overflowY: "auto",
          color: "#000",
        }}
      >
        {membros.map((m) => (
          <li
            key={m.usuario_id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "6px 0",
              borderBottom: "1px solid #eee",
              color: "#000",
            }}
          >
            <span>{m.nome || m.email}</span>
            <button
              onClick={() => {
                remover(m.usuario_id);
                navigate("/");
              }}
              style={{
                background: "transparent",
                color: "red",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              remover
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={onFechar}
        style={{
          marginTop: "1.5rem",
          background: "#ddd",
          border: "none",
          borderRadius: "8px",
          padding: "10px",
          cursor: "pointer",
          width: "100%",
          fontWeight: "bold",
        }}
      >
        Fechar
      </button>
    </div>
  );
}
