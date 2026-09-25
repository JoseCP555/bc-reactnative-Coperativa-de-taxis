// Adaptador de respaldo web; Metro elige preferencesStorage.native.ts en iOS/Android.
const PREFIX = 'cooperativa-preferences-v1:';
const memory = new Map<string, string>();
function get(key: string): string | undefined {
  try { return globalThis.localStorage?.getItem(PREFIX + key) ?? memory.get(key); }
  catch { return memory.get(key); }
}
function set(key: string, value: string): void {
  memory.set(key, value);
  try { globalThis.localStorage?.setItem(PREFIX + key, value); } catch { /* memoria como respaldo */ }
}
export const preferencesStorage = {
  getString: (key: string): string | undefined => get(key),
  setString: (key: string, value: string): void => set(key, value),
  getBoolean: (key: string): boolean | undefined => { const v = get(key); return v === undefined ? undefined : v === 'true'; },
  setBoolean: (key: string, value: boolean): void => set(key, String(value)),
  getNumber: (key: string): number | undefined => { const v = get(key); return v === undefined ? undefined : Number(v); },
  setNumber: (key: string, value: number): void => set(key, String(value)),
};
