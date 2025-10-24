import api from "../api/api";
import { Message, User } from "../types";

interface Props {
  message: Message;
  currentUser: User;
  onChange: () => void;
}

export default function MessageCard({ message, currentUser, onChange }: Props) {
  const isOwner = message.user.id === currentUser.id;

  async function handleDelete() {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Deseja excluir essa mensagem?")) return;
    await api.delete(`/messages/${message.id}`);
    onChange();
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-800">{message.content}</p>
      <p className="text-sm text-gray-500 mt-1">
        <b>{message.user.name}</b> • {message.category.name}
      </p>
      {isOwner && (
        <button
          onClick={handleDelete}
          className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
        >
          Excluir
        </button>
      )}
    </div>
  );
}
