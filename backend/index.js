const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {res.send("Backend está rodando!");});

app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/painel", require("./routes/painel"));
app.use("/api/tarefas", require("./routes/tarefas"));
app.use("/api/membros", require("./routes/membrosPainel"));
app.use("/api/listas", require("./routes/listas"));
app.use("/api/comentarios", require("./routes/comentarios"));
app.use("/api/historico", require("./routes/historico"));
app.use("/api/auth", require("./routes/auth"));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
