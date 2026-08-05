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

Ejemplo: PORT=

## Ejecución

npm run dev

## Estructura del proyecto

```text
Backend-II/
│
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── dao/
│   │   └── events.dao.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   ├── repositories/
│   │   └── events.repository.js
│   ├── routes/
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── services/
│   │   ├── events.service.js
│   │   └── sessions.service.js
│   └── utils/
│       └── utils.js
│
├── .env.example
├── .gitignore
├── app.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## Endpoints disponibles

- GET /api/health - Respuesta: { "status": "ok", "message": "Servidor activo" }

- GET /api/events - Respuesta: { "status": "success", "payload": [] }

- GET /api/sessions - Respuesta: { "status": "success", "message": "Modulo de sesiones listo" }
