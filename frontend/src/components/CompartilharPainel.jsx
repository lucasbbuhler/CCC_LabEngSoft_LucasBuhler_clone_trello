import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function CompartilharPainel({ painelId, onFechar }) {
  const { token } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [papel, setPapel] = useState("membro");
  const [membros, setMembros] = useState([]);
  const [isCriador, setIsCriador] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
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

        const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
        const membroAtual = dados.find((m) => m.email === usuarioLocal.email);
    
        if (membroAtual && membroAtual.papel === "editor") {
          setIsEditor(true);
        } else {
          setIsEditor(false);
        }
        
      } catch (err) {
        console.error("Erro ao carregar membros:", err);
      }
    }

    async function verificarSeCriador() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/painel/${painelId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const texto = await res.text();
        try {
          const dados = JSON.parse(texto);
          const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
          const ehCriador =
            usuarioLocal && dados.criado_por === usuarioLocal.id;
          setIsCriador(ehCriador);
        } catch (jsonErr) {
          console.error("Resposta inválida:", texto);
          setIsCriador(false);
        }
      } catch (err) {
        console.error("Erro ao verificar criador:", err);
        setIsCriador(false);
      }
    }

    carregarMembros();
    verificarSeCriador();
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
          papel: papel,
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

  const atualizarPapel = async (usuarioId, novoPapel) => {
    try {
      const res = await fetch("http://localhost:3001/api/membros", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          painel_id: painelId,
          papel: novoPapel,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar papel");

      setMembros((m) =>
        m.map((membro) =>
          membro.usuario_id === usuarioId
            ? { ...membro, papel: novoPapel }
            : membro
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar papel:", err);
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

      {(isCriador || isEditor) && (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="email">E-mail do usuário</label>
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

          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="papel">Papel</label>
            <select
              id="papel"
              value={papel}
              onChange={(e) => setPapel(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "6px",
              }}
            >
              <option value="membro">Membro</option>
              <option value="editor">Editor</option>
            </select>
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
            <div
              style={{ color: "red", fontSize: "13px", marginBottom: "1rem" }}
            >
              {erro}
            </div>
          )}
        </>
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
            <span>
              {m.email}{" "}
              <span
                style={{ fontSize: "12px", color: "#555", marginLeft: "6px" }}
              >
                ({m.papel})
              </span>
            </span>
            {isCriador && (
              <select
                value={m.papel}
                onChange={(e) => atualizarPapel(m.usuario_id, e.target.value)}
                style={{
                  borderRadius: "6px",
                  padding: "4px",
                  fontSize: "12px",
                  marginLeft: "10px",
                }}
              >
                <option value="membro">Membro</option>
                <option value="editor">Editor</option>
              </select>
            )}

            {isCriador && (
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
            )}
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
