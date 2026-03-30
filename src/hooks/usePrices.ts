import { useQuery } from '@tanstack/react-query';
import { fetchLivePrices, type PriceMap } from '../services/api/priceService';

export function usePrices() {
  return useQuery<PriceMap>({
    queryKey: ['live-prices'],
    queryFn: fetchLivePrices,
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: 2,
  });
}
