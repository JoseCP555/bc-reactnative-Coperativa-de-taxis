# Cooperativa de Taxis — Semanas 1 a 5

Este es el mismo proyecto Expo/TypeScript reorganizado por los temas de cada semana. La app sigue siendo una sola aplicación integrada: sus módulos están bajo `semana_1` a `semana_5`, y `App.tsx` los conecta para ejecutar la versión final. No son cinco proyectos duplicados.

- `semana_1`: pantalla de inicio, tarjetas y recursos visuales locales.
- `semana_2`: listado de conductores, formulario y tipos compartidos.
- `semana_3`: navegación Stack y tipado de rutas.
- `semana_4`: store global con Zustand.
- `semana_5`: pantalla de viajes, servicio simulado y TanStack Query.

## Ejecutar
Desde esta carpeta raíz:

```powershell
pnpm install
pnpm exec expo start --clear
```

Presiona `w` para abrir en navegador. Se conservó el nombre y la configuración de la app. `node_modules` y `.expo` están excluidos por `.gitignore`.
