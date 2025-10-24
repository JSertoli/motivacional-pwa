import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../index.css";

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    if (!name || !email) return alert("Preencha todos os campos");

    try {
      const res = await api.post("/users", { name, email });
      if (!res.data?.id) return alert("Erro ao receber dados do usuário");

      localStorage.setItem("user", JSON.stringify(res.data));
      onLogin(res.data); // atualiza o estado no App
      navigate("/home");
    } catch (e) {
      console.log(e);
      alert("Erro ao fazer login");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Motivacional Network 💬</h1>
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleLogin}>Entrar</button>
      </div>
    </div>
  );
}
