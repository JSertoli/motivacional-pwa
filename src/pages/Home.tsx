// Home.tsx
import { useEffect, useState } from "react";
import api from "../api/api";
import MessageCard from "../components/MessageCard";
import { Message, User, Category } from "../types";
import { useNavigate } from "react-router-dom";
import "../index.css"; // Import do CSS

interface HomeProps {
  setUser: (user: User | null) => void;
}

export default function Home({ setUser }: HomeProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const navigate = useNavigate();
  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) navigate("/"); // Redireciona se não houver login
    else loadData();
  }, [user, navigate]);

  async function loadData() {
    try {
      const [msgRes, catRes] = await Promise.all([
        api.get("/messages"),
        api.get("/categories"),
      ]);
      setMessages(msgRes.data);
      setCategories(catRes.data);
    } catch {
      alert("Erro ao carregar dados");
    }
  }

  // Enviar nova mensagem
  async function handleSendMessage() {
    if (!text) return alert("Digite uma mensagem");
    try {
      const payload: any = {
        content: text,
        userId: user!.id,
      };
      if (selectedCategory) payload.categoryId = selectedCategory;

      await api.post("/messages", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setText("");
      setSelectedCategory("");
      loadData();
    } catch (e) {
      console.log(e);
      alert("Erro ao enviar mensagem");
    }
  }

  // Criar nova categoria
  async function handleCreateCategory() {
    if (!newCategory.trim()) return alert("Digite o nome da categoria");
    try {
      const res = await api.post("/categories", { name: newCategory }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategories([...categories, res.data]);
      setNewCategory("");
    } catch {
      alert("Erro ao criar categoria");
    }
  }

  // Iniciar edição de uma mensagem
  function startEditing(msg: Message) {
    setEditingMessageId(msg.id);
    setEditingText(msg.content);
  }

  // Cancelar edição
  function cancelEditing() {
    setEditingMessageId(null);
    setEditingText("");
  }

  // Salvar edição
  async function saveEdit(messageId: number, userId: number) {
    if (!editingText.trim()) return alert("Digite algo para atualizar a mensagem");
    try {
      await api.put(`/messages/${messageId}/${userId}`, { content: editingText }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEditingMessageId(null);
      setEditingText("");
      loadData();
    } catch (e) {
      console.log(e);
      alert("Erro ao atualizar mensagem");
    }
  }

  // Deletar mensagem
  async function deleteMessage(messageId: number, userId: number) {
    if (!window.confirm("Tem certeza que deseja excluir esta mensagem?")) return;

    try {
      await api.delete(`/messages/${messageId}/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      loadData();
    } catch (e) {
      console.log(e);
      alert("Erro ao deletar mensagem");
    }
  }


  return (
    <div className="container">
      {/* Header */}
      <header>
        <h2>Olá, {user?.name || "Usuário"}! ✨</h2>
        <div>
          <button
              onClick={() => {
              localStorage.removeItem("user");
              setUser(null); // <- atualiza o state global
              navigate("/");  // redireciona
              }}
          >
              Sair
          </button>
          <span style={{ margin: "0 1rem", color: "#ccc" }}>|</span>
          <button onClick={() => navigate("/settings")}>Configurações</button>
        </div>
        </header>


      {/* Formulário de mensagem */}
      <div className="form-card">
        <textarea
          placeholder="Escreva sua mensagem motivacional..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Escolha uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button onClick={handleSendMessage}>Enviar Mensagem</button>
        </div>
      </div>

      {/* Formulário de criação de categoria */}
      <div className="form-card">
        <input
          placeholder="Criar nova categoria..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleCreateCategory}>Criar Categoria</button>
      </div>

      {/* Lista de mensagens */}
      <div className="messages-grid">
        {messages.map((msg) => (
          <div key={msg.id} className="message-card">
            {editingMessageId === msg.id ? (
              <>
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  style={{ width: "100%", marginBottom: "0.5rem", borderRadius: "0.5rem", padding: "0.5rem" }}
                />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => saveEdit(msg.id, user!.id)}>Salvar</button>
                  <button onClick={cancelEditing} style={{ backgroundColor: "#ccc", color: "#000" }}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <MessageCard message={msg} currentUser={user!} onChange={loadData} />
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                {(msg.user.id === user!.id) && (
                    <button
                      onClick={() => startEditing(msg)}
                      style={{
                        fontSize: "0.85rem",
                        color: "#7c3aed",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                  )}
                  {(user!.role === "ADMIN") && (
                      <button
                        onClick={() => deleteMessage(msg.id, user!.id)}
                        style={{
                          fontSize: "0.85rem",
                          color: "red",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Deletar
                      </button>
                      )}
                  </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
