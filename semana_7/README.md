# Semana 7 · Persistencia local

- MMKV: preferencias síncronas (`sortOrder`, `compactMode`, `itemsPerPage`) en iOS/Android.
- AsyncStorage: caché de la lista de conductores y fallback sin conexión.
- Expo SecureStore: tokens y dato sensible de demostración; el valor nunca se muestra.
- En web se usan adaptadores compatibles para la demostración; MMKV requiere development build.

Código en `src/storage/` y `src/store/usePreferencesStore.ts`. Revisa también `docs/MMKV_EJEMPLO_NATIVO.md`.
