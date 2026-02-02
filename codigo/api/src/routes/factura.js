  const express = require('express');
const router  = express.Router();
const { executeQuery, executeSP, sql } = require('../../config/db');


// Retorna todas las facturas con detalle de reservación
router.get('/', async (req, res, next) => {
  try {
    const facturas = await executeQuery(`
      SELECT
        F.idFactura,
        F.idReserva,
        R.numeroHabitacion,
        C.nombre + ' ' + C.apellido_1 AS nombreCliente,
        F.cargos,
        F.noches,
        F.total,
        F.metodoPago,
        F.fecha
      FROM Facturacion F
      INNER JOIN Reservaciones R ON F.idReserva = R.idReserva
      INNER JOIN Cliente C       ON R.idCliente = C.idCliente
    `);
    res.json({ success: true, data: facturas });
  } catch (err) { next(err); }
});


// Retorna una factura por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const facturas = await executeQuery(
      `SELECT
        F.idFactura,
        F.idReserva,
        R.numeroHabitacion,
        C.nombre + ' ' + C.apellido_1 AS nombreCliente,
        F.cargos,
        F.noches,
        F.total,
        F.metodoPago,
        F.fecha
      FROM Facturacion F
      INNER JOIN Reservaciones R ON F.idReserva = R.idReserva
      INNER JOIN Cliente C       ON R.idCliente = C.idCliente
      WHERE F.idFactura = @idFactura`,
      [{ name: 'idFactura', type: sql.Int, value: parseInt(id) }]
    );

    if (facturas.length === 0) {
      return res.status(404).json({ success: false, error: 'Factura no encontrada' });
    }

    res.json({ success: true, data: facturas[0] });
  } catch (err) { next(err); }
});

// Crea una nueva factura
router.post('/', async (req, res, next) => {
  try {
    const { idReserva, cargos, metodoPago } = req.body;

    if (!idReserva || cargos === undefined || metodoPago === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Campos obligatorios: idReserva, cargos, metodoPago'
      });
    }

    await executeSP('sp_InsertarFactura', [
      { name: 'idReserva',   type: sql.Int,     value: parseInt(idReserva) },
      { name: 'cargos',      type: sql.Decimal, value: parseFloat(cargos) },
      { name: 'metodoPago',  type: sql.Int,     value: parseInt(metodoPago) }
    ]);

    res.status(201).json({ success: true, message: 'Factura creada exitosamente' });
  } catch (err) { next(err); }
});

module.exports = router;
