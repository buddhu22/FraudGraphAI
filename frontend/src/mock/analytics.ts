import type { AnalyticsData } from '../types';

export const mockAnalytics: AnalyticsData = {
  licitCount: 157_427,
  illicitCount: 4_545,
  unknownCount: 41_797,

  riskDistribution: {
    low: 112_000,
    medium: 45_427,
    high: 35_797,
    critical: 10_545,
  },

  riskScoreHistogram: [
    { bin: '0–10%', count: 58_200 },
    { bin: '10–20%', count: 42_100 },
    { bin: '20–30%', count: 21_400 },
    { bin: '30–40%', count: 12_300 },
    { bin: '40–50%', count: 10_100 },
    { bin: '50–60%', count: 8_800 },
    { bin: '60–70%', count: 14_700 },
    { bin: '70–80%', count: 16_200 },
    { bin: '80–90%', count: 12_400 },
    { bin: '90–100%', count: 7_569 },
  ],

  highRiskTimeline: [
    { date: 'Jan', count: 312 },
    { date: 'Feb', count: 428 },
    { date: 'Mar', count: 390 },
    { date: 'Apr', count: 517 },
    { date: 'May', count: 480 },
    { date: 'Jun', count: 603 },
    { date: 'Jul', count: 720 },
    { date: 'Aug', count: 654 },
    { date: 'Sep', count: 788 },
    { date: 'Oct', count: 653 },
  ],

  degreeDistribution: [
    { degree: 1, count: 42_000 },
    { degree: 2, count: 38_500 },
    { degree: 3, count: 29_000 },
    { degree: 4, count: 21_000 },
    { degree: 5, count: 15_000 },
    { degree: 6, count: 9_800 },
    { degree: 7, count: 6_200 },
    { degree: 8, count: 4_100 },
    { degree: 9, count: 2_800 },
    { degree: 10, count: 1_200 },
  ],

  modelPerformance: {
    precision: 0.97,
    recall: 0.82,
    f1: 0.89,
    rocAuc: 0.985,
    prAuc: 0.916,
  },
};
