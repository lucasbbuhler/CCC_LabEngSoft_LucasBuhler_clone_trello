import { useState, useRef, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import BotaoX from "./BotaoX";

export default function CardTarefas({
  tarefa,
  index,
  onExcluir,
  onEditar,
  concluida,
  onToggleConcluida,
}) {
  const [editando, setEditando] = useState(false);
  const [novoTexto, setNovoTexto] = useState(tarefa.conteudo);
  const cardRef = useRef(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editando && cardRef.current && !cardRef.current.contains(e.target)) {
        setEditando(false);
        if (novoTexto.trim() && novoTexto !== tarefa.conteudo) {
          onEditar(novoTexto);
        } else {
          setNovoTexto(tarefa.conteudo);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editando, novoTexto]);

  const toggleConcluida = (e) => {
    e.stopPropagation();
    onToggleConcluida();
  };

  return (
    <Draggable draggableId={tarefa.id} index={index}>
      {(provided) => (
        <div
          ref={(node) => {
            cardRef.current = node;
            provided.innerRef(node);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setEditando(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: hover ? "#f8f9fa" : "#fcfcfc",
            border: "1px solid #e0e0e0",
            borderLeft: concluida ? "4px solid #28a745" : "4px solid transparent",
            borderRadius: "6px",
            boxShadow: hover ? "0 2px 6px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.05)",
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
      )}
    </Draggable>
  );
}