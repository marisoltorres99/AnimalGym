# README.md

````md
# Proyecto React + Vite

Este proyecto fue generado a partir de un diseño realizado en Figma.

## Tecnologías principales

- React
- Vite
- TypeScript
- Tailwind CSS
- Material UI
- shadcn/ui

## Requisitos

Tener instalado:

- Node.js
- npm

Versiones utilizadas actualmente:

```bash
node v20.18.0
npm 10.8.2
````

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar a la carpeta del proyecto:

```bash
cd nombre-del-proyecto
```

Instalar dependencias:

```bash
npm install
```

## Ejecutar el proyecto

Iniciar servidor de desarrollo:

```bash
npm run dev
```

Luego abrir en el navegador la URL mostrada por Vite.

Generalmente:

```bash
http://localhost:5173
```

## Estructura inicial del proyecto

```text
src/                -> Código fuente principal
index.html          -> Punto de entrada HTML
vite.config.ts      -> Configuración de Vite
package.json        -> Dependencias y scripts
postcss.config.mjs  -> Configuración PostCSS
```

## Scripts disponibles

```bash
npm run dev     # Ejecuta entorno de desarrollo
npm run build   # Genera versión de producción
```

## Notas

* El proyecto utiliza Vite como entorno de desarrollo.
* React se monta en el elemento con id `root` dentro de `index.html`.
* El punto de entrada principal de React es `src/main.tsx`.

## Dependencias importantes

### UI y estilos

* Material UI
* Tailwind CSS
* Radix UI
* shadcn/ui
* Lucide React

### Desarrollo

* Vite
* TypeScript
* Plugin React para Vite

## Créditos

El proyecto original fue generado desde Figma.

Algunos componentes utilizados pertenecen a shadcn/ui bajo licencia MIT.

````

---

# .gitignore

```gitignore
# dependencies
node_modules/

# production
/dist

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# editor files
.vscode/
.idea/
*.swp
*.swo

# operating system files
.DS_Store
Thumbs.db

# vite
vite.config.ts.timestamp-*

# build cache
.cache/
.temp/

# TypeScript
*.tsbuildinfo
````

---

# Recomendaciones de entorno de desarrollo

## Editor recomendado

Visual Studio Code.

## Extensiones recomendadas

### React / TypeScript

* ES7+ React/Redux/React-Native snippets
* TypeScript Hero

### Calidad de código

* ESLint
* Prettier

### Tailwind

* Tailwind CSS IntelliSense

### Utilidades

* Error Lens
* GitLens
* Auto Rename Tag
* Path Intellisense

## Terminal recomendada

* PowerShell
* Git Bash

## Herramientas útiles para más adelante

### React DevTools

Extensión del navegador para inspeccionar:

* componentes,
* props,
* estados,
* renderizado.

## Próximos pasos sugeridos

1. Ejecutar correctamente el proyecto.
2. Analizar `src/main.tsx`.
3. Entender cómo React renderiza la aplicación.
4. Revisar estructura de componentes.
5. Aprender:

   * JSX
   * props
   * hooks
   * estado
   * eventos
   * renderizado condicional
   * manejo de estilos
   * rutas
