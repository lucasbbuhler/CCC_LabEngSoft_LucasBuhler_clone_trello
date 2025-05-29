import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
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
        body: JSON.stringify({
          titulo: novoNome,
          descricao: "",
          publico: true,
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
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          paddingTop: "70px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ marginBottom: "2rem", color: "#333" }}>Meus Painéis</h1>

        <form
          onSubmit={criarPainel}
          style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}
        >
          <input
            type="text"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Nome do novo painel"
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <Botao type="submit">Criar</Botao>
        </form>

        {erro && (
          <div
            style={{
              color: "red",
              fontSize: "13px",
              marginTop: "-1rem",
              marginBottom: "1.5rem",
            }}
          >
            Nome inválido.
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {paineis.map((painel) => (
            <Link
              key={painel.id}
              to={`/painel/${painel.id}`}
              style={{
                display: "block",
                backgroundColor: "#fff",
                padding: "1rem",
                borderRadius: "10px",
                textDecoration: "none",
                color: "#333",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1.00)")
              }
            >
              <h3 style={{ margin: 0, fontSize: "16px" }}>{painel.titulo}</h3>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
