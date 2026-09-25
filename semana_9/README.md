# Proyecto de la cooperativa · Semana 9: Animaciones básicas

App integrada de las semanas 1–9, con conductores, viajes, vehículos, ingresos, preferencias, perfil/autenticación y laboratorio Animated API. Los formularios de acceso están en blanco y se quitaron los datos de login de demostración.

## Alcance de este punto de control
Esta app está pensada como una versión incremental de la app de la semana anterior. No es una copia idéntica de la app final en todas las semanas. El starter de la semana 9 toma como base la app integrada publicada por Jose y contiene el acumulado final.

## Ejecutar
Abre una terminal EN ESTA carpeta (`3-proyecto/starter`) y ejecuta:

```powershell
pnpm install
pnpm exec expo start --clear
```

Pulsa `w` para abrir la versión web. Para validar TypeScript:

```powershell
pnpm typecheck
```

Cada semana tiene su propio `package.json`, lockfile y recursos locales. No requiere imports fuera de esta carpeta. No copies `node_modules`, cachés Expo, archivos `.env` ni credenciales al entregar.

## Verificación de la semana
Abre el login con campos vacíos, crea/usa una cuenta mediante el flujo de demostración, navega a los módulos, y prueba las operaciones locales. El endpoint de registro de DummyJSON es una simulación y no guarda una cuenta persistente.
