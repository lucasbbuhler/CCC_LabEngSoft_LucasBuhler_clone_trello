import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function HistoricoTarefa({ tarefaId }) {
  const { token } = useContext(AuthContext);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const res = await fetch(`http://localhost:3001/api/historico/tarefa/${tarefaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dados = await res.json();
        setHistorico(dados);
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      }
    }

    carregarHistorico();
  }, [tarefaId, token]);

  return (
    <div style={{ marginTop: "1rem", background: "#f1f1f1", padding: "0.5rem", borderRadius: 6 }}>
      <h4>Histórico</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {historico.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{item.autor}</strong> — {new Date(item.alterado_em).toLocaleString()}<br />
            <span>{item.descricao}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
