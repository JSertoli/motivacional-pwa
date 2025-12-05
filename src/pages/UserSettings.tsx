import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { User } from "../types";

interface UserSettingsProps {
  setPropUser: (user: User | null) => void;
}

export default function UserSettings({ setPropUser }: UserSettingsProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/");
      return;
    }

    const parsed = JSON.parse(savedUser);
    setUser(parsed);
    setName(parsed.name);
    setEmail(parsed.email);
  }, [navigate]);

  async function handleUpdate() {
    try {
      const res = await api.put(`/users/${user.id}`, { name, email }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Dados atualizados com sucesso!");
    } catch {
      alert("Erro ao atualizar usuário");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Tem certeza que deseja excluir sua conta?")) return;

    try {
      await api.delete(`/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setPropUser(null);

      alert("Conta excluída com sucesso!");
      navigate("/");
    } catch {
      alert("Erro ao excluir usuário");
    }
  }

  if (!user) return null;

  return (
    <div className="account-container">
        <header>
            <h1>Gerenciar Conta</h1>
            
        </header>
        

        <div className="account-card">

            <div className="form-section">
            <label>Seus Dados</label>

            <div className="inputs-row">
                <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />

                <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            </div>

            <div className="buttons-row">
            <button className="save-btn" onClick={handleUpdate}>Salvar alterações</button>
            <button className="delete-btn" onClick={handleDelete}>Excluir Conta</button>
            </div>

        </div>

        <button className="back-btn" onClick={() => navigate("/home")}>
            Voltar
        </button>
    </div>
  );
}
