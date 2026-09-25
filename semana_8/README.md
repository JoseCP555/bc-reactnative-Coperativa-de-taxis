# Semana 8 · Autenticación

Login con React Hook Form + Zod contra DummyJSON; Zustand persiste solo el perfil en una capa SecureStore, y los access/refresh tokens se guardan por separado en SecureStore. Axios agrega Bearer y renueva ante 401. Navegación condicional protege la app.

- Código: `src/services/authApi.ts`, `src/store/useAuthStore.ts`, `src/screens/AuthScreen.tsx`, `src/screens/ProfileScreen.tsx`.
- Credenciales públicas de práctica: `emilys` / `emilyspass`.
- Registro de DummyJSON y OAuth requieren configuración y tienen límites descritos en `docs/ALCANCE_Y_LIMITACIONES.md`.
