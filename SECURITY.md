# Política de seguridad

## Versiones soportadas

TasksFlow se distribuye como una aplicación de página única sin backend. Las
correcciones de seguridad se aplican únicamente a la última versión publicada
en la rama `main`.

| Versión | Soportada          |
| ------- | ------------------ |
| última  | :white_check_mark: |
| < última | :x:                |

## Reportar una vulnerabilidad

Si encuentras una vulnerabilidad de seguridad, por favor **no abras un issue
público**. En su lugar, repórtala de forma privada a
[andercmd@outlook.com](mailto:andercmd@outlook.com) con:

- Una descripción del problema y su impacto potencial
- Pasos para reproducirlo
- Cualquier prueba de concepto (si aplica)

Nos comprometemos a responder en un plazo razonable y a coordinar la
divulgación una vez que exista una corrección disponible.

## Alcance

TasksFlow almacena todos los datos del usuario en `localStorage` del
navegador; no existe backend, base de datos ni autenticación de usuarios. Las
vulnerabilidades más relevantes en este alcance son, por ejemplo, XSS o fallas
de sanitización en la interfaz.
