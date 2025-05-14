import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ListaTarefas from "../components/ListaTarefas";
import NovoPainel from "../components/NovoPainel";
import { useState } from "react";

export default function Painel() {
  const [listas, setListas] = useState([
    {
      id: "lista-1",
      titulo: "A Fazer",
      tarefas: [
        { id: "tarefa-1", conteudo: "tarefa" },
        { id: "tarefa-2", conteudo: "tarefa" },
      ],
    },
    {
      id: "lista-2",
      titulo: "Em andamento",
      tarefas: [
        { id: "tarefa-3", conteudo: "tarefa" },
        { id: "tarefa-4", conteudo: "tarefa" },
      ],
    },
    {
      id: "lista-3",
      titulo: "Concluído",
      tarefas: [
        { id: "tarefa-5", conteudo: "tarefa" },
      ],
    },
  ]);

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "LIST") {
      const novasListas = Array.from(listas);
      const [removida] = novasListas.splice(source.index, 1);
      novasListas.splice(destination.index, 0, removida);
      setListas(novasListas);
      return;
    }

    const sourceIndex = listas.findIndex((l) => l.id === source.droppableId);
    const destinationIndex = listas.findIndex(
      (l) => l.id === destination.droppableId
    );

    if (sourceIndex === -1 || destinationIndex === -1) return;

    const sourceList = listas[sourceIndex];
    const destinationList = listas[destinationIndex];

    const sourceTasks = Array.from(sourceList.tarefas);
    const tarefaMovida = { ...sourceTasks[source.index] };
    sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, tarefaMovida);

      const novasListas = listas.map((lista, i) =>
        i === sourceIndex ? { ...lista, tarefas: sourceTasks } : lista
      );

      setListas([...novasListas]);
    } else {
      const destinationTasks = Array.from(destinationList.tarefas);
      destinationTasks.splice(destination.index, 0, tarefaMovida);

      const novasListas = listas.map((lista, i) => {
        if (i === sourceIndex) {
          return { ...lista, tarefas: sourceTasks };
        }
        if (i === destinationIndex) {
          return { ...lista, tarefas: destinationTasks };
        }
        return lista;
      });

      setListas([...novasListas]);
    }
  };

  const adicionarLista = (titulo) => {
    const novaLista = {
      id: `lista-${Date.now()}`,
      titulo,
      tarefas: [],
    };
    setListas([...listas, novaLista]);
  };

  const excluirLista = (listaId) => {
    const atualizadas = listas.filter((l) => l.id !== listaId);
    setListas(atualizadas);
  };

  return (
    <div
      style={{
        padding: "2rem",
        background: "#e9ecef",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ marginBottom: "1rem", fontSize: "24px", color: "#333" }}>
        Painel de Tarefas
      </h1>
      <NovoPainel onAdicionar={adicionarLista} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="painel"
          direction="horizontal"
          type="LIST"
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1.5rem",
                overflowX: "auto",
              }}
            >
              {listas.map((lista, index) => (
                <Draggable key={lista.id} draggableId={lista.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ListaTarefas
                        lista={lista}
                        listas={listas}
                        setListas={setListas}
                        onExcluirLista={() => excluirLista(lista.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
