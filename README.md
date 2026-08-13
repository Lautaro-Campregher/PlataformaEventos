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
- Cookie Parser
- Json Web Token (JWT)

## Instalación

1. Clonar el repositorio.
2. Ejecutar npm install.

## Variables de entorno

Crear un archivo .env utilizando .env.example como referencia.

Ejemplo:

```env
PORT=
MONGO_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
NODE_ENV=
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
│       ├── hash.js
│       └── jwt.js
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

| Método | Path                     | Descripción                                                    |
| ------ | ------------------------ | -------------------------------------------------------------- |
| GET    | `/api/health`            | Verifica que el servidor se encuentre activo.                  |
| GET    | `/api/events`            | Obtiene la lista de eventos disponibles.                       |
| POST   | `/api/sessions/register` | Registra un nuevo usuario de forma segura.                     |
| POST   | `/api/sessions/login`    | Autentica un usuario y genera un JWT almacenado en una cookie. |
| GET    | `/api/sessions/current`  | Obtiene los datos del usuario autenticado mediante la cookie.  |
| POST   | `/api/sessions/logout`   | Cierra la sesión y elimina la cookie de autenticación.         |

### GET /api/health

Verifica que el servidor se encuentre activo.

**Response `200`:**

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

---

### GET /api/events

Obtiene la lista de eventos disponibles.

**Response `200`:**

```json
{
  "status": "success",
  "payload": []
}
```

---

### POST /api/sessions/register

Registra un nuevo usuario.

El email es normalizado mediante `trim` y `lowercase`. La contraseña es hasheada mediante `bcrypt` antes de almacenarse en MongoDB.

El campo `role` no se recibe desde el registro público y se asigna automáticamente con el valor `user`.

**Request:**

```json
{
  "first_name": "Ana",
  "last_name": "Marquez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

**Response `201` — Registro exitoso:**

```json
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
```

**Response `400` — Campos incompletos o faltantes:**

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

**Response `400` — Email inválido:**

```json
{
  "status": "error",
  "message": "Email inválido"
}
```

**Response `400` — Contraseña inválida:**

```json
{
  "status": "error",
  "message": "La contraseña debe tener al menos 8 caracteres"
}
```

**Response `409` — Email ya registrado:**

```json
{
  "status": "error",
  "message": "El email ya esta registrado"
}
```

---

### POST /api/sessions/login

Autentica un usuario mediante email y contraseña.

Si las credenciales son correctas, genera un JWT utilizando `JWT_SECRET` y lo almacena en la cookie `currentUser`.

La cookie se configura como `HttpOnly`, `SameSite: lax` y con una duración de una hora.

**Request:**

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

**Response `200` — Login exitoso:**

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

Además de la respuesta, se establece la cookie:

```text
currentUser
```

conteniendo el JWT generado.

**Response `401` — Credenciales inválidas:**

```json
{
  "status": "error",
  "message": "Credenciales invalidas"
}
```

El mismo mensaje se devuelve tanto cuando el email no existe como cuando la contraseña es incorrecta.

---

### GET /api/sessions/current

Ruta protegida mediante middleware de autenticación.

Lee la cookie `currentUser`, verifica el JWT y devuelve los datos del usuario autenticado.

La respuesta no incluye la contraseña.

**Response `200` — Usuario autenticado:**

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

**Response `401` — Sin cookie o token inválido/expirado:**

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

---

### POST /api/sessions/logout

Cierra la sesión eliminando la cookie `currentUser`.

**Response `200` — Sesion finalizada:**

```json
{
  "status": "success",
  "message": "Sesion finalizada"
}
```

Después de realizar el logout, una solicitud a `/api/sessions/current` sin una cookie válida devuelve:

**Response `401`:**

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

## Evidencia de funcionamiento

A continuación se presentan capturas de Postman que muestran el funcionamiento del sistema de autenticación mediante JWT y cookies.

### 1. Login exitoso

**POST `/api/sessions/login`**

El login devuelve `200 OK` y genera la cookie `currentUser` con el JWT de autenticación.

![Login exitoso](./capturas/Login.png)

---

### 2. Current — Usuario autenticado

**GET `/api/sessions/current`**

La ruta protegida verifica la cookie `currentUser` y devuelve los datos del usuario autenticado.

**Response `200 OK`:**

![Current autenticado](./capturas/Current.png)

---

### 3. Logout

**POST `/api/sessions/logout`**

El logout elimina la cookie `currentUser` y finaliza la sesión.

**Response `200 OK`:**

![Logout](./capturas/Logout.png)

---

### 4. Current — Sin autenticación

**GET `/api/sessions/current`**

Luego de cerrar sesión, se intenta acceder nuevamente a la ruta protegida sin una cookie válida.

El servidor rechaza la solicitud correctamente.

**Response `401 Unauthorized`:**

![Current sin autenticación](./capturas/Current401.png)
