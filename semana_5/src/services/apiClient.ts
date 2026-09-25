import axios from 'axios';
import { tokenStorage } from '../../../semana_7/src/storage/secureToken';
import { mockAdapter } from './mockAdapter';

// Adaptador REST local para el proyecto educativo. Se puede sustituir por una API propia.
const useMockApi = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://cooperativa.local/api',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
  ...(useMockApi ? { adapter: mockAdapter } : {}),
});

apiClient.interceptors.request.use(async (config) => {
  const tokens = await tokenStorage.getTokens();
  if (tokens?.accessToken) config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  return config;
});
