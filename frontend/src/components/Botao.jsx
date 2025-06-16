export default function Botao({
  children,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  ...props
}) {
  const estilos = {
    base: {
      padding: "10px",
      border: "none",
      borderRadius: "999px",
      fontSize: "14px",
      cursor: disabled || loading ? "not-allowed" : "pointer",
      transition: "0.2s",
      opacity: disabled || loading ? 0.6 : 1,
    },
    primaria: {
      backgroundColor: "#007bff",
      color: "#fff",
    },
    secundaria: {
      backgroundColor: "#f0f0f0",
      color: "#333",
      border: "1px solid #ccc",
    },
  };

  const estiloFinal = {
    ...estilos.base,
    ...estilos.primaria,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={estiloFinal}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Enviando..." : children}
    </button>
  );
}
