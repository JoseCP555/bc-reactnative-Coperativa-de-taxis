import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../../../semana_7/src/storage/secureToken';
import type { AppUser, TokenPair } from '../../../semana_2/src/types';

const BASE_URL = 'https://dummyjson.com';
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
export const authApi = axios.create({ baseURL: BASE_URL, timeout: 12000, headers: { 'Content-Type': 'application/json' } });

let refreshInFlight: Promise<TokenPair | null> | null = null;
authApi.interceptors.request.use(async (config) => {
  const tokens = await tokenStorage.getTokens();
  if (tokens?.accessToken) config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  return config;
});

authApi.interceptors.response.use((response) => response, async (error: AxiosError) => {
  const original = error.config as RetryConfig | undefined;
  const status = error.response?.status;
  const url = original?.url ?? '';
  if (!original || status !== 401 || original._retry || /\/auth\/(login|refresh)$/.test(url)) {
    return Promise.reject(error);
  }
  original._retry = true;
  try {
    const saved = await tokenStorage.getTokens();
    if (!saved?.refreshToken) throw new Error('No hay refresh token guardado.');
    if (!refreshInFlight) {
      refreshInFlight = axios.post<{ accessToken: string; refreshToken?: string }>(`${BASE_URL}/auth/refresh`, {
        refreshToken: saved.refreshToken,
        expiresInMins: 30,
      }, { timeout: 12000 }).then(async ({ data }) => {
        const tokens = { accessToken: data.accessToken, refreshToken: data.refreshToken ?? saved.refreshToken };
        await tokenStorage.setTokens(tokens);
        return tokens;
      }).finally(() => { refreshInFlight = null; });
    }
    const next = await refreshInFlight;
    if (!next) throw new Error('No se pudo renovar la sesión.');
    original.headers.Authorization = `Bearer ${next.accessToken}`;
    return authApi(original);
  } catch (refreshError) {
    await tokenStorage.clearTokens();
    return Promise.reject(refreshError);
  }
});

export type DummyLoginResponse = { accessToken: string; refreshToken: string; id: number; username: string; email: string; firstName: string; lastName: string; image?: string };
export function toAppUser(input: DummyLoginResponse): AppUser {
  return { id: input.id, username: input.username, email: input.email, firstName: input.firstName, lastName: input.lastName, image: input.image };
}
