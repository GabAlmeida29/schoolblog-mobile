import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentsService, postsService } from '@/api/services';
import type { CommentInput, PostInput } from '@/types';

export const postKeys = {
  all: ['posts'] as const,
  list: (search: string) => ['posts', 'list', search] as const,
  detail: (id: string) => ['posts', 'detail', id] as const,
  comments: (id: string) => ['posts', 'comments', id] as const,
};

export function usePosts(search = '') {
  const term = search.trim();
  return useQuery({
    queryKey: postKeys.list(term),
    queryFn: () => (term ? postsService.search(term) : postsService.list()),
  });
}

export function usePost(id?: string) {
  return useQuery({
    queryKey: postKeys.detail(id ?? ''),
    queryFn: () => postsService.getById(id!),
    enabled: !!id,
  });
}

export function useSavePost(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PostInput) =>
      id ? postsService.update(id, input) : postsService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => postsService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
  });
}

export function useComments(postId?: string) {
  return useQuery({
    queryKey: postKeys.comments(postId ?? ''),
    queryFn: () => commentsService.list(postId!),
    enabled: !!postId,
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CommentInput) => commentsService.create(postId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) }),
  });
}
