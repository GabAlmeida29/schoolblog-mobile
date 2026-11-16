import { api } from './client';
import type {
  Comment,
  CommentInput,
  LoginResponse,
  Paginated,
  Post,
  PostInput,
  UpdateMeInput,
  UpdateMeResponse,
  User,
  UserInput,
  UserKind,
} from '@/types';

export const authService = {
  login: async (email: string, password: string) =>
    (await api.post<LoginResponse>('/auth/login', { email, password })).data,
  me: async () => (await api.get<User>('/auth/me')).data,
  updateMe: async (input: UpdateMeInput) =>
    (await api.put<UpdateMeResponse>('/auth/me', input)).data,
};

export const healthService = {
  check: async () => (await api.get<{ status: string }>('/health', { timeout: 4000 })).data,
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

export const usersService = {
  list: async (kind: UserKind, page = 1, limit = 10, q?: string) =>
    (
      await api.get<Paginated<User>>(`/${kind}`, {
        params: { page, limit, ...(q ? { q } : {}) },
      })
    ).data,
  getById: async (kind: UserKind, id: string) => (await api.get<User>(`/${kind}/${id}`)).data,
  create: async (kind: UserKind, input: UserInput) =>
    (await api.post<User>(`/${kind}`, input)).data,
  update: async (kind: UserKind, id: string, input: Partial<UserInput>) =>
    (await api.put<User>(`/${kind}/${id}`, input)).data,
  remove: async (kind: UserKind, id: string) => {
    await api.delete(`/${kind}/${id}`);
  },
};
