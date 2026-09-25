# Cooperativa de Taxis · Semanas 1 a 9

Proyecto Expo + React Native + TypeScript, basado en el código de la cooperativa que ya estaba organizado en semanas 1–5. Se conserva como **una sola app integrada**; cada carpeta `semana_N` muestra el módulo que se estudia en esa etapa.

## Ejecutar

Requisitos del temario: Node.js 22+, pnpm y VS Code.

```powershell
pnpm install
pnpm exec expo start --clear
```

Pulsa `w` para abrir la versión web. Para comprobar tipos:

```powershell
pnpm typecheck
```

La semana 7 usa MMKV en iOS/Android y por eso requiere un development build; Expo Go no incluye ese módulo nativo. Desde un equipo configurado para Android puedes usar `pnpm android:native`. En web hay un adaptador de preferencias local. Puedes probar el fallback offline con `EXPO_PUBLIC_USE_MOCK_API=false` y sin configurar una API real.

## Carpetas

| Carpeta | Contenido |
|---|---|
| `semana_1` | Inicio, tarjetas y recursos de la cooperativa |
| `semana_2` | Conductores, listas, búsqueda y tipos del dominio |
| `semana_3` | Navegación Stack y rutas tipadas |
| `semana_4` | Estado global con Zustand |
| `semana_5` | Axios, adaptador REST educativo, TanStack Query y viajes |
| `semana_6` | Formularios reutilizables, React Hook Form y Zod; crear/editar conductores |
| `semana_7` | MMKV para preferencias, AsyncStorage para caché offline y SecureStore para datos sensibles |
| `semana_8` | Login, registro de demostración, SecureStore, refresh 401 y OAuth PKCE opcional |
| `semana_9` | Animated API, interpolación, spring/decay y LayoutAnimation |

## Acceso de práctica

- Usuario: `emilys`
- Contraseña: `emilyspass`

El login consulta DummyJSON. El API de taxis es un adaptador local de demostración, no un backend real. El alta en `/users/add` de DummyJSON también es de demostración y no crea una cuenta persistente. Consulta `docs/ALCANCE_Y_LIMITACIONES.md`.

## Material de apoyo

- `GUIA_ENTREGA_SEMANAS_1_A_9.md`: objetivos, recorridos y evidencias para verificar manualmente.
- Cada carpeta semanal tiene su propio `README.md`.
- `docs/MMKV_EJEMPLO_NATIVO.md`: requisito del build nativo para MMKV.
