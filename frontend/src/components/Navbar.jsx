// src/components/Navbar.jsx
import { useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout, usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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
          marginRight: "50px"
        }}
      >
        Sair
      </button>
    </div>
  );
}
