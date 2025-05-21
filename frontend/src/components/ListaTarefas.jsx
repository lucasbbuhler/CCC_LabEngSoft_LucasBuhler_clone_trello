import { Droppable } from "react-beautiful-dnd";
import CardTarefas from "./CardTarefas";
import NovaTarefa from "./NovaTarefa";
import BotaoX from "./BotaoX";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ListaTarefas({
  lista,
  listas,
  setListas,
  onExcluirLista,
}) {
  const [editandoTitulo, setEditandoTitulo] = useState(false);
  const { token } = useContext(AuthContext);
  const [novoTitulo, setNovoTitulo] = useState(lista.titulo);


  const adicionarTarefa = (tarefa) => {
    const novaTarefa = {
      ...tarefa,
      concluida: tarefa.concluida ?? false,
    };

    const novasListas = listas.map((l) =>
      l.id === lista.id ? { ...l, tarefas: [...l.tarefas, novaTarefa] } : l
    );

    setListas(novasListas);
  };

  const excluirTarefa = async (tarefaId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/tarefas/${tarefaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao excluir tarefa");

      const novasListas = listas.map((l) =>
        l.id === lista.id
          ? { ...l, tarefas: l.tarefas.filter((t) => t.id !== tarefaId) }
          : l
      );
      setListas(novasListas);
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
    }
  };

  const editarTarefa = (tarefaId, novoTexto) => {
    const novasListas = listas.map((l) => {
      if (l.id === lista.id) {
        const novasTarefas = l.tarefas.map((t) =>
          t.id === tarefaId ? { ...t, conteudo: novoTexto } : t
        );
        return { ...l, tarefas: novasTarefas };
      }
      return l;
    });
    setListas(novasListas);
  };

  const toggleConcluida = (tarefaId) => {
    const novasListas = listas.map((l) =>
      l.id === lista.id
        ? {
            ...l,
            tarefas: l.tarefas.map((t) =>
              t.id === tarefaId ? { ...t, concluida: !t.concluida } : t
            ),
          }
        : l
    );
    setListas(novasListas);
  };

  const editarTituloLista = async () => {
    setEditandoTitulo(false);

    const tituloLimpo = novoTitulo.trim();

    if (!tituloLimpo || tituloLimpo === lista.titulo) {
      setNovoTitulo(lista.titulo);
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:3001/api/listas/${lista.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo: tituloLimpo }),
      });
  
      if (!res.ok) throw new Error("Erro ao atualizar título da lista");

    const atualizadas = listas.map((l) =>
      l.id === lista.id ? { ...l, titulo: tituloLimpo } : l
    );
    setListas(atualizadas);
  } catch (err) {
    console.error("Erro ao editar título da lista:", err);
  }
  };

  return (
    <div
      style={{
        width: 280,
        padding: "16px",
        background: "#f7f9fc",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "75vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        {editandoTitulo ? (
          <input
            value={novoTitulo}
            onChange={(e) => setNovoTitulo(e.target.value)}
            onBlur={editarTituloLista}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: "16px",
              padding: "4px 6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              flex: 1,
            }}
          />
        ) : (
          <h3
            onClick={() => setEditandoTitulo(true)}
            style={{
              fontSize: "16px",
              fontWeight: "600",
              margin: 0,
              flex: 1,
              cursor: "pointer",
            }}
          >
            {lista.titulo}
          </h3>
        )}
        <BotaoX
          onClick={(e) => {
            e.stopPropagation();
            onExcluirLista();
          }}
          style={{ marginLeft: "8px" }}
        />
      </div>

      <Droppable
        droppableId={String(lista.id)}
        type="TASK"
        direction="vertical"
        isDropDisabled={false}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ minHeight: 100, flex: 1 }}
          >
            {lista.tarefas.map((tarefa, index) => (
              <CardTarefas
                key={tarefa.id}
                tarefa={tarefa}
                index={index}
                concluida={tarefa.concluida}
                onExcluir={() => excluirTarefa(tarefa.id)}
                onEditar={(novoTexto) => editarTarefa(tarefa.id, novoTexto)}
                onToggleConcluida={() => toggleConcluida(tarefa.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div style={{ marginTop: 12 }}>
        <NovaTarefa onAdicionar={adicionarTarefa} listaId={lista.id} />
      </div>
    </div>
  );
}
