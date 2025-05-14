import { useState } from "react";
import Botao from "./Botao";

export default function NovoPainel({ onAdicionar }) {
  const [titulo, setTitulo] = useState("");
  const [erro, setErro] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (titulo.trim()) {
      onAdicionar(titulo);
      setTitulo("");
      setErro(false);
    } else {
      setErro(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Nome do novo painel"
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "14px",
          marginRight: "0.5rem",
          width: "250px"
        }}
      />
      <Botao type="submit">Criar painel</Botao>
      {erro && (
        <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          O nome do painel não pode estar vazio.
        </div>
      )}
    </form>
  );
}