# Alcance y limitaciones

- **Semanas 1–5:** se conserva el proyecto integrado de la Cooperativa de Taxis: recursos locales, conductores, navegación, Zustand y pantalla de viajes con TanStack Query.
- **Semana 5:** `semana_5/src/services/mockAdapter.ts` simula una API REST local con Axios. No hay servidor de taxis ni sincronización remota real.
- **Semana 6:** altas y ediciones usan React Hook Form + Zod y el adaptador REST educativo; los errores aparecen bajo cada campo.
- **Semana 7:** AsyncStorage conserva la caché de conductores para consulta offline; SecureStore almacena tokens y un dato sensible en plataformas nativas; MMKV almacena preferencias. En web se usa localStorage solo para preferencias y memoria para secretos. MMKV requiere development build.
- **Semana 8:** el inicio de sesión usa DummyJSON (`/auth/login`, `/auth/me`, `/auth/refresh`). El registro usa `users/add`, que devuelve un ejemplo pero no mantiene la cuenta en el servidor. El botón OAuth PKCE queda deshabilitado hasta configurar un client ID público y la URI de retorno del proveedor.
- **Seguridad:** nunca guardes contraseñas en almacenamiento local ni pongas client secrets en Expo. La autenticación y el API de taxis sirven para aprendizaje, no para producción.
- **Semana 9:** las animaciones usan la API `Animated` de React Native y `LayoutAnimation`; no se requiere Reanimated.
