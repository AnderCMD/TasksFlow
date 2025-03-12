# TasksFlow - Gestión de Tareas

TasksFlow es una aplicación moderna de gestión de tareas construida con React, Redux, Vite y TailwindCSS. Permite a los usuarios crear, organizar y realizar un seguimiento de sus tareas de manera eficiente con una interfaz atractiva y fácil de usar.

![TasksFlow Screenshot](public/screenshot.png)

## 🚀 Características

- ✅ Crear, editar y eliminar tareas
- 📋 Marcar tareas como completadas
- 🔍 Filtrar tareas por estado (todas, activas, completadas)
- 🌓 Modo oscuro/claro
- 📱 Diseño responsive para dispositivos móviles y de escritorio
- 💾 Almacenamiento local (localStorage) para persistencia de datos
- ✨ Animaciones fluidas con Framer Motion
- 🎨 Interfaz de usuario moderna con TailwindCSS y MUI

## 📋 Requisitos previos

- Node.js (v18.0.0 o superior)
- npm, yarn o pnpm

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/tasksflow.git
cd tasksflow
```

2. Instalar dependencias:
```bash
# Con npm
npm install

# Con yarn
yarn

# Con pnpm
pnpm install
```

3. Iniciar el servidor de desarrollo:
```bash
# Con npm
npm run dev

# Con yarn
yarn dev

# Con pnpm
pnpm dev
```

4. Abrir [http://localhost:5173](http://localhost:5173) en el navegador.

## 🏗️ Estructura del proyecto

```
tasksflow/
├── public/                 # Archivos estáticos
├── src/                    # Código fuente
│   ├── App/                # Configuración global de la aplicación
│   │   └── store.js        # Configuración de Redux store
│   ├── Assets/             # Recursos (imágenes, iconos, etc.)
│   ├── Components/         # Componentes reutilizables
│   │   ├── Layout/         # Componentes de estructura
│   │   └── Tasks/          # Componentes específicos de tareas
│   ├── Features/           # Características con sus slices de Redux
│   │   ├── Tasks/          # Gestión de tareas
│   │   └── Theme/          # Gestión del tema
│   ├── Styles/             # Estilos globales
│   ├── App.jsx             # Componente principal
│   ├── index.css           # Estilos globales
│   └── main.jsx            # Punto de entrada
├── index.html              # Plantilla HTML
├── vite.config.js          # Configuración de Vite
├── package.json            # Dependencias y scripts
└── README.md               # Documentación
```

## 🧠 Decisiones de arquitectura

### Redux Toolkit

Se utiliza Redux Toolkit para el manejo del estado global de la aplicación, siguiendo un patrón de arquitectura basado en características (feature-based), lo que facilita la organización y el mantenimiento del código.

### Almacenamiento local

Las tareas se almacenan en el localStorage del navegador, lo que permite que los datos persistan entre sesiones sin necesidad de una base de datos o API externa.

### Modo oscuro

La aplicación incluye un sistema de temas que permite cambiar entre modo claro y oscuro, utilizando las capacidades de TailwindCSS para clases condicionales.

### Animaciones

Se utiliza Framer Motion para añadir animaciones fluidas que mejoran la experiencia de usuario al interactuar con los elementos de la interfaz.

## 🧪 Tecnologías utilizadas

- [React](https://reactjs.org/) - Biblioteca para construir interfaces de usuario
- [Redux Toolkit](https://redux-toolkit.js.org/) - Herramientas para simplificar la lógica de Redux
- [Vite](https://vitejs.dev/) - Entorno de desarrollo rápido
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS utilitario
- [MUI (Material-UI)](https://mui.com/) - Componentes de React basados en Material Design
- [Framer Motion](https://www.framer.com/motion/) - Biblioteca de animaciones para React

## 🔍 Mejoras futuras

- Integración con backend para sincronización de datos entre dispositivos
- Sistema de autenticación de usuarios
- Categorías y etiquetas para organizar tareas
- Vista de calendario para programar tareas
- Notificaciones y recordatorios
- Funcionalidad de arrastrar y soltar (drag and drop)
- Exportación e importación de datos

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

[AnderCMD](https://github.com/AnderCMD) - [andercmd@outlook.com](mailto:andercmd@outlook.com)

---

¡Gracias por utilizar TasksFlow! Esperamos que esta herramienta te ayude a organizar tus tareas de manera eficiente. Si tienes alguna sugerencia o encuentras algún problema, no dudes en abrir un issue en GitHub.
