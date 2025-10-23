import { useState } from "react";
import api from "../api";

interface Message {
  id: number;
  content: string;
  author: string;
  authorToken: string;
}

interface Props {
  message: Message;
  onUpdated: () => void;
}

export default function MessageCard({ message, onUpdated }: Props) {
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState(message.content);

  const localToken = localStorage.getItem("authorToken");

  async function handleUpdate() {
    try {
      await api.put(`/messages/${message.id}`, {
        content: newContent,
        authorToken: localToken,
      });
      setEditing(false);
      onUpdated();
    } catch {
      alert("Você não tem permissão para editar esta mensagem.");
    }
  }

  async function handleDelete() {
  try {
    await api.delete(`/messages/${message.id}`, {
      data: { authorToken: localToken },
    });
    onUpdated();
  } catch {
    alert("Você não tem permissão para excluir esta mensagem.");
  }
}

  return (
    <div className="card">
      {editing ? (
        <>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button onClick={handleUpdate}>Salvar</button>
          <button onClick={() => setEditing(false)}>Cancelar</button>
        </>
      ) : (
        <>
          <p>{message.content}</p>
          <small>— {message.author}</small>
          {localToken === message.authorToken && (
            <>
                <button onClick={() => setEditing(true)} style={{ marginLeft: "10px", marginRight: "8px" }}>
                    Editar
                </button>
                <button onClick={handleDelete}>Excluir</button>
            </>
            )}
        </>
      )}
    </div>
  );
}
