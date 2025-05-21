import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Botao from "../components/Botao";

export default function Home() {
  const [paineis, setPaineis] = useState([]);
  const [novoNome, setNovoNome] = useState("");
  const [erro, setErro] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarPaineis() {
      try {
        const res = await fetch("http://localhost:3001/api/painel", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar painéis");

        const dados = await res.json();
        setPaineis(dados);
      } catch (err) {
        console.error("Erro ao carregar painéis:", err);
      }
    }

    carregarPaineis();
  }, [token]);

  const criarPainel = async (e) => {
    e.preventDefault();
    if (!novoNome.trim()) {
      setErro(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/painel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo: novoNome,
          descricao: "",
          publico: true
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar painel");

      const novo = await res.json();
      navigate(`/painel/${novo.id}`);
    } catch (err) {
      console.error("Erro ao criar painel:", err);
      setErro(true);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Meus Painéis</h1>

      <form onSubmit={criarPainel} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          placeholder="Nome do novo painel"
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
            marginRight: "0.5rem",
            width: "250px",
          }}
        />
        <Botao type="submit">Criar</Botao>
        {erro && (
          <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
            Nome inválido.
          </div>
        )}
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
      {console.log("Paineis:", paineis)}
        {paineis.map((painel) => (
          <li key={painel.id} style={{ marginBottom: "8px" }}>
            <Link
              to={`/painel/${painel.id}`}
              style={{
                textDecoration: "none",
                color: "#007bff",
                fontSize: "16px",
              }}
            >
              {painel.titulo}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}