import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../index.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
    if (!name || !email || !password)
      return alert("Preencha todos os campos");

    try {
      await api.post("/users/register", { name, email, password });
      alert("Usuário cadastrado com sucesso!");
      navigate("/"); // volta para tela de login
    } catch (err: any) {
    console.log(err);
      if (err.response?.status === 409)
        alert("Email já cadastrado");
      else alert("Erro ao cadastrar usuário");
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Crie sua conta</h1>
        <input
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Cadastrar</button>

        <p style={{ marginTop: "1rem" }}>
          Já tem uma conta?{" "}
          <span
            style={{ color: "#7c3aed", cursor: "pointer", fontWeight: "600" }}
            onClick={() => navigate("/")}
          >
            Fazer login
          </span>
        </p>
      </div>
    </div>
  );
}
