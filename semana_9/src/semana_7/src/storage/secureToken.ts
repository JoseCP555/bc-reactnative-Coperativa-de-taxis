import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { TokenPair } from '../../../semana_2/src/types';

const TOKEN_KEY = 'cooperativa-auth-tokens-v1';
const PRIVATE_VALUE_KEY = 'cooperativa-private-demo-value-v1';
let webTokens: TokenPair | null = null;
let webPrivateValue: string | null = null;
const webPersistedState = new Map<string, string>();

export const tokenStorage = {
  async getTokens(): Promise<TokenPair | null> {
    if (Platform.OS === 'web') return webTokens;
    const raw = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as TokenPair; }
    catch { await SecureStore.deleteItemAsync(TOKEN_KEY); return null; }
  },
  async setTokens(tokens: TokenPair): Promise<void> {
    if (Platform.OS === 'web') { webTokens = tokens; return; }
    await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
  },
  async clearTokens(): Promise<void> {
    if (Platform.OS === 'web') { webTokens = null; return; }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};

// SecureStore-backed Zustand storage. On web it is memory-only; auth tokens are never written to AsyncStorage.
export const secureUserStorage = {
  async getItem(name: string): Promise<string | null> {
    if (Platform.OS === 'web') return webPersistedState.get(name) ?? null;
    return SecureStore.getItemAsync(`state-${name}`);
  },
  async setItem(name: string, value: string): Promise<void> {
    if (Platform.OS === 'web') { webPersistedState.set(name, value); return; }
    await SecureStore.setItemAsync(`state-${name}`, value);
  },
  async removeItem(name: string): Promise<void> {
    if (Platform.OS === 'web') { webPersistedState.delete(name); return; }
    await SecureStore.deleteItemAsync(`state-${name}`);
  },
};

export const privateValueStorage = {
  async set(value: string): Promise<void> {
    if (Platform.OS === 'web') { webPrivateValue = value; return; }
    await SecureStore.setItemAsync(PRIVATE_VALUE_KEY, value);
  },
  async get(): Promise<string | null> {
    if (Platform.OS === 'web') return webPrivateValue;
    return SecureStore.getItemAsync(PRIVATE_VALUE_KEY);
  },
  async remove(): Promise<void> {
    if (Platform.OS === 'web') { webPrivateValue = null; return; }
    await SecureStore.deleteItemAsync(PRIVATE_VALUE_KEY);
  },
};
