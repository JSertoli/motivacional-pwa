import api from "../api/api";
import { Message, User } from "../types";

interface Props {
  message: Message;
  currentUser: User;
  onChange: () => void;
}

export default function MessageCard({ message, currentUser, onChange }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-800">{message.content}</p>
      <p className="text-sm text-gray-500 mt-1">
        <b>{message.user.name}</b> • {message.category.name}
      </p>
    </div>
  );
}
