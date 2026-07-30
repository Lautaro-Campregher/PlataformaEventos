# Plataforma de Eventos

## Descripción

API REST para la gestión de eventos y sesiones, desarrollada como proyecto de Backend II.

## Tecnologías

- Node.js
- Express
- Dotenv
- Nodemon
- JavaScript (ES Modules)
- Mongoose (utilizado para la definición de los modelos)

## Instalación

1. Clonar el repositorio.
2. Ejecutar npm install.

## Variables de entorno

Crear un archivo .env utilizando .env.example como referencia.

## Ejecución

npm run dev

## Estructura del proyecto

src/

- app.js
- server.js
- config/
- controllers/
- services/
- repositories/
- dao/
- models/
- middlewares/
- routes/
- utils/

## Endpoints disponibles

GET /api/health

GET /api/events

GET /api/sessions
