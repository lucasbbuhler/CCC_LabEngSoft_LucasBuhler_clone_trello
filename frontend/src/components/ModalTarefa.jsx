import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ModalTarefa({ tarefa, onClose, onAtualizar }) {
  const { token } = useContext(AuthContext);
  const [descricao, setDescricao] = useState(tarefa.descricao || "");
  const [titulo, setTitulo] = useState(tarefa.conteudo || "");
  const [editandoTitulo, setEditandoTitulo] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [editandoDescricao, setEditandoDescricao] = useState(false);

  useEffect(() => {
    async function carregarComentarios() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/comentarios/tarefa/${tarefa.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setComentarios(data);
      } catch (err) {
        console.error("Erro ao carregar comentários:", err);
      }
    }

    carregarComentarios();
  }, [tarefa.id, token]);

  const salvarDescricao = async () => {
    try {
      await fetch(`http://localhost:3001/api/tarefas/${tarefa.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: tarefa.conteudo,
          descricao,
          lista_id: tarefa.lista_id,
        }),
      });
      setEditandoDescricao(false);
    } catch (err) {
      console.error("Erro ao salvar descrição:", err);
    }
  };

  const salvarTitulo = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/tarefas/${tarefa.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          descricao,
          lista_id: tarefa.lista_id,
        }),
      });
  
      if (!res.ok) throw new Error("Erro ao salvar título");
  
      const atualizado = await res.json();
      if (onAtualizar) onAtualizar(atualizado.titulo);
      setEditandoTitulo(false);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar título:", err);
    }
  };
  
  const adicionarComentario = async () => {
    if (!novoComentario.trim()) return;

    try {
      const res = await fetch("http://localhost:3001/api/comentarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          texto: novoComentario,
          tarefa_id: tarefa.id,
        }),
      });

      const novo = await res.json();
      setComentarios([...comentarios, novo]);
      setNovoComentario("");
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err);
    }
  };

  const excluirComentario = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/comentarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setComentarios((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Erro ao excluir comentário:", err);
    }
  };

  return (
    <div style={estilos.overlay}>
      <div style={estilos.modal}>
        {editandoTitulo ? (
          <div style={{ marginBottom: "12px" }}>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={{
                width: "100%",
                fontSize: "20px",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "6px",
              }}
            />
            <button onClick={salvarTitulo} style={estilos.salvar}>
              Salvar título
            </button>
          </div>
        ) : (
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "12px",
              color: "#333",
              cursor: "pointer",
            }}
            onClick={() => setEditandoTitulo(true)}
          >
            <span style={{ borderBottom: "2px dashed #03076b" }}>{titulo}</span>
          </h2>
        )}

        <label style={{ fontWeight: "bold" }}>Descrição:</label>
        {editandoDescricao ? (
          <>
            <textarea
              style={estilos.textarea}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Adicione uma descrição..."
            />
            <button onClick={salvarDescricao} style={estilos.salvar}>
              Salvar
            </button>
          </>
        ) : (
          <div
            onClick={() => setEditandoDescricao(true)}
            style={estilos.descricaoBox}
          >
            {descricao || (
              <em style={{ color: "#888" }}>
                Clique para adicionar uma descrição
              </em>
            )}
          </div>
        )}

        <hr style={{ margin: "16px 0" }} />

        <h3>Comentários</h3>
        <ul>
          {comentarios.map((c) => (
            <li key={c.id} style={estilos.comentario}>
              <div>
                <strong>{c.autor}</strong>
                <div style={{ fontSize: "13px", color: "#444" }}>{c.texto}</div>
                <small style={{ fontSize: "11px", color: "#777" }}>
                  {new Date(c.criado_em).toLocaleString()}
                </small>
              </div>
              <button
                onClick={() => excluirComentario(c.id)}
                style={estilos.botaoX}
              >
                x
              </button>
            </li>
          ))}
        </ul>

        <input
          style={estilos.input}
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && adicionarComentario()}
          placeholder="Escreva um comentário e pressione Enter"
        />

        <button onClick={onClose} style={estilos.fechar}>
          Fechar
        </button>
      </div>
    </div>
  );
}

const estilos = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    width: "95%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  descricaoBox: {
    width: "100%",
    minHeight: "60px",
    border: "1px dashed #bbb",
    borderRadius: "8px",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "16px",
    cursor: "pointer",
    background: "#f8f9fa",
  },
  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "8px",
    resize: "vertical",
  },
  salvar: {
    padding: "6px 12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "8px",
  },
  comentario: {
    background: "#f8f9fa",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "10px",
    position: "relative",
  },
  botaoX: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "transparent",
    border: "none",
    color: "#dc3545",
    fontSize: "16px",
    cursor: "pointer",
  },
  fechar: {
    marginTop: "16px",
    padding: "8px 16px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
};
