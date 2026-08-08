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
- Postman
- MongoDB Compass
- Bcrypt

## Instalación

1. Clonar el repositorio.
2. Ejecutar npm install.

## Variables de entorno

Crear un archivo .env utilizando .env.example como referencia.

Ejemplo:

```env
PORT=
MONGO_URL=
```

## Ejecución

npm run dev

## Estructura del proyecto

```text
Backend-II/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   │
│   ├── dao/
│   │   ├── events.dao.js
│   │   └── users.dao.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   │
│   ├── repository/
│   │   ├── events.repository.js
│   │   └── user.repository.js
│   │
│   ├── routes/
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   │
│   ├── services/
│   │   ├── events.service.js
│   │   └── sessions.service.js
│   │
│   └── utils/
│       └── hash.js
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

- POST /api/sessions/register - Respuesta Exitosa:
  HTTP 201 Created

  {
  "status": "success",
  "payload": {
  "id": "665f2a...",
  "first_name": "Ana",
  "last_name": "Marquez",
  "email": "ana@mail.com",
  "role": "user"
  }
  }

  HTTP 409 Conflict - Email ya registrado
  {"status": "error","message": "El email ya está registrado"}

  HTTP 400 Bad Request - Campos incompletos o faltantes
  {"status": "error","message": "Faltan campos obligatorios"}

  HTTP 400 Bad Request - Contraseña invalida
  {"status": "error", "message": "La contraseña debe tener al menos 8 caracteres"}

  HTTP 400 Bad Request - Email invalido
  {"status": "error","message": "Email inválido"}
