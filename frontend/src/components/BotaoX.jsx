export default function BotaoX({ onClick, ...props }) {
    return (
      <button
        onClick={onClick}
        {...props}
        style={{
          background: "transparent",
          color: "#dc3545",
          border: "none",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          padding: "2px 6px",
          lineHeight: 1,
          ...props.style,
        }}
      >
        X
      </button>
    );
  }
  