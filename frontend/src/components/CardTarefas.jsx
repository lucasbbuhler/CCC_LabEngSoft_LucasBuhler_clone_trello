import { useState, useRef, useEffect, memo, useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import BotaoX from "./BotaoX";
import ModalTarefa from "./ModalTarefa";
import { AuthContext } from "../context/AuthContext";
import { registrarHistorico } from "../utils/historico";

function CardTarefas({
  tarefa,
  index,
  onExcluir,
  onEditar,
  concluida,
  onToggleConcluida,
  lista,
}) {
  const [editando, setEditando] = useState(false);
  const [novoTexto, setNovoTexto] = useState(tarefa.conteudo);
  const cardRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editando && cardRef.current && !cardRef.current.contains(e.target)) {
        setEditando(false);

        const textoLimpo = novoTexto.trim();

        if (textoLimpo && novoTexto !== tarefa.conteudo) {
          fetch(`http://localhost:3001/api/tarefas/${tarefa.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              titulo: textoLimpo,
              descricao: tarefa.descricao || "",
              lista_id: tarefa.lista_id,
            }),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Erro ao editar tarefa");
              registrarHistorico(tarefa.id, `Título alterado para: "${textoLimpo}"`, token);
              onEditar(textoLimpo);
            })
            .catch((err) => {
              console.error("Erro ao editar tarefa:", err);
            });
        } else {
          setNovoTexto(tarefa.conteudo);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editando, novoTexto]);

  const toggleConcluida = async (e) => {
    e.stopPropagation();

    try {
      const res = await fetch(
        `http://localhost:3001/api/tarefas/${tarefa.id}/concluir`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ concluida: !concluida }),
        }
      );

      if (!res.ok) throw new Error("Erro ao atualizar status da tarefa");

      onToggleConcluida();
    } catch (err) {
      console.error("Erro ao marcar tarefa como concluída:", err);
    }
  };

  return (
    <Draggable draggableId={String(tarefa.id)} index={index}>
      {(provided) => (
        <>
          <div
            ref={(node) => {
              cardRef.current = node;
              provided.innerRef(node);
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setMostrarModal(true)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: hover ? "#f8f9fa" : "#fcfcfc",
              border: "1px solid #e0e0e0",
              borderLeft: concluida
                ? "4px solid #28a745"
                : "4px solid transparent",
              borderRadius: "6px",
              boxShadow: hover
                ? "0 2px 6px rgba(0,0,0,0.1)"
                : "0 1px 3px rgba(0,0,0,0.05)",
              padding: "10px",
              marginBottom: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              ...provided.draggableProps.style,
            }}
          >
            <div
              onClick={toggleConcluida}
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                border: "2px solid #007bff",
                background: concluida ? "#007bff" : "transparent",
                marginRight: "10px",
                flexShrink: 0,
                cursor: "pointer",
              }}
            ></div>

            {editando ? (
              <input
                value={novoTexto}
                onChange={(e) => setNovoTexto(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  fontSize: "14px",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                style={{
                  flex: 1,
                  fontSize: "14px",
                  color: concluida ? "#888" : "#212529",
                  textDecoration: concluida ? "line-through" : "none",
                }}
              >
                {tarefa.conteudo}
              </span>
            )}

            {hover && (
              <BotaoX
                onClick={(e) => {
                  e.stopPropagation();
                  onExcluir();
                }}
                style={{ marginLeft: "8px" }}
                title="Excluir tarefa"
              />
            )}
          </div>
          {mostrarModal && (
            <ModalTarefa
              tarefa={tarefa}
              onClose={() => setMostrarModal(false)}
              onAtualizar={(tarefaAtualizada) => onEditar(tarefaAtualizada)}
            />
          )}
        </>
      )}
    </Draggable>
  );
}
export default memo(CardTarefas);
