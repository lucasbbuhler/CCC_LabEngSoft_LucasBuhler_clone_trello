export async function registrarHistorico(tarefaId, descricao, token) {
    try {
      await fetch("http://localhost:3001/api/historico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tarefa_id: tarefaId, descricao }),
      });
    } catch (err) {
      console.error("Erro ao registrar histórico:", err);
    }
  }
  