# Plataforma de Eventos

## Descripción

API REST para la gestión de eventos y sesiones, desarrollada como proyecto de Backend II.

El proyecto implementa una arquitectura basada en capas, utilizando Controllers, Services, DAOs y Repositories para separar responsabilidades.

La autenticación fue refactorizada utilizando Passport.js, centralizando las estrategias de registro, login y usuario actual.

La API mantiene el uso de JWT y cookies HTTP Only para la autenticación.

## Tecnologías

- Node.js
- Express
- JavaScript (ES Modules)
- Dotenv
- Nodemon
- Mongoose
- MongoDB
- MongoDB Compass
- Bcrypt
- Passport.js
- Passport Local
- Passport JWT
- Cookie Parser
- JSON Web Token (JWT)
- Postman

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

## Autenticación con Passport.js

La autenticación de la aplicación está centralizada mediante Passport.js.

Las estrategias se encuentran definidas en:

`src/config/passport.config.js`

Actualmente se implementan tres estrategias:

- register
- login
- current

Passport se inicializa en app.js mediante:

`passport.initialize()`

- Las rutas de sesiones delegan la autenticación en Passport mediante un middleware reutilizable que encapsula passport.authenticate() y permite controlar las respuestas de error de la API.

### Estrategia register

La estrategia register utiliza Passport Local.

Se encarga de procesar el registro de usuarios y delega la persistencia y lógica de negocio correspondiente al UserService.

Durante el registro se realizan las siguientes operaciones:

Validación de los campos obligatorios.
Normalización del email mediante trim() y toLowerCase().
Verificación de existencia previa del email.
Hash de la contraseña mediante Bcrypt.
Asignación automática del rol user.
Persistencia del usuario en MongoDB.
El usuario registrado queda disponible en req.user.

El rol no es recibido desde el registro público.

### Estrategia login

La estrategia login utiliza Passport Local.

Se encarga de validar las credenciales del usuario:

- Normaliza el email.
- Busca el usuario mediante el DAO.
- Verifica la contraseña mediante Bcrypt.
- Rechaza credenciales incorrectas.

Cuando la autenticación es exitosa, Passport coloca el usuario autenticado en:

- req.user

La generación del JWT no pertenece a Passport.

Luego de una autenticación exitosa, el controller de login genera el JWT y lo almacena en la cookie currentUser.

### Estrategia current

La estrategia current utiliza Passport JWT.

El JWT se obtiene desde la cookie:

`currentUser`

La estrategia:

- Extrae el JWT desde la cookie.
- Verifica la firma utilizando JWT_SECRET.
- Valida el contenido del token.
- Busca el usuario correspondiente.
- Coloca el usuario autenticado en req.user.

Si no existe un token válido, la solicitud es rechazada con HTTP 401.

La respuesta de /current nunca incluye la contraseña del usuario.

## Middleware de autenticación

Se implementó un middleware reutilizable para centralizar el manejo de las respuestas de autenticación.

Ubicación:

`src/middlewares/passport.middleware.js`

El middleware ejecuta:

`passport.authenticate()`

y permite definir el mensaje que devuelve la API cuando la autenticación falla.

De esta manera, se evita utilizar directamente la respuesta genérica de Passport y se mantiene un formato JSON consistente.

El middleware se utiliza con las estrategias:

- register
- login
- current

Para evitar exponer información sensible del usuario, se utiliza un UserDTO.

Ubicación:

`src/dto/user.dto.js`

El DTO devuelve únicamente información pública del usuario autenticado:

```json
{
  "id": "665f2a...",
  "email": "ana@mail.com",
  "role": "user"
}
```

La contraseña nunca se incluye en las respuestas de autenticación.

## Estructura del proyecto

```text
Backend-II/
│
│
├── src/
│   │
│   ├── config/
│   │   ├── database.js
│   │   └── passport.config.js
│   │
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   │
│   ├── dao/
│   │   ├── events.dao.js
│   │   └── user.dao.js
│   │
│   ├── dto/
│   │   └── user.dto.js
│   │
│   ├── middlewares/
│   │   └── passport.middleware.js
│   │
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   │
│   ├── repositories/
│   │   ├── events.repository.js
│   │   └── user.repository.js
│   │
│   ├── routes/
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   │
│   ├── services/
│   │   ├── events.service.js
│   │   └── user.service.js
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

**Response `401` — Email ya registrado:**
Para mantener una respuesta genérica y no revelar información sobre usuarios registrados:

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
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
  "message": "Token inválido o manipulado"
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
  "message": "Token inválido o manipulado"
}
```

## Preparación para providers externos

La configuración de Passport se encuentra centralizada en:

`src/config/passport.config.js`

Esta estructura permite incorporar nuevas estrategias de autenticación sin modificar app.js.

El sistema queda preparado para incorporar futuros providers externos, como:

- GitHub
- Google
- Otros proveedores OAuth

La incorporación de nuevas estrategias puede realizarse dentro de passport.config.js, manteniendo separada la configuración de Passport del resto de la aplicación.

## Seguridad

Se aplicaron las siguientes medidas:

- Contraseñas almacenadas mediante hash con Bcrypt.
- JWT firmado mediante una clave secreta definida en JWT_SECRET.
- JWT almacenado en cookie HttpOnly.
- Cookie configurada con SameSite: lax.
- Cookie configurada como Secure en producción.
- No se devuelve la contraseña en las respuestas de la API.
- Se utiliza UserDTO para exponer únicamente los datos necesarios del usuario.
- Las credenciales inválidas utilizan un mensaje genérico.
- El archivo .env no se incluye en el repositorio.
- Las credenciales sensibles no se almacenan en el código fuente.
