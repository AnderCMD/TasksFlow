# Guía de contribución

¡Gracias por tu interés en contribuir a TasksFlow! Esta guía te ayudará a empezar.

## Antes de empezar

- Revisa los [issues abiertos](https://github.com/AnderCMD/TasksFlow/issues) para evitar duplicar trabajo.
- Para cambios grandes o cambios de diseño, abre primero un issue para discutir el enfoque.

## Configuración del entorno

1. Haz un fork del repositorio y clónalo:
   ```bash
   git clone https://github.com/<tu-usuario>/TasksFlow.git
   cd TasksFlow
   ```
2. Instala las dependencias (se recomienda pnpm):
   ```bash
   pnpm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   pnpm run dev
   ```

## Antes de enviar un Pull Request

Ejecuta las siguientes verificaciones localmente; el mismo pipeline corre en CI:

```bash
pnpm run lint
pnpm run test
pnpm run build
```

## Convenciones del proyecto

- **Idioma del código**: todos los identificadores (variables, funciones, componentes) y comentarios deben escribirse en **inglés**. El texto visible para el usuario final (etiquetas, botones, mensajes) permanece en **español**, siguiendo el idioma actual de la interfaz.
- **Estructura**: el estado global vive en `src/Features/<dominio>/<dominio>Slice.js` (Redux Toolkit). Las páginas enrutables viven en `src/Pages/`, y los componentes reutilizables en `src/Components/`.
- **Estilos**: se usa TailwindCSS con clases utilitarias directamente en el JSX.
- **Commits**: usa mensajes claros y descriptivos que expliquen el "por qué" del cambio.

## Reportar errores o proponer funcionalidades

Usa las plantillas de issues disponibles al crear un nuevo issue en GitHub.

## Código de conducta

Este proyecto sigue el [Código de conducta](CODE_OF_CONDUCT.md). Al participar, aceptas cumplirlo.
