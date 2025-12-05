// MessageForm.tsx (exemplo de ajuste)
import { useState } from "react";
import { User, Category } from "../types";
import api from "../api/api";

interface Props {
  user: User;
  categories: Category[];
  onCreated: () => void;
  allowEmptyCategory?: boolean;
}

export default function MessageForm({ user, categories, onCreated, allowEmptyCategory }: Props) {
  const [text, setText] = useState("");
  const [categoryId, setCategoryId] = useState("");

  async function handleSend() {
    if (!text) return alert("Digite uma mensagem");
    if (!categoryId && !allowEmptyCategory) return alert("Escolha uma categoria");

    try {
      await api.post("/messages", {
        text,
        categoryId: categoryId || null,
      }, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setText("");
      setCategoryId("");
      onCreated();
    } catch {
      alert("Erro ao enviar mensagem");
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4 items-start">
      <textarea
        className="p-2 border rounded w-full md:flex-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
        placeholder="Escreva sua mensagem..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select
        className="p-2 border rounded w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-purple-400"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        disabled={categories.length === 0}
      >
        <option value="">Selecione a categoria</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <button
        onClick={handleSend}
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-all"
      >
        Enviar
      </button>
    </div>
  );
}
