import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Botao from "./Botao";

export default function NovoPainel({ onAdicionar, painelId }) {
  const [titulo, setTitulo] = useState("");
  const [erro, setErro] = useState(false);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErro(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/listas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          painel_id: Number(painelId),
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar lista");

      const nova = await res.json();

      onAdicionar({
        id: String(nova.id),
        titulo: nova.titulo,
        tarefas: [],
      });

      setTitulo("");
      setErro(false);
    } catch (err) {
      console.error("Erro ao criar lista:", err);
      setErro(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Nome da nova lista"
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "14px",
          marginRight: "0.5rem",
          width: "250px",
        }}
      />
      <Botao type="submit">Criar Lista</Botao>
      {erro && (
        <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          O nome da lista não pode estar vazio.
        </div>
      )}
    </form>
  );
}
