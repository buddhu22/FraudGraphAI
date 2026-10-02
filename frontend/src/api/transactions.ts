import { apiClient } from './client';
import type { InvestigationResult, NeighborTransaction } from '../types';

export const transactionsApi = {
  getTransaction: (id: string) =>
    apiClient.get<InvestigationResult>(`/api/transaction/${encodeURIComponent(id)}`),

  getNeighbors: (id: string) =>
    apiClient.get<NeighborTransaction[]>(`/api/transaction/${encodeURIComponent(id)}/neighbors`),

  predict: (id: string) =>
    apiClient.post<InvestigationResult>('/api/predict', { transaction_id: id }),
};
