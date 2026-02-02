# 🏨 StayLimon API

API REST construida con **Express.js** conectada a **MSSQL** para el sistema de hotel StayLimon.

---

## 📁 Estructura del proyecto

```
api/
├── config/
│   └── db.js                  # Conexión al pool de MSSQL + helpers
├── src/
│   ├── middleware/
│   │   └── errorHandler.js    # Manejo centralizado de errores
│   └── routes/
│       ├── hotel.js           # CRUD Hotel
│       ├── cliente.js         # CRUD Cliente
│       ├── habitacion.js      # CRUD Habitación
│       ├── actividad.js       # CRUD Actividad
│       ├── reservacion.js     # CRUD Reservación
│       └── factura.js         # Facturas (GET + POST)
├── app.js                     # Configuración de Express + rutas
├── server.js                  # Punto de entrada
└── package.json
```

---

## ⚙️ Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar credenciales (config/db.js)

Abre `config/db.js` y ajusta los valores según tu entorno:

```js
userName: 'admin1',       // usuario SQL Server
password: '12345678',     // contraseña
server:   'localhost',    // IP o nombre del servidor
database: 'StayLimon',   // nombre de la base de datos
port:     1433            // puerto (default MSSQL)
```

### 3. Iniciar el servidor

```bash
# Producción
npm start

# Desarrollo (con recarga automática)
npm run dev
```

---

## 📋 Endpoints disponibles

### 🏨 Hotel — `/api/hotel`

| Método | Ruta            | Descripción              | SP / Vista         |
|--------|-----------------|---------------------------|--------------------|
| GET    | `/api/hotel`    | Listar todos los hoteles  | Vista SelectHotel  |
| GET    | `/api/hotel/:id`| Obtener hotel por ID      | Vista SelectHotel  |
| POST   | `/api/hotel`    | Crear hotel               | sp_InsertarHotel   |
| PUT    | `/api/hotel/:id`| Actualizar hotel          | sp_UpdateHotel     |
| DELETE | `/api/hotel/:id`| Eliminar hotel            | sp_DeleteHotel     |

**POST /api/hotel** — Body:
```json
{
  "cedula": "123456789",
  "nombre": "Hotel Paraíso",
  "tipo": "Boutique",
  "correo": "hotel@correo.com",
  "url": "https://hotel.com",
  "gps": "10.0566, -83.5238",
  "detalleDireccion": "Calle 5, Limón Centro"
}
```

**PUT /api/hotel/:id** — Body (mismo esquema sin cedula):
```json
{
  "nombre": "Hotel Paraíso Updated",
  "tipo": "Boutique",
  "correo": "hotel@correo.com",
  "url": "https://hotel.com",
  "gps": "10.0566, -83.5238",
  "detalleDireccion": "Calle 5, Limón Centro"
}
```

---

### 👤 Cliente — `/api/cliente`

| Método | Ruta               | Descripción               | SP / Vista          |
|--------|--------------------|----------------------------|---------------------|
| GET    | `/api/cliente`     | Listar todos los clientes  | Vista SelectCliente |
| GET    | `/api/cliente/:id` | Obtener cliente por ID     | Vista SelectCliente |
| POST   | `/api/cliente`     | Crear cliente              | sp_InsertarCliente  |
| PUT    | `/api/cliente/:id` | Actualizar cliente         | sp_UpdateCliente    |
| DELETE | `/api/cliente/:id` | Eliminar cliente           | sp_DeleteCliente    |

**POST /api/cliente** — Body:
```json
{
  "cedula": "987654321",
  "nombre": "Juan",
  "apellido1": "Pérez",
  "apellido2": "López",
  "correo": "juan@correo.com",
  "tipoIdentificacion": "Cédula",
  "pais": "Costa Rica",
  "direccion": "Av. Central 100",
  "fechaNacimiento": "1990-05-15"
}
```

**PUT /api/cliente/:id** — Body:
```json
{
  "correo": "juan.nuevo@correo.com",
  "direccion": "Nueva dirección",
  "pais": "Costa Rica"
}
```

---

### 🛏️ Habitación — `/api/habitacion`

| Método | Ruta                     | Descripción                  | SP / Vista              |
|--------|--------------------------|-------------------------------|-------------------------|
| GET    | `/api/habitacion`        | Listar todas las habitaciones | Vista SelectHabitacion  |
| GET    | `/api/habitacion/:numero`| Obtener habitación por número | Vista SelectHabitacion  |
| POST   | `/api/habitacion`        | Crear habitación             | sp_InsertarHabitacion   |
| PUT    | `/api/habitacion/:numero`| Actualizar estado            | sp_UpdateHabitacion     |
| DELETE | `/api/habitacion/:numero`| Eliminar habitación          | sp_DeleteHabitacion     |

**POST /api/habitacion** — Body:
```json
{
  "numero": 101,
  "nombreTipo": "Suite"
}
```

**PUT /api/habitacion/:numero** — Body:
```json
{
  "estado": "OCUPADA"
}
```

---

### 🎭 Actividad — `/api/actividad`

| Método | Ruta                 | Descripción                | SP / Vista            |
|--------|----------------------|-----------------------------|-----------------------|
| GET    | `/api/actividad`     | Listar todas las actividades| Vista SelectActividad |
| GET    | `/api/actividad/:id` | Obtener actividad por ID    | Vista SelectActividad |
| POST   | `/api/actividad`     | Crear actividad            | sp_InsertarActividad  |
| PUT    | `/api/actividad/:id` | Actualizar actividad       | sp_UpdateActividad    |
| DELETE | `/api/actividad/:id` | Eliminar actividad         | sp_DeleteActividad    |

**POST /api/actividad** — Body:
```json
{
  "cedula": "111222333",
  "nombre": "Tour del río",
  "contacto": "555-1234",
  "correo": "tour@correo.com",
  "tipo": "Aventura",
  "descripcion": "Recorrido en bote por el río",
  "precio": 45.00,
  "detalleDireccion": "Muelle principal, Limón"
}
```

**PUT /api/actividad/:id** — Body:
```json
{
  "precio": 50.00,
  "descripcion": "Descripción actualizada",
  "detalleDireccion": "Nueva ubicación"
}
```

---

### 📅 Reservación — `/api/reservacion`

| Método | Ruta                    | Descripción                          | SP                     |
|--------|-------------------------|---------------------------------------|------------------------|
| GET    | `/api/reservacion`      | Listar todas las reservaciones        | —                      |
| GET    | `/api/reservacion/:id`  | Obtener reservación por ID            | —                      |
| POST   | `/api/reservacion`      | Crear reservación                     | sp_InsertarReservacion |
| PUT    | `/api/reservacion/:id`  | Actualizar fecha de salida            | sp_UpdateReservacion   |
| DELETE | `/api/reservacion/:id`  | Cerrar reservación (soft delete) ⚡   | sp_DeleteReservacion   |

> ⚡ **DELETE** no elimina la reservación. La cambia a estado `CERRADA`, lo cual activa automáticamente el **trigger** `TR_GenerarFactura_ReservaCerrada` que genera la factura.

**POST /api/reservacion** — Body:
```json
{
  "idCliente": 1,
  "numeroHabitacion": 101,
  "fechaIngreso": "2025-03-10T14:00:00",
  "fechaSalida": "2025-03-13T12:00:00",
  "cantidadPersonas": 2,
  "vehiculo": 1
}
```

**PUT /api/reservacion/:id** — Body:
```json
{
  "fechaSalida": "2025-03-14T12:00:00",
  "estado": "ACTIVA"
}
```

---

### 🧾 Factura — `/api/factura`

| Método | Ruta              | Descripción                        | SP                  |
|--------|-------------------|------------------------------------|---------------------|
| GET    | `/api/factura`    | Listar todas las facturas          | —                   |
| GET    | `/api/factura/:id`| Obtener factura por ID             | —                   |
| POST   | `/api/factura`    | Crear factura manualmente          | sp_InsertarFactura  |

> El SP `sp_InsertarFactura` calcula automáticamente las **noches** y el **total** basándose en la reservación.

**POST /api/factura** — Body:
```json
{
  "idReserva": 1,
  "cargos": 25.00,
  "metodoPago": 1
}
```

---

## ✅ Respuestas estándar

**Éxito:**
```json
{ "success": true, "data": [...] }
{ "success": true, "message": "..." }
```

**Error:**
```json
{ "success": false, "error": "Descripción del error" }
```
