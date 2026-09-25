# Semana 7 · MMKV y build nativo

La app usa `preferencesStorage.native.ts` para persistir `sortOrder`, `compactMode` e `itemsPerPage` con MMKV. La versión web selecciona `preferencesStorage.web.ts` y usa localStorage para que la app pueda probarse en navegador.

MMKV es un módulo nativo y no está integrado en Expo Go. Con Android Studio y el entorno del curso configurado:

```powershell
pnpm install
pnpm android:native
```

Para la práctica, comprueba que las tres preferencias cambien inmediatamente, cierra y vuelve a abrir la app nativa, y verifica que se mantengan. No se debe guardar el token o el dato sensible en MMKV: esos datos usan Expo SecureStore.
