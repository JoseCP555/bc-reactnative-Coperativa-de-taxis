# Guía de entrega y aprendizaje · Semanas 1 a 9

El proyecto es una sola aplicación progresiva. Para entender una semana, revisa su `README.md`, los archivos de esa carpeta y las conexiones indicadas aquí. No afirmes que una captura está hecha: tómala manualmente después de ejecutar tu app.

## Recorrido de verificación

1. Desde la raíz ejecuta `pnpm install` y `pnpm exec expo start --clear`; en web pulsa `w`. Para TypeScript ejecuta `pnpm typecheck`.
2. Inicia sesión con `emilys` / `emilyspass`. Revisa el panel, el listado de conductores y viajes, preferencias y perfil.
3. En Conductores prueba una entrada inválida, alta, edición, cambio de estado, búsqueda y eliminación. Reinicia la app para comprobar la caché local.
4. En Viajes registra un origen/destino/tarifa, comprueba validación, historial, eliminación y refresco.
5. En Preferencias cambia el orden, modo compacto y tamaño de lista. En web se guarda con localStorage; en iOS/Android, con MMKV (requiere build nativo).
6. En Perfil cierra sesión y vuelve a entrar. El token nativo se almacena con SecureStore; no se debe mostrar su valor.
7. Abre Laboratorio de animaciones y prueba timing/interpolate, spring, decay y la adición de elementos con LayoutAnimation.
8. Para OAuth PKCE, configura `EXPO_PUBLIC_OAUTH_CLIENT_ID` y las redirect URIs del proveedor; no inventes secretos ni publiques client secrets.

## Qué mostrar en evidencias

- Capturas de las carpetas `semana_1` a `semana_9` y de la app ejecutándose.
- Para semana 6: campos vacíos o inválidos con mensajes, luego registro y edición exitosa.
- Para semana 7: preferencias antes/después de reiniciar; en nativo, muestra persistencia MMKV y confirmación SecureStore sin revelar el dato.
- Para semana 8: login, perfil, cierre de sesión; la renovación 401 se valida con una API/backend que emita tokens expirados, no se debe inventar una captura del flujo si no se ha disparado.
- Para semana 9: la pantalla con barras, spring/decay y lista animada.

## Importante para explicar al profesor

- El API de taxis es simulado con un adaptador Axios en memoria: no existe servidor remoto para sus altas y viajes.
- El caché offline conserva conductores; no hay cola de sincronización en segundo plano.
- El login principal usa la cuenta pública de práctica de DummyJSON. El endpoint `users/add` simula el registro y no persiste cuentas.
- OAuth PKCE necesita configuración real del proveedor. MMKV requiere build nativo; la app web usa adaptadores web para poder demostrar el resto sin Expo Go.
- No compartas contraseñas reales, tokens ni secretos de proveedor en capturas o GitHub.
