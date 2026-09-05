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

El servidor se ejecuta por defecto en el puerto `8080`.

```bash
npm run dev
```

## Seed de usuarios

El proyecto incluye un seed para crear usuarios de prueba con diferentes roles.

Para ejecutarlo:

`npm run seed:users`

El seed crea los siguientes usuarios:

Email Password Rol
user@example.com 123456 user
organizer@example.com 123456 organizer
organizer2@example.com 123456 organizer
admin@example.com 123456 admin

Si un usuario ya existe, el seed no lo duplica.

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

## Middleware reutilizable de Passport

Se implementó un middleware reutilizable para centralizar el manejo de la autenticación mediante Passport.js.

Ubicación:

`src/middlewares/passportMiddleware.js`

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

## Middleware de autenticación y autorización

La aplicación utiliza middlewares reutilizables para controlar el acceso a las rutas protegidas.

### Authentication Middleware

Ubicación:

`src/middlewares/authenticationMiddleware.js`

Este middleware verifica la existencia y validez del JWT almacenado en la cookie `currentUser`.

Si el token es válido, el usuario autenticado queda disponible en:

`req.user`

Si no existe una sesión válida, la API responde con:

`401 Unauthorized`

### Authorization Middleware

Ubicación:

`src/middlewares/authorizeRoleMiddleware.js`

Este middleware recibe los roles permitidos para una determinada ruta.

Ejemplo:

`authorizeRoles(["organizer", "admin"])`

Si el usuario está autenticado pero no posee uno de los roles permitidos, la API responde:

`403 Forbidden`

con el mensaje:

`No tenés permisos para realizar esta acción`

## Estructura del proyecto

```text
Backend-II/
│
├── src/
│   │
│   ├── config/
│   │   ├── database.js
│   │   └── passport.config.js
│   │
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   │
│   ├── dao/
│   │   ├── events.dao.js
│   │   └── users.dao.js
│   │
│   ├── dto/
│   │   └── user.dto.js
│   │
│   ├── middlewares/
│   │   ├── authenticationMiddleware.js
│   │   ├── authorizeEventOwnerOrAdmin.js
│   │   ├── authorizeRoleMiddleware.js
│   │   └── passportMiddleware.js
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
│   │   ├── admin.router.js
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   │
│   ├── seed/
│   │   └── seed.users.js
│   │
│   ├── services/
│   │   ├── events.service.js
│   │   ├── sessions.service.js
│   │   └── user.services.js
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

## Roles y permisos

La aplicación utiliza tres roles:

- user
- organizer
- admin

| Acción                                   | user | organizer | admin |
| ---------------------------------------- | :--: | :-------: | :---: |
| Registrarse                              |  ✅  |     —     |   —   |
| Iniciar sesión                           |  ✅  |    ✅     |  ✅   |
| Consultar eventos publicados             |  ✅  |    ✅     |  ✅   |
| Crear eventos                            |  ❌  |    ✅     |  ✅   |
| Modificar sus propios eventos            |  ❌  |    ✅     |  ✅   |
| Modificar eventos de otros organizadores |  ❌  |    ❌     |  ✅   |
| Consultar usuario actual                 |  ✅  |    ✅     |  ✅   |
| Acceder a `/api/admin/users`             |  ❌  |    ❌     |  ✅   |

## Ownership de eventos

Los eventos poseen un campo organizer que referencia al usuario propietario:

```json
organizer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
```

CEl campo `role` no se recibe desde el registro público.

Todo usuario registrado públicamente recibe automáticamente el rol:

`user`

Por lo tanto, un cliente no puede registrarse públicamente como `organizer` o `admin`.

El propietario no se obtiene desde el body de la petición.

Para modificar un evento se utiliza el middleware:

`src/middlewares/authorizeEventOwnerOrAdmin.js`

Este middleware verifica:

- Si el usuario es admin, puede modificar cualquier evento.

- Si el usuario es organizer, solamente puede modificar sus propios eventos.

- Si un organizer intenta modificar un evento perteneciente a otro organizer, recibe 403 Forbidden.

## Diferencia entre 401 y 403

401 Unauthorized

Se devuelve cuando el usuario no posee una sesión válida.

Ejemplos:

- No existe la cookie currentUser.
- El JWT es inválido.
- El JWT está expirado.
- El JWT fue manipulado.

Ejemplo:

```json
{
  "status": "error",
  "message": "Token inválido o manipulado"
}
```

403 Forbidden

Se devuelve cuando el usuario está correctamente autenticado, pero no tiene permisos suficientes para realizar la acción.

Ejemplo:

```json
{
  "status": "error",
  "message": "No tenés permisos para realizar esta acción"
}
```

## Endpoints disponibles

| Método | Path                     | Autenticación | Rol                         | Descripción                          |
| ------ | ------------------------ | ------------- | --------------------------- | ------------------------------------ |
| GET    | `/api/health`            | Pública       | —                           | Verifica que el servidor esté activo |
| GET    | `/api/events`            | Pública       | —                           | Obtiene los eventos                  |
| POST   | `/api/events`            | Sí            | organizer/admin             | Crea un evento                       |
| GET    | `/api/events/:eventId`   | Sí            | Cualquier rol               | Obtiene un evento                    |
| PUT    | `/api/events/:eventId`   | Sí            | organizer/admin + ownership | Modifica un evento                   |
| POST   | `/api/sessions/register` | Pública       | —                           | Registra un usuario                  |
| POST   | `/api/sessions/login`    | Pública       | —                           | Inicia sesión                        |
| GET    | `/api/sessions/current`  | Sí            | Cualquier rol               | Obtiene el usuario autenticado       |
| POST   | `/api/sessions/logout`   | Pública       | —                           | Cierra la sesión                     |
| GET    | `/api/admin/users`       | Sí            | admin                       | Ruta exclusiva para administradores  |

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

### POST /api/events

Permite crear eventos.

La ruta requiere autenticación y los únicos roles autorizados son:

`organizer`
`admin`

El propietario del evento se obtiene automáticamente desde el usuario autenticado.

El campo `organizer` no debe enviarse desde el cliente.

Cuando un usuario con rol `organizer` o `admin` crea un evento, el propietario se obtiene desde `req.user.id`.

Request:

```json
{
  "name": "Evento de prueba",
  "date": "2026-09-20",
  "capacity": 100
}
```

Si la solicitud no posee una sesión válida:

`401 Unauthorized`

Si el usuario está autenticado pero posee el rol `user`:

`403 Forbidden`

Si el usuario posee rol `organizer` o `admin`:

`201 Created`

---

### GET /api/events/:eventId

Permite consultar un evento específico.

La ruta requiere una sesión válida.

Los tres roles pueden acceder:

user
organizer
admin

---

### PUT /api/events/:eventId

Permite modificar un evento.

La ruta requiere:

Autenticación.
Rol organizer o admin.
Si el usuario es organizer, debe ser propietario del evento.

Un admin puede modificar cualquier evento.

Un organizer solamente puede modificar sus propios eventos.

Si un organizer intenta modificar el evento de otro organizer, recibe:

403 Forbidden

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
  "message": "Credenciales inválidas"
}
```

El mismo mensaje se devuelve tanto cuando el email no existe como cuando la contraseña es incorrecta.

---

### GET /api/sessions/current

Ruta protegida mediante la estrategia `current` de Passport JWT.

Lee la cookie `currentUser`, extrae el JWT, verifica su firma y obtiene el usuario correspondiente.

Si la autenticación es válida, devuelve los datos públicos del usuario autenticado.

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

### GET /api/admin/users

Ruta administrativa protegida exclusivamente para usuarios con rol `admin`.

Su objetivo es verificar el acceso restringido mediante autorización por roles.

Un usuario con rol `user` recibe:

`403 Forbidden`

Un usuario con rol `organizer` recibe:

`403 Forbidden`

Un usuario con rol `admin` recibe:

`200 OK`

**Response `200`:**

```json
{
  "status": "success",
  "message": "Solo un admin puede ver la lista completa de usuarios",
  "role": "admin"
}
```

## Pruebas realizadas con Postman

Se realizaron pruebas para verificar autenticación, autorización, roles y ownership.

### Autenticación

Login de usuario → 200 OK
/api/sessions/current con sesión válida → 200 OK
/api/sessions/current sin sesión válida → 401 Unauthorized
Logout → eliminación de la cookie de autenticación

### Roles

user intentando crear un evento → 403 Forbidden
organizer creando un evento → 201 Created
organizer accediendo a ruta administrativa → 403 Forbidden
admin accediendo a ruta administrativa → 200 OK

### Ownership

organizer modificando su propio evento → 200 OK
organizer2 intentando modificar un evento de organizer → 403 Forbidden
admin modificando un evento perteneciente a otro organizer → 200 OK

Estas pruebas permiten verificar el funcionamiento de los middlewares de autenticación, autorización por roles y control de propiedad de recursos.

- POST `/api/events` sin autenticación → `401 Unauthorized`
- GET `/api/sessions/current` sin sesión → `401 Unauthorized`
- GET `/api/sessions/current` con sesión válida → `200 OK`
- PUT `/api/events/:eventId` por organizer propietario → `200 OK`
- PUT `/api/events/:eventId` por otro organizer → `403 Forbidden`
- PUT `/api/events/:eventId` por admin → `200 OK`

## Seguridad

Se aplicaron las siguientes medidas:

- Contraseñas almacenadas mediante hash con Bcrypt.
- JWT firmado mediante una clave secreta definida en JWT_SECRET.
- JWT almacenado en cookie HttpOnly.
- Cookie configurada con SameSite: lax.
- Cookie configurada como Secure en producción.
- No se devuelve la contraseña en las respuestas de la API.
- Se utiliza UserDTO para exponer únicamente los datos necesarios.
- Las credenciales inválidas utilizan mensajes genéricos.
- El archivo .env no se incluye en el repositorio.
- Las credenciales sensibles no se almacenan en el código fuente.

## Preparación para providers externos

La configuración de Passport se encuentra centralizada en:

`src/config/passport.config.js`

Esta estructura permite incorporar nuevas estrategias de autenticación sin modificar app.js.

El sistema queda preparado para incorporar futuros providers externos, como:

- GitHub
- Google
- Otros proveedores OAuth

La incorporación de nuevas estrategias puede realizarse dentro de passport.config.js, manteniendo separada la configuración de Passport del resto de la aplicación.
