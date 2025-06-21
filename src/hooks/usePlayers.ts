import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { BalldontlieAPI } from '@balldontlie/sdk';

const api = new BalldontlieAPI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
});

export const usePlayers = () => {
  return useInfiniteQuery({
    queryKey: ['players'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.nba.getPlayers({
        cursor: pageParam,
        per_page: 10,
      });
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.meta?.next_cursor ?? undefined,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 429) return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * attemptIndex, 5000),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    throwOnError: false,
  });
};
