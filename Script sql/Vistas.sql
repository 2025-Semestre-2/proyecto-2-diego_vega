use StayLimon;
GO

CREATE VIEW SelectHotel
AS
SELECT
    H.idHotel,
    H.cedula,
    H.nombre AS nombreHotel,
    H.tipo,
    H.correo,
    H.url,
    H.gps,
    D.detalle AS direccion,
    STRING_AGG(
        CONCAT(TH.codigoPais, ' ', TH.telefono),
        ' | '
    ) AS telefonos,
    STRING_AGG(
        CONCAT(RS.nombre, ': ', RSH.enlace),
        ' | '
    ) AS redesSociales,
    STRING_AGG(
        SH.servicio,
        ' | '
    ) AS servicios
FROM Hotel H
INNER JOIN Direccion D
    ON H.idDireccion = D.idDireccion

LEFT JOIN TelefonoHotel TH
    ON H.idHotel = TH.idHotel

LEFT JOIN RedSocialHotel RSH
    ON H.idHotel = RSH.idHotel
LEFT JOIN RedSocial RS
    ON RSH.idRedSocial = RS.idRedSocial

LEFT JOIN ServicioHotel SH
    ON H.idHotel = SH.idHotel
GROUP BY
    H.idHotel,
    H.cedula,
    H.nombre,
    H.tipo,
    H.correo,
    H.url,
    H.gps,
    D.detalle;
GO

CREATE VIEW SelectCliente
AS
SELECT
    C.idCliente,
    C.cedula as identificacion,
    C.nombre,
    C.apellido_1,
    C.apellido_2,
    C.correo,
    C.tipo_identificacion,
    C.pais_residencia,
    C.direccion,
    C.fecha_nacimiento,
    DATEDIFF(YEAR, C.fecha_nacimiento, GETDATE())
        - CASE 
            WHEN DATEADD(YEAR, DATEDIFF(YEAR, C.fecha_nacimiento, GETDATE()), C.fecha_nacimiento) > GETDATE()
            THEN 1 ELSE 0
          END AS edad,

    STRING_AGG(
        CONCAT(TC.codigoPais, ' ', TC.telefono),
        ' | '
    ) AS telefonos
FROM Cliente C
LEFT JOIN TelefonoCliente TC
    ON C.idCliente = TC.idCliente
GROUP BY
    C.idCliente,
    C.cedula,
    C.nombre,
    C.apellido_1,
    C.apellido_2,
    C.correo,
    C.tipo_identificacion,
    C.pais_residencia,
    C.direccion,
    C.fecha_nacimiento;
GO

CREATE VIEW SelectHabitacion
AS
SELECT
    H.numero AS numeroHabitacion,
    H.estado,
    TH.idTipo,
    TH.nombre AS tipoHabitacion,
    TH.descripcion,
    TH.precio,
    TH.tipo_cama,
    STRING_AGG(C.descripcion, ' | ') AS comodidades,
    STRING_AGG(FTH.foto, ' | ') AS fotos
FROM Habitacion H
INNER JOIN TipoHabitacion TH
    ON H.idTipo = TH.idTipo

LEFT JOIN TipoHabitacion_Comodidad THC
    ON TH.idTipo = THC.idTipo
LEFT JOIN Comodidad C
    ON THC.idComodidad = C.idComodidad

LEFT JOIN FotoTipoHabitacion FTH
    ON TH.idTipo = FTH.idTipo

GROUP BY
    H.numero,
    H.estado,
    TH.idTipo,
    TH.nombre,
    TH.descripcion,
    TH.precio,
    TH.tipo_cama;
GO


CREATE VIEW SelectActividad
AS
SELECT
    A.idActividad,
    A.cedula,
    A.nombre,
    A.contacto,
    A.correo,
    A.tipo_actividad,
    A.descripcion,
    A.precio,

    D.detalle AS direccion,

    STRING_AGG(
        CONCAT(TA.codigoPais, ' ', TA.telefono),
        ' | '
    ) AS telefonos

FROM Actividad A
INNER JOIN Direccion D
    ON A.idDireccion = D.idDireccion

LEFT JOIN TelefonoActividad TA
    ON A.idActividad = TA.idActividad

GROUP BY
    A.idActividad,
    A.cedula,
    A.nombre,
    A.contacto,
    A.correo,
    A.tipo_actividad,
    A.descripcion,
    A.precio,
    D.detalle;
GO

