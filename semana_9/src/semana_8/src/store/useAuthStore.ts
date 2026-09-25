import { create } from 'zustand';
import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware';
import { authApi, toAppUser, type DummyLoginResponse } from '../services/authApi';
import { secureUserStorage, tokenStorage } from '../../../semana_7/src/storage/secureToken';
import type { AppUser, LoginInput, RegisterInput, TokenPair } from '../../../semana_2/src/types';

type PersistedAuth = { user: AppUser | null };
type AuthState = {
  user: AppUser | null;
  accessToken: string | null;
  ready: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
};

const options: PersistOptions<AuthState, PersistedAuth> = {
  name: 'cooperativa-auth-user-v1',
  storage: createJSONStorage<PersistedAuth>(() => secureUserStorage),
  partialize: (state) => ({ user: state.user }),
};

export const useAuthStore = create<AuthState>()(persist((set, get) => ({
  user: null,
  accessToken: null,
  ready: false,
  login: async ({ username, password }) => {
    const { data } = await authApi.post<DummyLoginResponse>('/auth/login', { username, password, expiresInMins: 30 });
    const tokens: TokenPair = { accessToken: data.accessToken, refreshToken: data.refreshToken };
    await tokenStorage.setTokens(tokens);
    set({ user: toAppUser(data), accessToken: tokens.accessToken, ready: true });
  },
  register: async ({ name, username, email, password }) => {
    // DummyJSON no mantiene usuarios creados; este endpoint sirve como alta de demostración.
    const { data } = await authApi.post<{ id: number; username: string; email: string; firstName?: string; lastName?: string }>('/users/add', {
      firstName: name,
      lastName: 'Cooperativa',
      username,
      email,
      password,
    });
    const user: AppUser = { id: data.id, username: data.username, email: data.email, firstName: data.firstName ?? name, lastName: data.lastName ?? '', role: 'operador' };
    const tokens: TokenPair = { accessToken: `demo-registration-${data.id}`, refreshToken: `demo-registration-refresh-${data.id}` };
    await tokenStorage.setTokens(tokens);
    set({ user, accessToken: tokens.accessToken, ready: true });
  },
  logout: async () => {
    await tokenStorage.clearTokens();
    set({ user: null, accessToken: null, ready: true });
  },
  restore: async () => {
    try {
      const saved = await tokenStorage.getTokens();
      if (!saved?.accessToken) { set({ user: null, accessToken: null, ready: true }); return; }
      if (saved.accessToken.startsWith('demo-registration-')) {
        set({ accessToken: saved.accessToken, ready: true });
        return;
      }
      const { data } = await authApi.get<DummyLoginResponse>('/auth/me');
      const currentTokens = await tokenStorage.getTokens();
      set({ user: toAppUser(data), accessToken: currentTokens?.accessToken ?? saved.accessToken, ready: true });
    } catch {
      await tokenStorage.clearTokens();
      set({ user: null, accessToken: null, ready: true });
    }
  },
}), options));

export function restoreAuthAfterHydration(): () => void {
  const restore = () => { void useAuthStore.getState().restore(); };
  if (useAuthStore.persist.hasHydrated()) restore();
  return useAuthStore.persist.onFinishHydration(restore);
}
