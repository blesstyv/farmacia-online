# 💊 Farmacia Online Académica

Proyecto desarrollado para la asignatura **Base de Datos No Estructurados** de la carrera Analista Programador.

La aplicación corresponde a una farmacia online simulada que permite visualizar medicamentos, registrarse, iniciar sesión, administrar productos mediante un panel de administrador y generar compras simuladas con carrito y boleta digital. Toda la información es almacenada en **MongoDB Atlas** y la aplicación se encuentra desplegada en la nube utilizando **Render** y **Vercel**.

---

# Integrantes

- Javier Guglielmini
- Catalina Grohmann
- Natalia Matamala

---

# Tecnologías utilizadas

## Frontend

- React
- Vite
- React Router DOM
- Context API
- CSS

## Backend

- Node.js
- Express
- Mongoose
- JWT
- bcrypt
- cors
- dotenv

## Base de datos

- MongoDB Atlas

## Despliegue

- Render
- Vercel

## Gestión del proyecto

- Git
- GitHub
- Jira (Scrum)

---

# Arquitectura

```
Usuario
     │
     ▼
Frontend (React + Vite)
     │
     ▼
API REST (Express)
     │
     ▼
MongoDB Atlas
```

El frontend consume los servicios REST publicados por el backend, el cual realiza todas las operaciones sobre la base de datos MongoDB Atlas.

---

# Funcionalidades

## Cliente

- Registro de usuarios.
- Inicio de sesión.
- Visualización del catálogo.
- Búsqueda de medicamentos.
- Carrito de compras.
- Compra simulada.
- Boleta digital.
- Visualización del stock disponible.

## Administrador

- Inicio de sesión.
- Panel administrativo.
- Crear productos.
- Editar productos.
- Activar o desactivar productos.
- Actualizar stock.
- Actualizar precio.
- Actualizar imágenes.
- Administrar medicamentos que requieren receta.

---

# Base de datos

La aplicación utiliza una base de datos NoSQL llamada:

```
farmacia_online
```

Colecciones principales:

- users
- products
- orders

---

# Estructura del proyecto

```
farmacia-online
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   └── app.js
│   │
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   │   └── productos
│   │
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# Variables de entorno

## Backend

```
PORT=

NODE_ENV=

MONGODB_URI=

DB_NAME=

JWT_SECRET=

FRONTEND_URL=
```

## Frontend

```
VITE_API_URL=
```

Las credenciales reales no se almacenan en el repositorio por razones de seguridad.

---

# Instalación local

## Clonar el proyecto

```bash
git clone https://github.com/blesstyv/farmacia-online.git
```

Ingresar al proyecto

```bash
cd farmacia-online
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Frontend

Abrir otra terminal.

```bash
cd frontend

npm install

npm run dev
```

---

# Despliegue

## Frontend

Vercel

https://farmacia-online-tan.vercel.app

---

## Backend

Render

https://farmacia-online.onrender.com

---

## Endpoint de prueba

```
GET /api/health
```

Respuesta esperada

```json
{
   "ok": true,
   "message": "Backend de Farmacia Online funcionando correctamente"
}
```

---

# API

## Productos

```
GET /api/products
```

Obtiene el catálogo.

---

```
POST /api/products
```

Crear producto.

---

```
PUT /api/products/:id
```

Editar producto.

---

```
DELETE /api/products/:id
```

Desactivar producto.

---

## Usuarios

```
POST /api/auth/register
```

Registrar usuario.

---

```
POST /api/auth/login
```

Iniciar sesión.

---

## Pedidos

```
POST /api/orders
```

Generar compra simulada.

---

# Seguridad implementada

- Contraseñas cifradas.
- JWT para autenticación.
- Variables de entorno.
- CORS configurado.
- Roles Cliente y Administrador.
- MongoDB Atlas protegido mediante cadena de conexión privada.

---

# Funcionalidades implementadas

✅ Registro

✅ Inicio de sesión

✅ JWT

✅ MongoDB Atlas

✅ CRUD de productos

✅ Panel administrador

✅ Carrito

✅ Compra simulada

✅ Boleta digital

✅ Actualización de stock

✅ Imágenes reales de medicamentos

✅ Despliegue en Render

✅ Despliegue en Vercel

---

# Estado del proyecto

Actualmente el proyecto se encuentra completamente operativo.

Se verificó el correcto funcionamiento de:

- Conexión con MongoDB Atlas.
- Backend desplegado en Render.
- Frontend desplegado en Vercel.
- Registro de usuarios.
- Inicio de sesión.
- Panel administrador.
- Administración de productos.
- Catálogo conectado a la base de datos.
- Compra simulada.
- Actualización de stock.
- Visualización de imágenes reales de medicamentos.

---

# Observaciones

Este proyecto fue desarrollado únicamente con fines académicos.

No realiza ventas reales ni procesa pagos electrónicos. La compra, la boleta y los medicamentos corresponden a una simulación para demostrar la integración entre frontend, backend y una base de datos NoSQL desplegada en la nube.
