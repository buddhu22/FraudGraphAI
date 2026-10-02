import { apiClient } from './client';
import type { ModelInfo } from '../types';

export const modelApi = {
  getModelInfo: () => apiClient.get<ModelInfo>('/api/model'),
  healthCheck: () => apiClient.get<{ status: string }>('/api/health'),
};
