import { apiClient } from './client';
import type { AnalyticsData } from '../types';

export const analyticsApi = {
  getAnalytics: () => apiClient.get<AnalyticsData>('/api/analytics'),
};
