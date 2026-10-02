import type { ModelInfo } from '../types';

export const mockModelInfo: ModelInfo = {
  name: 'Graph Convolutional Network',
  version: 'v1.0',
  inputFeatures: 166,
  hiddenDimension: 64,
  outputClasses: 2,
  framework: 'PyTorch Geometric',
  trainedOn: 'Elliptic Bitcoin Dataset',
  parameters: 21_378,
  performance: {
    precision: 0.97,
    recall: 0.82,
    f1: 0.89,
    rocAuc: 0.985,
    prAuc: 0.916,
  },
};
