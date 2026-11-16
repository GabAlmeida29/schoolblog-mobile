export type Role = 'PROFESSOR' | 'ALUNO';

export type UserKind = 'teachers' | 'students';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface User extends AuthUser {
  phone: string | null;
  bio: string | null;
  subject: string | null;
  education: string | null;
  registration: string | null;
  classGroup: string | null;
  birthDate: string | null;
  guardianName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface UpdateMeResponse extends LoginResponse {
  profile: User;
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

export interface UserInput {
  name: string;
  email: string;
  password?: string;
  phone?: string | null;
  subject?: string | null;
  education?: string | null;
  bio?: string | null;
  registration?: string | null;
  classGroup?: string | null;
  birthDate?: string | null;
  guardianName?: string | null;
}

export interface UpdateMeInput {
  name?: string;
  phone?: string | null;
  currentPassword?: string;
  newPassword?: string;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
