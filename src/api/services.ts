import { api } from './client';
import type {
  AuthUser,
  Comment,
  CommentInput,
  LoginResponse,
  Paginated,
  Post,
  PostInput,
  User,
  UserInput,
  UserKind,
} from '@/types';

export const authService = {
  login: async (email: string, password: string) =>
    (await api.post<LoginResponse>('/auth/login', { email, password })).data,
  me: async () => (await api.get<AuthUser>('/auth/me')).data,
};

export const postsService = {
  list: async () => (await api.get<Post[]>('/posts')).data,
  search: async (q: string) => (await api.get<Post[]>('/posts/search', { params: { q } })).data,
  getById: async (id: string) => (await api.get<Post>(`/posts/${id}`)).data,
  create: async (input: PostInput) => (await api.post<Post>('/posts', input)).data,
  update: async (id: string, input: Partial<PostInput>) =>
    (await api.put<Post>(`/posts/${id}`, input)).data,
  remove: async (id: string) => {
    await api.delete(`/posts/${id}`);
  },
};

export const commentsService = {
  list: async (postId: string) => (await api.get<Comment[]>(`/posts/${postId}/comments`)).data,
  create: async (postId: string, input: CommentInput) =>
    (await api.post<Comment>(`/posts/${postId}/comments`, input)).data,
};

/** Mesmo contrato para /teachers e /students. */
export const usersService = {
  list: async (kind: UserKind, page = 1, limit = 10) =>
    (await api.get<Paginated<User>>(`/${kind}`, { params: { page, limit } })).data,
  getById: async (kind: UserKind, id: string) => (await api.get<User>(`/${kind}/${id}`)).data,
  create: async (kind: UserKind, input: UserInput) => (await api.post<User>(`/${kind}`, input)).data,
  update: async (kind: UserKind, id: string, input: Partial<UserInput>) =>
    (await api.put<User>(`/${kind}/${id}`, input)).data,
  remove: async (kind: UserKind, id: string) => {
    await api.delete(`/${kind}/${id}`);
  },
};
