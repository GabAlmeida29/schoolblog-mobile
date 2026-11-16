import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/api/services';
import type { UserInput, UserKind } from '@/types';

export const PAGE_SIZE = 10;

export const userKeys = {
  all: (kind: UserKind) => ['users', kind] as const,
  list: (kind: UserKind, search: string) => ['users', kind, 'list', search] as const,
  total: (kind: UserKind) => ['users', kind, 'total'] as const,
  detail: (kind: UserKind, id: string) => ['users', kind, 'detail', id] as const,
};

export function useUsers(kind: UserKind, search = '') {
  const term = search.trim();
  return useInfiniteQuery({
    queryKey: userKeys.list(kind, term),
    queryFn: ({ pageParam }) => usersService.list(kind, pageParam, PAGE_SIZE, term),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
  });
}

export function useUsersTotal(kind: UserKind, enabled = true) {
  return useQuery({
    queryKey: userKeys.total(kind),
    queryFn: async () => (await usersService.list(kind, 1, 1)).meta.total,
    enabled,
  });
}

export function useUser(kind: UserKind, id?: string) {
  return useQuery({
    queryKey: userKeys.detail(kind, id ?? ''),
    queryFn: () => usersService.getById(kind, id!),
    enabled: !!id,
  });
}

export function useSaveUser(kind: UserKind, id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UserInput) =>
      id ? usersService.update(kind, id, input) : usersService.create(kind, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all(kind) }),
  });
}

export function useDeleteUser(kind: UserKind) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.remove(kind, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all(kind) }),
  });
}
