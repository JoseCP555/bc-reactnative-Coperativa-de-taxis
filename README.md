# Cooperativa de Taxis — proyectos por semana

Cada carpeta `semana_1` a `semana_9` es un proyecto Expo independiente. Entra a la carpeta de la semana que quieras ejecutar y usa:

```powershell
pnpm install
pnpm exec expo start --clear
```

Se requiere Node.js 22 o compatible y pnpm. Los archivos `pnpm-lock.yaml` pertenecen a cada proyecto. No se incluye `node_modules`; se genera con `pnpm install`.

La semana 9 reúne la aplicación completa. La semana 7 incluye MMKV y para esa parte se requiere un development build de Android; Expo Go no contiene ese módulo nativo.
