import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RotaPrivada({ children }) {
  const { token } = useContext(AuthContext);

  return token ? children : <Navigate to="/login" replace />;
}
