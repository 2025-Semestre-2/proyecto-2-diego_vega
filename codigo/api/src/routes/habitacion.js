const express = require('express');
const router  = express.Router();
const { executeQuery, executeSP, sql } = require('../../config/db');


// Retorna todas las habitaciones vista 

router.get('/', async (req, res, next) => {
  try {
    const habitaciones = await executeQuery('SELECT * FROM SelectHabitacion');
    res.json({ success: true, data: habitaciones });
  } catch (err) { next(err); }
});


router.get('/:numero', async (req, res, next) => {
  try {
    const { numero } = req.params;
    const habitaciones = await executeQuery(
      'SELECT * FROM SelectHabitacion WHERE numeroHabitacion = @numero',
      [{ name: 'numero', type: sql.Int, value: parseInt(numero) }]
    );

    if (habitaciones.length === 0) {
      return res.status(404).json({ success: false, error: 'Habitación no encontrada' });
    }

    res.json({ success: true, data: habitaciones[0] });
  } catch (err) { next(err); }
});


// Crea una nueva habitación 
router.post('/', async (req, res, next) => {
  try {
    const { numero, nombreTipo } = req.body;

    if (numero === undefined || !nombreTipo) {
      return res.status(400).json({
        success: false,
        error: 'Campos obligatorios: numero, nombreTipo'
      });
    }

    await executeSP('sp_InsertarHabitacion', [
      { name: 'numero',     type: sql.Int,     value: parseInt(numero) },
      { name: 'nombreTipo', type: sql.VarChar, value: nombreTipo }
    ]);

    res.status(201).json({ success: true, message: 'Habitación creada exitosamente' });
  } catch (err) { next(err); }
});

// Actualiza el estado de una habitación 
router.put('/:numero', async (req, res, next) => {
  try {
    const { numero } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        success: false,
        error: 'Campo obligatorio: estado'
      });
    }

    await executeSP('sp_UpdateHabitacion', [
      { name: 'numero', type: sql.Int,     value: parseInt(numero) },
      { name: 'estado', type: sql.VarChar, value: estado }
    ]);

    res.json({ success: true, message: 'Habitación actualizada exitosamente' });
  } catch (err) { next(err); }
});


router.delete('/:numero', async (req, res, next) => {
  try {
    const { numero } = req.params;

    await executeSP('sp_DeleteHabitacion', [
      { name: 'numero', type: sql.Int, value: parseInt(numero) }
    ]);

    res.json({ success: true, message: 'Habitación eliminada exitosamente' });
  } catch (err) { next(err); }
});

module.exports = router;
