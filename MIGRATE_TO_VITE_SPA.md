# Fetrue → Vite + React SPA pura (para Capacitor)

Esta plantilla de Lovable usa **TanStack Start** (SSR/serverless en Cloudflare Workers). Eso impide generar un `index.html` estático tradicional. Para empaquetar Fetrue como APK/IPA con **Capacitor**, lo más limpio es migrar el código a un proyecto **Vite + React** puro en tu máquina local.

Este documento te da los pasos exactos y la lista de archivos a copiar.

---

## 1. Crear el proyecto Vite local

En tu máquina (Node 20+):

```bash
npm create vite@latest fetrue -- --template react-ts
cd fetrue
npm install
npm install -D tailwindcss@4 @tailwindcss/vite
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
```

---

## 2. Configuración base

### `vite.config.ts`
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  base: "./", // CRÍTICO para Capacitor (rutas relativas)
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: { outDir: "dist" },
});
```

### `tsconfig.json` — añade el alias:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

### `index.html` (en la raíz del proyecto)
```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/jpeg" href="/fetrue-logo.jpg" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#1e2a55" />
    <title>Fetrue — Marcando la diferencia en tu vida</title>
    <meta name="description" content="Fe, verdades diarias y crecimiento personal. Racha de 7 días, retos y reflexiones." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `src/main.tsx`
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 3. Archivos a COPIAR desde este proyecto Lovable

Copia estos archivos tal cual, respetando rutas:

| Origen (este proyecto) | Destino (proyecto Vite local) |
|---|---|
| `src/styles.css` | `src/styles.css` |
| `src/data/content.ts` | `src/data/content.ts` |
| `src/lib/streak.ts` | `src/lib/streak.ts` |
| `src/assets/gallery-sunrise.jpg` | `src/assets/gallery-sunrise.jpg` |
| `src/assets/gallery-growth.jpg` | `src/assets/gallery-growth.jpg` |
| `src/assets/gallery-horizon.jpg` | `src/assets/gallery-horizon.jpg` |
| `src/assets/gallery-mountain.jpg` | `src/assets/gallery-mountain.jpg` |
| Logo Fetrue (descárgalo del proyecto) | `public/fetrue-logo.jpg` **y** `src/assets/fetrue-logo.jpg` |
| `src/routes/index.tsx` | **renombra a** `src/App.tsx` (ver paso 4) |

> El archivo `src/assets/fetrue-logo.jpg.asset.json` **NO** lo copies — es propio de Lovable. En Vite importa el JPG directamente.

---

## 4. Convertir `src/routes/index.tsx` → `src/App.tsx`

Abre el archivo copiado y haz **3 cambios**:

1. **Borra** las dos primeras líneas (TanStack):
   ```ts
   // ❌ ELIMINAR
   import { createFileRoute } from "@tanstack/react-router";
   ```

2. **Cambia el import del logo:**
   ```ts
   // ❌ ELIMINAR
   import logo from "@/assets/fetrue-logo.jpg.asset.json";
   // ✅ REEMPLAZAR POR
   import logo from "@/assets/fetrue-logo.jpg";
   ```
   Y donde se use `logo.src` o `logo.url`, cámbialo a solo `logo`.

3. **Borra el bloque `Route`** y exporta el componente como default:
   ```tsx
   // ❌ ELIMINAR
   export const Route = createFileRoute("/")({
     head: () => ({ ... }),
     component: FetrueApp,
   });

   // ✅ REEMPLAZAR la firma del componente
   export default function FetrueApp() { ... }
   ```

---

## 5. Tailwind v4

`src/styles.css` ya empieza con `@import "tailwindcss";` y define los tokens. Funciona idéntico en Vite v4 con `@tailwindcss/vite` — no necesitas `tailwind.config.js`.

---

## 6. Build estático

```bash
npm run build
```

Resultado: `dist/index.html` + `dist/assets/*` con rutas relativas (`./assets/...`). Eso es lo que Capacitor empaqueta.

---

## 7. Capacitor (Android)

```bash
npx cap init Fetrue com.fetrue.app --web-dir=dist
npx cap add android
npx cap sync
npx cap open android
```

En Android Studio: **Build > Build APK** → tu `.apk` está en `android/app/build/outputs/apk/debug/`.

Para iOS: `npx cap add ios && npx cap open ios` (requiere macOS + Xcode).

---

## 8. Por qué no se puede hacer aquí en Lovable

La plantilla Lovable bloquea reemplazar el framework base. El plugin `@lovable.dev/vite-tanstack-config` fuerza TanStack Start + Nitro (Cloudflare Workers), y la opción `spa.enabled: true` que probamos **no** genera `index.html` estático en este sandbox. Por eso la migración debe hacerse en tu máquina con Vite puro — donde tienes control total del bundler y la salida es 100% estática.

---

## Checklist final

- [ ] `dist/index.html` existe tras `npm run build`
- [ ] Abriendo `dist/index.html` directo en el navegador, la app carga (rutas relativas OK)
- [ ] `npx cap sync` no muestra errores
- [ ] APK instalada en el teléfono abre sin pantalla en blanco

Listo: control total, build estático, Capacitor feliz.
