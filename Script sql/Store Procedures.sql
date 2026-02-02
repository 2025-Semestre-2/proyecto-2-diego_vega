use StayLimon;
GO

/* =========================
   HOTEL
========================= */
--Insert
CREATE PROCEDURE sp_InsertarHotel
    @cedula VARCHAR(20),
    @nombre VARCHAR(100),
    @tipo VARCHAR(50),
    @correo VARCHAR(100),
    @url VARCHAR(200) = NULL,
    @gps VARCHAR(100) = NULL,
    @detalleDireccion VARCHAR(200),
    @telefono VARCHAR(20),
    @codigoPais VARCHAR(5)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRAN;

        DECLARE @idDireccion INT;
        DECLARE @idHotel INT;

        INSERT INTO Direccion (detalle)
        VALUES (@detalleDireccion);

        SET @idDireccion = SCOPE_IDENTITY();

        INSERT INTO Hotel
        (cedula, nombre, tipo, correo, url, gps, idDireccion)
        VALUES
        (@cedula, @nombre, @tipo, @correo, @url, @gps, @idDireccion);

        SET @idHotel = SCOPE_IDENTITY();
        INSERT INTO TelefonoHotel (idHotel, codigoPais, telefono)
        VALUES (@idHotel, @codigoPais, @telefono);

        COMMIT TRAN;
        SELECT @idHotel AS idHotel;

    END TRY
    BEGIN CATCH
        ROLLBACK TRAN;
        THROW;
    END CATCH
END;
GO

--Update
CREATE PROCEDURE sp_UpdateHotel
    @idHotel INT,
    @nombre VARCHAR(100),
    @tipo VARCHAR(50),
    @correo VARCHAR(100),
    @url VARCHAR(200),
    @gps VARCHAR(100),
    @detalleDireccion VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @idDireccion INT;

    BEGIN TRAN;

    --Obtener la dirección actual del hotel
    SELECT @idDireccion = idDireccion
    FROM Hotel
    WHERE idHotel = @idHotel;

    UPDATE Direccion
    SET detalle = @detalleDireccion
    WHERE idDireccion = @idDireccion;

    UPDATE Hotel
    SET nombre = @nombre,
        tipo = @tipo,
        correo = @correo,
        url = @url,
        gps = @gps
    WHERE idHotel = @idHotel;

    COMMIT TRAN;
END;
GO
--Delete
CREATE PROCEDURE sp_DeleteHotel
    @idHotel INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Hotel
    WHERE idHotel = @idHotel;
END;
GO

/* =========================
   Cliente
========================= */
--Insert
CREATE PROCEDURE sp_InsertarCliente
    @cedula VARCHAR(20),
    @nombre VARCHAR(50),
    @apellido1 VARCHAR(50),
    @apellido2 VARCHAR(50),
    @correo VARCHAR(100),
    @tipoIdentificacion VARCHAR(50),
    @pais VARCHAR(50),
    @direccion VARCHAR(200),
    @fechaNacimiento DATE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Cliente
    (cedula, nombre, apellido_1, apellido_2, correo,
     tipo_identificacion, pais_residencia, direccion, fecha_nacimiento)
    VALUES
    (@cedula, @nombre, @apellido1, @apellido2, @correo,
     @tipoIdentificacion, @pais, @direccion, @fechaNacimiento);
END;
GO
--Update
CREATE PROCEDURE sp_UpdateCliente
    @idCliente INT,
    @correo VARCHAR(100),
    @direccion VARCHAR(200),
    @pais VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Cliente
    SET correo = @correo,
        direccion = @direccion,
        pais_residencia = @pais
    WHERE idCliente = @idCliente;
END;
GO
--Delete
CREATE PROCEDURE sp_DeleteCliente
    @idCliente INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Cliente
    WHERE idCliente = @idCliente;
END;
GO

/* =========================
   Habitacion
========================= */
--Insert
CREATE PROCEDURE sp_InsertarHabitacion
    @numero INT,
    @nombreTipo VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @idTipo INT;
    SELECT @idTipo = idTipo
    FROM TipoHabitacion
    WHERE nombre = @nombreTipo;

    IF @idTipo IS NULL
    BEGIN
        RAISERROR('El tipo de habitación no existe', 16, 1);
        RETURN;
    END

    INSERT INTO Habitacion (numero, idTipo)
    VALUES (@numero, @idTipo);
END;
GO
--Update
CREATE PROCEDURE sp_UpdateHabitacion
    @numero INT,
    @estado VARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Habitacion
    SET estado = @estado
    WHERE numero = @numero;
END;
GO
--Delete
CREATE PROCEDURE sp_DeleteHabitacion
    @numero INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Habitacion
    WHERE numero = @numero;
END;
GO


/* =========================
   Actividad
========================= */
--Insert
CREATE PROCEDURE sp_InsertarActividad
    @cedula VARCHAR(20),
    @nombre VARCHAR(100),
    @contacto VARCHAR(100),
    @correo VARCHAR(100),
    @tipo VARCHAR(50),
    @descripcion VARCHAR(200),
    @precio DECIMAL(10,2),
    @detalleDireccion VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @idDireccion INT;

    BEGIN TRAN;

    INSERT INTO Direccion (detalle)
    VALUES (@detalleDireccion);

    SET @idDireccion = SCOPE_IDENTITY();

    INSERT INTO Actividad
    (cedula, nombre, contacto, correo, tipo_actividad, descripcion, precio, idDireccion)
    VALUES
    (@cedula, @nombre, @contacto, @correo, @tipo, @descripcion, @precio, @idDireccion);

    COMMIT TRAN;
END;
GO
--Update
CREATE PROCEDURE sp_UpdateActividad
    @idActividad INT,
    @precio DECIMAL(10,2),
    @descripcion VARCHAR(200),
    @detalleDireccion VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @idDireccion INT;

    BEGIN TRAN;

    SELECT @idDireccion = idDireccion
    FROM Actividad
    WHERE idActividad = @idActividad;

    UPDATE Direccion
    SET detalle = @detalleDireccion
    WHERE idDireccion = @idDireccion;

    UPDATE Actividad
    SET precio = @precio,
        descripcion = @descripcion
    WHERE idActividad = @idActividad;

    COMMIT TRAN;
END;
GO
--Delete
CREATE PROCEDURE sp_DeleteActividad
    @idActividad INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Actividad
    WHERE idActividad = @idActividad;
END;
GO

/* =========================
   Reservacion
========================= */
--Insert
CREATE PROCEDURE sp_InsertarReservacion
    @idCliente INT,
    @numeroHabitacion INT,
    @fechaIngreso DATETIME,
    @fechaSalida DATETIME,
    @cantidadPersonas INT,
    @vehiculo INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Reservaciones
    (idCliente, numeroHabitacion, fechaIngreso, fechaSalida,
     cantidadPersonas, vehiculo)
    VALUES
    (@idCliente, @numeroHabitacion, @fechaIngreso,
     @fechaSalida, @cantidadPersonas, @vehiculo);
END;
GO

CREATE PROCEDURE sp_UpdateReservacion
    @idReserva INT,
    @fechaSalida DATETIME,
    @estado VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Reservaciones
    SET fechaSalida = @fechaSalida
    WHERE idReserva = @idReserva;
END;
GO

CREATE PROCEDURE sp_DeleteReservacion
    @idReserva INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Reservaciones
    SET estado = 'CERRADA'
    WHERE idReserva = @idReserva;
END;
GO

/* =========================
   Facturacion
========================= */
CREATE PROCEDURE sp_InsertarFactura
    @idReserva INT,
    @cargos DECIMAL(10,2),
    @metodoPago INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE 
        @fechaIngreso DATETIME,
        @fechaSalida DATETIME,
        @noches INT,
        @precio DECIMAL(10,2),
        @total DECIMAL(10,2);

    SELECT 
        @fechaIngreso = R.fechaIngreso,
        @fechaSalida  = R.fechaSalida,
        @precio = TH.precio
    FROM Reservaciones R
    INNER JOIN Habitacion H ON R.numeroHabitacion = H.numero
    INNER JOIN TipoHabitacion TH ON H.idTipo = TH.idTipo
    WHERE R.idReserva = @idReserva;

    IF @fechaIngreso IS NULL
    BEGIN
        RAISERROR('La reservación no existe', 16, 1);
        RETURN;
    END

    SET @noches = DATEDIFF(DAY, @fechaIngreso, @fechaSalida);
    SET @total = (@noches * @precio) + @cargos;

    INSERT INTO Facturacion (idReserva, cargos, noches, total, metodoPago)
    VALUES (@idReserva, @cargos, @noches, @total, @metodoPago);
END;
GO

