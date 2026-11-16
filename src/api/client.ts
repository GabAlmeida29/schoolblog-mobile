import { AxiosError, create } from 'axios';
import { API_URL } from '@/config/env';
import { STRINGS } from '@/constants/strings';

export const api = create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

api.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

interface ApiErrorBody {
  error?: string;
  issues?: { path?: (string | number)[]; message: string }[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  const err = error as AxiosError<ApiErrorBody>;

  if (err.response) {
    const { status, data } = err.response;
    if (data?.issues?.length) {
      const first = data.issues[0];
      const field = first.path?.join('.');
      return new ApiError(field ? `${field}: ${first.message}` : first.message, status);
    }
    return new ApiError(data?.error ?? STRINGS.errors.status(status), status);
  }

  if (err.request) return new ApiError(STRINGS.errors.network(API_URL));

  return new ApiError(err.message ?? STRINGS.errors.unexpected);
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    const url = (error as AxiosError).config?.url ?? '';
    if (apiError.status === 401 && !url.includes('/auth/login')) onUnauthorized?.();
    return Promise.reject(apiError);
  },
);
