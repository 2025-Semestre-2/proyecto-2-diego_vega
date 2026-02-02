CREATE DATABASE StayLimon;
GO
USE StayLimon;
GO

/* =========================
   DIRECCIÓN
========================= */
CREATE TABLE Direccion (
    idDireccion INT IDENTITY PRIMARY KEY,
    detalle VARCHAR(200) NOT NULL
);

/* =========================
   HOTEL
========================= */
CREATE TABLE Hotel (
    idHotel INT IDENTITY PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    url VARCHAR(200),
    gps VARCHAR(100),
    idDireccion INT NOT NULL,
    CONSTRAINT FK_Hotel_Direccion
        FOREIGN KEY (idDireccion) REFERENCES Direccion(idDireccion)
);

/* =========================
   TELÉFONO HOTEL
========================= */
CREATE TABLE TelefonoHotel (
    idTelefono INT IDENTITY PRIMARY KEY,
    idHotel INT NOT NULL,
    codigoPais VARCHAR(5) NOT NULL DEFAULT '+506',
    telefono VARCHAR(20) NOT NULL,
    CONSTRAINT FK_TelefonoHotel_Hotel
        FOREIGN KEY (idHotel) REFERENCES Hotel(idHotel)
);

/* =========================
   REDES SOCIALES (CATÁLOGO)
========================= */
CREATE TABLE RedSocial (
    idRedSocial INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

/* =========================
   RED SOCIAL HOTEL
========================= */
CREATE TABLE RedSocialHotel (
    idHotel INT NOT NULL,
    idRedSocial INT NOT NULL,
    enlace VARCHAR(200) NOT NULL,
    CONSTRAINT PK_RedSocialHotel PRIMARY KEY (idHotel, idRedSocial),
    CONSTRAINT FK_RSH_Hotel FOREIGN KEY (idHotel) REFERENCES Hotel(idHotel),
    CONSTRAINT FK_RSH_RedSocial FOREIGN KEY (idRedSocial) REFERENCES RedSocial(idRedSocial)
);

/* =========================
   SERVICIOS HOTEL
========================= */
CREATE TABLE ServicioHotel (
    idServicio INT IDENTITY PRIMARY KEY,
    idHotel INT NOT NULL,
    servicio VARCHAR(100) NOT NULL,
    CONSTRAINT FK_ServicioHotel_Hotel
        FOREIGN KEY (idHotel) REFERENCES Hotel(idHotel)
);

/* =========================
   TIPO HABITACIÓN
========================= */
CREATE TABLE TipoHabitacion (
    idTipo INT IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200),
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    tipo_cama VARCHAR(50) NOT NULL
);

/* =========================
   FOTO TIPO HABITACIÓN
========================= */
CREATE TABLE FotoTipoHabitacion (
    idFoto INT IDENTITY PRIMARY KEY,
    idTipo INT NOT NULL,
    foto VARCHAR(200) NOT NULL,
    CONSTRAINT FK_Foto_Tipo
        FOREIGN KEY (idTipo) REFERENCES TipoHabitacion(idTipo)
);

/* =========================
   COMODIDAD
========================= */
CREATE TABLE Comodidad (
    idComodidad INT IDENTITY PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

/* =========================
   COMODIDAD × TIPO HABITACIÓN
========================= */
CREATE TABLE TipoHabitacion_Comodidad (
    idTipo INT NOT NULL,
    idComodidad INT NOT NULL,
    CONSTRAINT PK_TH_Comodidad PRIMARY KEY (idTipo, idComodidad),
    CONSTRAINT FK_TH_Tipo FOREIGN KEY (idTipo) REFERENCES TipoHabitacion(idTipo),
    CONSTRAINT FK_TH_Comodidad FOREIGN KEY (idComodidad) REFERENCES Comodidad(idComodidad)
);

/* =========================
   HABITACIÓN
========================= */
CREATE TABLE Habitacion (
    numero INT PRIMARY KEY,
    idTipo INT NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'DISPONIBLE',
    CONSTRAINT FK_Habitacion_Tipo
        FOREIGN KEY (idTipo) REFERENCES TipoHabitacion(idTipo)
);

/* =========================
   CLIENTE
========================= */
CREATE TABLE Cliente (
    idCliente INT IDENTITY PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    apellido_1 VARCHAR(50) NOT NULL,
    apellido_2 VARCHAR(50),
    correo VARCHAR(100) NOT NULL UNIQUE,
    tipo_identificacion VARCHAR(50) NOT NULL,
    pais_residencia VARCHAR(50) NOT NULL,
    direccion VARCHAR(200),
    fecha_nacimiento DATE NOT NULL
);

/* =========================
   TELÉFONO CLIENTE
========================= */
CREATE TABLE TelefonoCliente (
    idTelefono INT IDENTITY PRIMARY KEY,
    idCliente INT NOT NULL,
    codigoPais VARCHAR(5) NOT NULL DEFAULT '+506',
    telefono VARCHAR(20) NOT NULL,
    CONSTRAINT FK_TelefonoCliente_Cliente
        FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
);

/* =========================
   ACTIVIDAD
========================= */
CREATE TABLE Actividad (
    idActividad INT IDENTITY PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    correo VARCHAR(100) NOT NULL UNIQUE,
    tipo_actividad VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200),
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    idDireccion INT NOT NULL,
    CONSTRAINT FK_Actividad_Direccion
        FOREIGN KEY (idDireccion) REFERENCES Direccion(idDireccion)
);

/* =========================
   TELÉFONO ACTIVIDAD
========================= */
CREATE TABLE TelefonoActividad (
    idTelefono INT IDENTITY PRIMARY KEY,
    idActividad INT NOT NULL,
    codigoPais VARCHAR(5) NOT NULL DEFAULT '+506',
    telefono VARCHAR(20) NOT NULL,
    CONSTRAINT FK_TelefonoActividad
        FOREIGN KEY (idActividad) REFERENCES Actividad(idActividad)
);

/* =========================
   RESERVACIONES
========================= */
CREATE TABLE Reservaciones (
    idReserva INT IDENTITY PRIMARY KEY,
    idCliente INT NOT NULL,
    numeroHabitacion INT NOT NULL,
    fechaIngreso DATETIME NOT NULL,
    fechaSalida DATETIME NOT NULL,
    cantidadPersonas INT NOT NULL CHECK (cantidadPersonas > 0),
    vehiculo INT NOT NULL DEFAULT 0,
    estado VARCHAR(10) NOT NULL DEFAULT 'ACTIVA',
    CONSTRAINT CK_Reserva_Fechas
        CHECK (fechaSalida >= fechaIngreso),
    CONSTRAINT FK_Reserva_Cliente
        FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente),
    CONSTRAINT FK_Reserva_Habitacion
        FOREIGN KEY (numeroHabitacion) REFERENCES Habitacion(numero)
);

/* =========================
   FACTURACIÓN
========================= */
CREATE TABLE Facturacion (
    idFactura INT IDENTITY PRIMARY KEY,
    idReserva INT NOT NULL,
    cargos DECIMAL(10,2) NOT NULL CHECK (cargos >= 0),
    noches INT NOT NULL CHECK (noches > 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    metodoPago INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Facturacion_Reserva
        FOREIGN KEY (idReserva) REFERENCES Reservaciones(idReserva)
);

/* =========================
   USUARIO 
========================= */
CREATE TABLE Usuario (
    usuario VARCHAR(20) PRIMARY KEY,
    acceso INT NOT NULL CHECK (acceso >= 8),
    correo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(20) NOT NULL,
    apellido VARCHAR(20) NOT NULL
);

/* =========================
   ADMINISTRADOR 
========================= */
CREATE TABLE Administrador (
    usuario VARCHAR(20) PRIMARY KEY,
    acceso INT NOT NULL CHECK (acceso >= 1),
    correo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(20) NOT NULL,
    apellido VARCHAR(20) NOT NULL
);
GO

/* =========================
   ROLES 
========================= */

CREATE ROLE Administrador;
CREATE ROLE Usuario;

GRANT SELECT ON dbo.SelectHabitacion TO Usuario;
GRANT SELECT ON dbo.SelectActividad TO Usuario;
GRANT EXECUTE ON dbo.sp_InsertarReservacion TO Usuario;
GRANT CONTROL ON DATABASE::StayLimon TO Administrador;

CREATE LOGIN A1 WITH PASSWORD = '12345678';
CREATE LOGIN U1 WITH PASSWORD = '87654321';

CREATE USER admin1 FOR LOGIN A1;
CREATE USER usuario1 FOR LOGIN U1;

ALTER ROLE Administrador ADD MEMBER admin1;
ALTER ROLE Usuario ADD MEMBER usuario1;
