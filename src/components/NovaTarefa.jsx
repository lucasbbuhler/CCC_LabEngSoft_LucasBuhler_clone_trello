import { useState } from "react";

export default function NovaTarefa({ onAdicionar }) {
  const [texto, setTexto] = useState("");

  const adicionar = () => {
    if (texto.trim()) {
      onAdicionar({
        id: `tarefa-${Date.now()}`,
        conteudo: texto,
        concluida: false,
      });
      setTexto("");
    }
  };

  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Nova tarefa..."
        onKeyDown={(e) => e.key === "Enter" && adicionar()}
        style={{
          flex: 1,
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      />
      <button
        onClick={adicionar}
        style={{
          padding: "6px 10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Adicionar
      </button>
    </div>
  );
}
