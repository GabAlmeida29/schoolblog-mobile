export type Role = 'PROFESSOR' | 'ALUNO';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostInput {
  title: string;
  content: string;
  author: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  postId: string;
  createdAt: string;
}

export interface CommentInput {
  content: string;
  author: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface UserInput {
  name: string;
  email: string;
  password?: string;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

/** Segmento de rota/endpoint usado pelas telas administrativas de usuários. */
export type UserKind = 'teachers' | 'students';
