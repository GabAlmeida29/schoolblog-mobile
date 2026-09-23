import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/api/services';
import type { UserInput, UserKind } from '@/types';

export const PAGE_SIZE = 10;

export const userKeys = {
  all: (kind: UserKind) => ['users', kind] as const,
  detail: (kind: UserKind, id: string) => ['users', kind, 'detail', id] as const,
};

/** Listagem paginada no back-end (page/limit) consumida com scroll infinito. */
export function useUsers(kind: UserKind) {
  return useInfiniteQuery({
    queryKey: [...userKeys.all(kind), 'list'],
    queryFn: ({ pageParam }) => usersService.list(kind, pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined),
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
