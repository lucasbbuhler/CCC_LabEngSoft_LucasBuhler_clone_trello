import { useState } from "react";
import Botao from "./Botao";

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
      <Botao onClick={adicionar}>
          Adicionar
      </Botao>
      </div>
      {erro && (
        <div style={{ color: "red", fontSize: "12px" }}>
          O nome do painel não pode estar vazio.
        </div>
      )}
    </div>
  );
}
