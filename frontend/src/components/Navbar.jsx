import { useState, useContext } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CompartilharPainel from "./CompartilharPainel";

export default function Navbar() {
  const { logout, usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { id: painelId } = useParams();
  const [mostrarCompartilhar, setMostrarCompartilhar] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#03076b",
        color: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <div style={{ marginRight: "auto", fontWeight: "bold" }}>
        {usuario?.email || "Painéis"}
      </div>

      {location.pathname !== "/" && (
        <Link
          to="/"
          style={{
            marginRight: "1.5rem",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Meus Painéis
        </Link>
      )}

      {painelId && (
        <>
          <button
            onClick={() => setMostrarCompartilhar(true)}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              padding: "8px 16px",
              marginRight: "15px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Compartilhar
          </button>

          {mostrarCompartilhar && (
            <CompartilharPainel
              painelId={painelId}
              onFechar={() => setMostrarCompartilhar(false)}
            />
          )}
        </>
      )}

      <button
        onClick={handleLogout}
        style={{
          background: "#fff",
          color: "#03076b",
          border: "none",
          padding: "8px 16px",
          borderRadius: "999px",
          cursor: "pointer",
          fontWeight: "bold",
          marginRight: "50px",
        }}
      >
        Sair
      </button>
    </div>
  );
}
