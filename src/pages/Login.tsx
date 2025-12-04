import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../index.css";

interface LoginProps {
  onLogin: (user: any) => void;
}

// TODO: Create page to update user credentials
export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const res = await api.post("/users/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      console.log(user);
      
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
      navigate("/home");
    } catch (err) {
      alert("Erro ao fazer login");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Motivacional Network 💬</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Entrar</button>

        <p style={{ marginTop: "1rem" }}>
          Ainda não tem uma conta?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Criar conta
          </span>
        </p>
      </div>
    </div>
  );
}
