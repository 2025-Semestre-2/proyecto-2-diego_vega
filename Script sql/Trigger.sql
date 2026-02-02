USE StayLimon;
GO

CREATE TRIGGER TR_GenerarFactura_ReservaCerrada
ON Reservaciones
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Facturacion (idReserva, cargos, noches, total, metodoPago)
    SELECT
        i.idReserva,
        0.00 AS cargos,
        DATEDIFF(DAY, i.fechaIngreso, i.fechaSalida) AS noches,
        DATEDIFF(DAY, i.fechaIngreso, i.fechaSalida) * th.precio AS total,
        1 AS metodoPago
    FROM inserted i
    INNER JOIN deleted d 
        ON i.idReserva = d.idReserva
    INNER JOIN Habitacion h 
        ON i.numeroHabitacion = h.numero
    INNER JOIN TipoHabitacion th 
        ON h.idTipo = th.idTipo
    WHERE
        d.estado <> 'Cerrado'
        AND i.estado = 'Cerrado'
        AND NOT EXISTS (
            SELECT 1
            FROM Facturacion f
            WHERE f.idReserva = i.idReserva
        );
END;
GO
