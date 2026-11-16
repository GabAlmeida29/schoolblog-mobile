import { useQuery } from '@tanstack/react-query';
import { healthService } from '@/api/services';

export function useServerStatus() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => (await healthService.check()).status === 'ok',
    retry: false,
    refetchInterval: 30_000,
  });
}
