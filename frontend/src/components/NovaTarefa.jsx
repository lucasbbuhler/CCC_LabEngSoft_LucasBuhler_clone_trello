import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Botao from "./Botao";

export default function NovaTarefa({ onAdicionar, listaId }) {
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState(false);
  const { token } = useContext(AuthContext);

  const adicionar = async () => {
    if (texto.trim()) {
      try {
        const res = await fetch("http://localhost:3001/api/tarefas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo: texto,
            descricao: "",
            lista_id: listaId,
          }),
        });

        if (!res.ok) {
          throw new Error("Erro ao criar tarefa");
        }

        const nova = await res.json();

        onAdicionar({
          id: String(nova.id),
          conteudo: nova.titulo,
          concluida: nova.concluida,
        });

        setTexto("");
        setErro(false);
      } catch (err) {
        console.error("Erro ao criar tarefa:", err);
        setErro(true);
      }
    } else {
      setErro(true);
    }
  };

  return (
    <div>
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
        <Botao onClick={adicionar}>Adicionar</Botao>
      </div>
      {erro && (
        <div style={{ color: "red", fontSize: "12px" }}>
         Não é possivel incluir a tarefa.
        </div>
      )}
    </div>
  );
}
