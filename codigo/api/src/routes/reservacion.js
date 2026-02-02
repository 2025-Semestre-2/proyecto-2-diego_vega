const express = require('express');
const router  = express.Router();
const { executeQuery, executeSP, sql } = require('../../config/db');


// Retorna todas las reservaciones
router.get('/', async (req, res, next) => {
  try {
    const reservaciones = await executeQuery(`
      SELECT
        R.idReserva,
        R.idCliente,
        C.nombre + ' ' + C.apellido_1 AS nombreCliente,
        R.numeroHabitacion,
        R.fechaIngreso,
        R.fechaSalida,
        R.cantidadPersonas,
        R.vehiculo,
        R.estado
      FROM Reservaciones R
      INNER JOIN Cliente C ON R.idCliente = C.idCliente
    `);
    res.json({ success: true, data: reservaciones });
  } catch (err) { next(err); }
});


// Retorna una reservación por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservaciones = await executeQuery(
      `SELECT
        R.idReserva,
        R.idCliente,
        C.nombre + ' ' + C.apellido_1 AS nombreCliente,
        R.numeroHabitacion,
        R.fechaIngreso,
        R.fechaSalida,
        R.cantidadPersonas,
        R.vehiculo,
        R.estado
      FROM Reservaciones R
      INNER JOIN Cliente C ON R.idCliente = C.idCliente
      WHERE R.idReserva = @idReserva`,
      [{ name: 'idReserva', type: sql.Int, value: parseInt(id) }]
    );

    if (reservaciones.length === 0) {
      return res.status(404).json({ success: false, error: 'Reservación no encontrada' });
    }

    res.json({ success: true, data: reservaciones[0] });
  } catch (err) { next(err); }
});


// Crea una nueva reservación 
router.post('/', async (req, res, next) => {
  try {
    const { idCliente, numeroHabitacion, fechaIngreso, fechaSalida, cantidadPersonas, vehiculo } = req.body;

    if (!idCliente || !numeroHabitacion || !fechaIngreso || !fechaSalida || !cantidadPersonas) {
      return res.status(400).json({
        success: false,
        error: 'Campos obligatorios: idCliente, numeroHabitacion, fechaIngreso, fechaSalida, cantidadPersonas'
      });
    }

    // Validar que fechaSalida >= fechaIngreso
    if (new Date(fechaSalida) < new Date(fechaIngreso)) {
      return res.status(400).json({
        success: false,
        error: 'La fecha de salida debe ser mayor o igual a la fecha de ingreso'
      });
    }

    await executeSP('sp_InsertarReservacion', [
      { name: 'idCliente',         type: sql.Int,      value: parseInt(idCliente) },
      { name: 'numeroHabitacion',  type: sql.Int,      value: parseInt(numeroHabitacion) },
      { name: 'fechaIngreso',      type: sql.DateTime, value: new Date(fechaIngreso) },
      { name: 'fechaSalida',       type: sql.DateTime, value: new Date(fechaSalida) },
      { name: 'cantidadPersonas',  type: sql.Int,      value: parseInt(cantidadPersonas) },
      { name: 'vehiculo',          type: sql.Int,      value: vehiculo ? parseInt(vehiculo) : 0 }
    ]);

    res.status(201).json({ success: true, message: 'Reservación creada exitosamente' });
  } catch (err) { next(err); }
});


// Actualiza fecha de salida 
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fechaSalida, estado } = req.body;

    if (!fechaSalida) {
      return res.status(400).json({
        success: false,
        error: 'Campo obligatorio: fechaSalida'
      });
    }

    await executeSP('sp_UpdateReservacion', [
      { name: 'idReserva',   type: sql.Int,      value: parseInt(id) },
      { name: 'fechaSalida', type: sql.DateTime, value: new Date(fechaSalida) },
      { name: 'estado',      type: sql.VarChar,  value: estado || 'ACTIVA' }
    ]);

    res.json({ success: true, message: 'Reservación actualizada exitosamente' });
  } catch (err) { next(err); }
});


// Cierra una reservación 
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await executeSP('sp_DeleteReservacion', [
      { name: 'idReserva', type: sql.Int, value: parseInt(id) }
    ]);

    res.json({
      success: true,
      message: 'Reservación cerrada exitosamente. Se generó la factura automáticamente.'
    });
  } catch (err) { next(err); }
});

module.exports = router;
