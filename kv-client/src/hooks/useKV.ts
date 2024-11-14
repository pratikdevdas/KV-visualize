import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kvService } from '../services/api';
import { KVPair } from '../types/types';

export const useKVQueries = (binding: string) => {
  const queryClient = useQueryClient();

  // Query for fetching all keys
  const allKeysQuery = useQuery({
    queryKey: ['kv-keys', binding],
    queryFn: () => kvService.getAllValues(binding),
    refetchOnWindowFocus: true,
    staleTime: 1000,
    refetchOnMount: true,
  });

  // Query for fetching a single value
  const useGetValueQuery = (key: string) => useQuery({
    queryKey: ['kv-value', binding, key],
    queryFn: () => kvService.getValue(key, binding),
    enabled: !!key, // Only run when key is provided
  });

  // Mutation for creating/updating KV pairs
  const createOrUpdateMutation = useMutation({
    mutationFn: (kvPair: KVPair) => kvService.createOrUpdate(kvPair, binding),
    onSuccess: () => {
      // Invalidate relevant queries ater successful mutation
      queryClient.invalidateQueries({ queryKey: ['kv-keys', binding] });
    },
  });

  // Mutation for deleting KV pairs
  const deleteMutation = useMutation({
    mutationFn: (key: string) => kvService.deleteKey(key, binding),
    onSuccess: () => {
      // Invalidate relevant queries after successful deletion
      queryClient.invalidateQueries({ queryKey: ['kv-keys', binding] });
    },
  });

  return {
    allKeysQuery,
    useGetValueQuery,
    createOrUpdateMutation,
    deleteMutation,
  };
}; 