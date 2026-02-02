USE StayLimon;
GO

INSERT INTO Direccion (detalle) VALUES ('Calle Principal, Limón Centro');
INSERT INTO Direccion (detalle) VALUES ('Muelle principal, Limón Centro');
INSERT INTO Direccion (detalle) VALUES ('Mercado Central, Limón');
INSERT INTO Direccion (detalle) VALUES ('Entrada parque La Cuña, km 12');
INSERT INTO Direccion (detalle) VALUES ('Playa del Hotel, zona sur');
GO


EXEC sp_InsertarHotel
    @cedula = '123456789',
    @nombre = 'StayLimón Resort',
    @tipo = 'Resort',
    @correo = 'hotel@staylimon.com',
    @url = 'https://staylimon.com',
    @gps = '10.0566, -83.5238',
    @detalleDireccion = 'Calle Principal, Limón Centro',
    @telefono = '22001100',
    @codigoPais = '+506';
GO

-- Agregar redes sociales al hotel (asumiendo idHotel = 1)
INSERT INTO RedSocial (nombre) VALUES ('Facebook');
INSERT INTO RedSocial (nombre) VALUES ('Instagram');
GO

INSERT INTO RedSocialHotel (idHotel, idRedSocial, enlace)
VALUES 
    (1, 1, 'facebook.com/staylimon'),
    (1, 2, 'instagram.com/staylimon');
GO

-- Agregar servicios al hotel
INSERT INTO ServicioHotel (idHotel, servicio)
VALUES 
    (1, 'Pool'),
    (1, 'Gym'),
    (1, 'Spa'),
    (1, 'Restaurant');
GO


INSERT INTO TipoHabitacion (nombre, descripcion, precio, tipo_cama)
VALUES 
    ('Suite', 'Habitación espaciosa con vista al mar y balcón privado.', 285.00, 'King'),
    ('Doble Estándar', 'Habitación cómoda con dos camas dobles, ideal para familias.', 145.00, 'Doble'),
    ('Single Premium', 'Habitación individual de alta gama con todos los servicios.', 195.00, 'Single');
GO

-- Agregar comodidades
INSERT INTO Comodidad (descripcion)
VALUES 
    ('Aire acondicionado'),
    ('Minibar'),
    ('Jacuzzi'),
    ('Televisor 55"'),
    ('Televisor 42"'),
    ('Televisor 50"'),
    ('Caja fuerte'),
    ('Bañera');
GO

-- Relacionar comodidades con tipos de habitación
-- Suite (idTipo = 1)
INSERT INTO TipoHabitacion_Comodidad (idTipo, idComodidad)
VALUES 
    (1, 1), -- Aire acondicionado
    (1, 2), -- Minibar
    (1, 3), -- Jacuzzi
    (1, 4); -- Televisor 55"
GO

-- Doble Estándar (idTipo = 2)
INSERT INTO TipoHabitacion_Comodidad (idTipo, idComodidad)
VALUES 
    (2, 1), -- Aire acondicionado
    (2, 5), -- Televisor 42"
    (2, 7); -- Caja fuerte
GO

-- Single Premium (idTipo = 3)
INSERT INTO TipoHabitacion_Comodidad (idTipo, idComodidad)
VALUES 
    (3, 1), -- Aire acondicionado
    (3, 2), -- Minibar
    (3, 6), -- Televisor 50"
    (3, 8); -- Bañera
GO


EXEC sp_InsertarHabitacion @numero = 101, @nombreTipo = 'Suite';
EXEC sp_InsertarHabitacion @numero = 102, @nombreTipo = 'Suite';
EXEC sp_InsertarHabitacion @numero = 201, @nombreTipo = 'Doble Estándar';
EXEC sp_InsertarHabitacion @numero = 202, @nombreTipo = 'Doble Estándar';
EXEC sp_InsertarHabitacion @numero = 301, @nombreTipo = 'Single Premium';
EXEC sp_InsertarHabitacion @numero = 302, @nombreTipo = 'Single Premium';
GO



EXEC sp_InsertarCliente
    @cedula = '102938475',
    @nombre = 'Ana',
    @apellido1 = 'Martínez',
    @apellido2 = 'Ruiz',
    @correo = 'ana@correo.com',
    @tipoIdentificacion = 'Cédula',
    @pais = 'Costa Rica',
    @direccion = 'Calle 5, San José',
    @fechaNacimiento = '1992-05-15';
GO

EXEC sp_InsertarCliente
    @cedula = '564738291',
    @nombre = 'Carlos',
    @apellido1 = 'López',
    @apellido2 = 'Sáez',
    @correo = 'carlos@correo.com',
    @tipoIdentificacion = 'Pasaporte',
    @pais = 'Colombia',
    @direccion = 'Av. Siempre Viva 200',
    @fechaNacimiento = '1996-08-20';
GO

-- Agregar teléfonos a clientes
INSERT INTO TelefonoCliente (idCliente, codigoPais, telefono)
VALUES 
    (1, '+506', '88776655'),
    (2, '+57', '3101234567');
GO

EXEC sp_InsertarActividad
    @cedula = '111000111',
    @nombre = 'Tour del Río Verde',
    @contacto = 'Juan Pérez',
    @correo = 'tour@aventura.com',
    @tipo = 'Aventura',
    @descripcion = 'Recorrido en bote por el río Verde, paisajes exuberantes y fauna silvestre.',
    @precio = 45.00,
    @detalleDireccion = 'Muelle principal, Limón Centro';
GO

EXEC sp_InsertarActividad
    @cedula = '222000222',
    @nombre = 'Cata de Especias',
    @contacto = 'María López',
    @correo = 'cata@sabores.com',
    @tipo = 'Gastronómica',
    @descripcion = 'Experiencia única cata de especias locales y platillos tradicionales costarricense.',
    @precio = 35.00,
    @detalleDireccion = 'Mercado Central, Limón';
GO

EXEC sp_InsertarActividad
    @cedula = '333000333',
    @nombre = 'Senderismo La Cuña',
    @contacto = 'Carlos Ruiz',
    @correo = 'sender@natur.com',
    @tipo = 'Deportiva',
    @descripcion = 'Caminata guiada por los senderos de la selva húmeda tropical, duración 4 horas.',
    @precio = 55.00,
    @detalleDireccion = 'Entrada parque La Cuña, km 12';
GO

EXEC sp_InsertarActividad
    @cedula = '444000444',
    @nombre = 'Submarinismo Básico',
    @contacto = 'Pedro Salinas',
    @correo = 'sub@oceano.com',
    @tipo = 'Acuática',
    @descripcion = 'Curso básico de submarinismo con instructor certificado en aguas tranquilas.',
    @precio = 120.00,
    @detalleDireccion = 'Playa del Hotel, zona sur';
GO

-- Agregar teléfonos a actividades 
INSERT INTO TelefonoActividad (idActividad, codigoPais, telefono)
VALUES 
    (1, '+506', '22334455'),
    (2, '+506', '55443322'),
    (3, '+506', '66778899'),
    (4, '+506', '11223344');
GO


SELECT * FROM SelectHotel;
SELECT * FROM SelectHabitacion;
SELECT * FROM SelectCliente;
SELECT * FROM SelectActividad;
GO