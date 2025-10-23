import { useEffect, useState } from "react";
import api from "./api";
import MessageCard from "./components/MessageCard";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: number;
  content: string;
  author: string;
  authorToken: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    fetchMessages();
    if (!localStorage.getItem("authorToken")) {
      localStorage.setItem("authorToken", uuidv4());
    }
  }, []);

  async function fetchMessages() {
    const res = await api.get("/messages");
    setMessages(res.data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!author.trim() || !content.trim()) {
      alert("Preencha o autor e a mensagem antes de enviar!");
      return;
    }

    try {
      await api.post("/messages", {
        author,
        content,
        authorToken: localStorage.getItem("authorToken"),
      });
      setAuthor("");
      setContent("");
      fetchMessages();
    } catch (error) {
      console.error(error);
      alert("Erro ao publicar a mensagem!");
    }
  }

  return (
    <div className="container">
      <h1>Mensagens Motivacionais 🌟</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Seu nome"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="Digite sua mensagem motivacional"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleSubmit}>Publicar</button>
      </div>

      <div className="messages">
        {messages.map((m) => (
          <MessageCard key={m.id} message={m} onUpdated={fetchMessages} />
        ))}
      </div>
    </div>
  );
}
