import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import ListaTarefas from "../components/ListaTarefas";
import NovoPainel from "../components/NovoPainel";
import Navbar from "../components/Navbar";
import { useState, useEffect, useContext, startTransition } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Painel() {
  const [listas, setListas] = useState([]);
  const [tituloPainel, setTituloPainel] = useState("Painel de Tarefas");
  const [editandoTituloPainel, setEditandoTituloPainel] = useState(false);
  const { token } = useContext(AuthContext);
  const { id: painelId } = useParams();

  const handleReorderListas = (source, destination) => {
    const novasListas = Array.from(listas);
    const [removida] = novasListas.splice(source.index, 1);
    novasListas.splice(destination.index, 0, removida);

    setListas(novasListas);

    novasListas.forEach((lista, index) => {
      fetch(`http://localhost:3001/api/listas/${lista.id}/posicao`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ posicao: index }),
      }).catch((err) =>
        console.error(`Erro ao atualizar posição da lista ${lista.id}:`, err)
      );
    });
  };

  const handleMoveTarefaMesmaLista = (sourceIndex, source, destination) => {
    const sourceList = listas[sourceIndex];
    const sourceTasks = Array.from(sourceList.tarefas);
    const tarefaMovida = { ...sourceTasks[source.index] };

    sourceTasks.splice(source.index, 1);
    sourceTasks.splice(destination.index, 0, tarefaMovida);

    sourceTasks.forEach((tarefa, index) => {
      fetch(`http://localhost:3001/api/tarefas/${tarefa.id}/posicao`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ posicao: index }),
      });
    });

    const novasListas = listas.map((lista, i) =>
      i === sourceIndex ? { ...lista, tarefas: sourceTasks } : lista
    );

    startTransition(() => {
      setListas(novasListas);
    });
  };

  const handleMoveTarefaEntreListas = (
    sourceIndex,
    destinationIndex,
    source,
    destination
  ) => {
    const sourceList = listas[sourceIndex];
    const destinationList = listas[destinationIndex];

    const sourceTasks = Array.from(sourceList.tarefas);
    const destinationTasks = Array.from(destinationList.tarefas);

    const tarefaMovida = { ...sourceTasks[source.index] };
    sourceTasks.splice(source.index, 1);
    destinationTasks.splice(destination.index, 0, tarefaMovida);

    fetch(`http://localhost:3001/api/tarefas/${tarefaMovida.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo: tarefaMovida.conteudo,
        lista_id: Number(destination.droppableId),
      }),
    });

    sourceTasks.forEach((tarefa, index) => {
      fetch(`http://localhost:3001/api/tarefas/${tarefa.id}/posicao`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ posicao: index }),
      });
    });

    destinationTasks.forEach((tarefa, index) => {
      fetch(`http://localhost:3001/api/tarefas/${tarefa.id}/posicao`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ posicao: index }),
      });
    });

    const novasListas = listas.map((lista, i) => {
      if (i === sourceIndex) return { ...lista, tarefas: sourceTasks };
      if (i === destinationIndex)
        return { ...lista, tarefas: destinationTasks };
      return lista;
    });

    setListas([...novasListas]);
  };

  useEffect(() => {
    if (!painelId) return;
    async function carregarTituloPainel() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/painel/${painelId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dados = await res.json();
        setTituloPainel(dados.titulo);
      } catch (err) {
        console.error("Erro ao carregar título do painel:", err);
      }
    }

    carregarTituloPainel();

    async function carregarListasETarefas() {
      try {
        const resListas = await fetch(
          `http://localhost:3001/api/listas/painel/${painelId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const listasJson = await resListas.json();

        const listasComTarefas = await Promise.all(
          listasJson.map(async (lista) => {
            const resTarefas = await fetch(
              `http://localhost:3001/api/tarefas/lista/${lista.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const tarefasJson = await resTarefas.json();
            const tarefas = tarefasJson
              .filter((t) => t.lista_id === lista.id)
              .map((t) => ({
                id: String(t.id),
                conteudo: t.titulo,
                descricao: t.descricao,
                lista_id: t.lista_id,
                concluida: t.concluida,
              }));

            return { ...lista, id: String(lista.id), tarefas };
          })
        );

        setListas(listasComTarefas.sort((a, b) => a.posicao - b.posicao));

        const resPainel = await fetch(
          `http://localhost:3001/api/painel/${painelId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (resPainel.ok) {
          const painelJson = await resPainel.json();
          setTituloPainel(painelJson.titulo);
        }
      } catch (err) {
        console.error("Erro ao carregar listas/tarefas:", err);
      }
    }

    carregarListasETarefas();
  }, [token]);

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "LIST") {
      handleReorderListas(source, destination);
      return;
    }

    const sourceIndex = listas.findIndex((l) => l.id === source.droppableId);
    const destinationIndex = listas.findIndex(
      (l) => l.id === destination.droppableId
    );

    if (sourceIndex === -1 || destinationIndex === -1) return;

    if (source.droppableId === destination.droppableId) {
      handleMoveTarefaMesmaLista(sourceIndex, source, destination);
    } else {
      handleMoveTarefaEntreListas(
        sourceIndex,
        destinationIndex,
        source,
        destination
      );
    }
  };

  const adicionarLista = (novaLista) => {
    setListas([
      ...listas,
      {
        ...novaLista,
        id: String(novaLista.id),
        tarefas: [],
      },
    ]);
  };

  const excluirLista = async (listaId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/listas/${listaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const erro = await res.json();
        if (erro?.erro) alert(erro.erro);
        throw new Error("Erro ao excluir lista");
      }

      const atualizadas = listas.filter((l) => l.id !== listaId);
      setListas(atualizadas);
    } catch (err) {
      console.error("Erro ao excluir lista:", err);
    }
  };

  const editarTituloPainel = async () => {
    setEditandoTituloPainel(false);
    const tituloLimpo = tituloPainel.trim();
    if (!tituloLimpo) return;

    try {
      const res = await fetch(`http://localhost:3001/api/painel/${painelId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo: tituloLimpo }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar título do painel");
    } catch (err) {
      console.error("Erro ao editar título do painel:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          background: "#e9ecef",
          boxSizing: "border-box",
          padding: "1rem",
          paddingTop: "70px",
        }}
      >
        {editandoTituloPainel ? (
          <input
            value={tituloPainel}
            onChange={(e) => setTituloPainel(e.target.value)}
            onBlur={editarTituloPainel}
            autoFocus
            style={{
              fontSize: "24px",
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          />
        ) : (
          <h1
            style={{
              marginBottom: "1rem",
              fontSize: "24px",
              color: "#333",
              cursor: "pointer",
            }}
            onClick={() => setEditandoTituloPainel(true)}
          >
            {tituloPainel}
          </h1>
        )}

        <NovoPainel onAdicionar={adicionarLista} painelId={Number(painelId)} />
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
                  <Draggable
                    key={String(lista.id)}
                    draggableId={`lista-${lista.id}`}
                    index={index}
                  >
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
    </>
  );
}
