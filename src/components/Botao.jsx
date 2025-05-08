export default function Botao({
  children,
  onClick,
  type = "button",
  ...props
}) {
  const estilos = {
    base: {
      padding: "6px 12px",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
      transition: "0.2s",
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
    <button type={type} onClick={onClick} style={estiloFinal} {...props}>
      {children}
    </button>
  );
}
