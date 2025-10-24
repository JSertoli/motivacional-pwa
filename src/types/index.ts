export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  user: User;
  category: Category;
}
