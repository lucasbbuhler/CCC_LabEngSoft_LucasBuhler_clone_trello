import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Painel from "./pages/Painel";
import EsqueciSenha from "./pages/EsqueciSenha";
import ResetarSenha from "./pages/ResetarSenha";
import RotaPrivada from "./routes/RotaPrivada";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/resetar-senha/:token" element={<ResetarSenha />} />
      <Route
        path="/"
        element={
          <RotaPrivada>
            <Home />
          </RotaPrivada>
        }
      />
      <Route
        path="/painel/:id"
        element={
          <RotaPrivada>
            <Painel />
          </RotaPrivada>
        }
      />
    </Routes>
  );
}

export default App;
