const express = require('express');
const router  = express.Router();
const { executeQuery, executeSP, sql } = require('../../config/db');

// vista SelectHotel
router.get('/', async (req, res, next) => {
  try {
    const hoteles = await executeQuery('SELECT * FROM SelectHotel');
    res.json({ success: true, data: hoteles });
  } catch (err) { next(err); }
});


// Retorna un hotel por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const hoteles = await executeQuery(
      'SELECT * FROM SelectHotel WHERE idHotel = @idHotel',
      [{ name: 'idHotel', type: sql.Int, value: parseInt(id) }]
    );

    if (hoteles.length === 0) {
      return res.status(404).json({ success: false, error: 'Hotel no encontrado' });
    }

    res.json({ success: true, data: hoteles[0] });
  } catch (err) { next(err); }
});


// Crea un nuevo hotel  sp_InsertarHotel
router.post('/', async (req, res, next) => {
  try {
    const { cedula, nombre, tipo, correo, url, gps, detalleDireccion } = req.body;

    // Validación básica
    if (!cedula || !nombre || !tipo || !correo || !detalleDireccion) {
      return res.status(400).json({
        success: false,
        error: 'Campos obligatorios: cedula, nombre, tipo, correo, detalleDireccion'
      });
    }

    await executeSP('sp_InsertarHotel', [
      { name: 'cedula',           type: sql.VarChar,  value: cedula },
      { name: 'nombre',           type: sql.VarChar,  value: nombre },
      { name: 'tipo',             type: sql.VarChar,  value: tipo },
      { name: 'correo',           type: sql.VarChar,  value: correo },
      { name: 'url',              type: sql.VarChar,  value: url || null },
      { name: 'gps',              type: sql.VarChar,  value: gps || null },
      { name: 'detalleDireccion', type: sql.VarChar,  value: detalleDireccion }
    ]);

    res.status(201).json({ success: true, message: 'Hotel creado exitosamente' });
  } catch (err) { next(err); }
});


// Actualiza un hotel 
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, correo, url, gps, detalleDireccion } = req.body;

    if (!nombre || !tipo || !correo || !detalleDireccion) {
      return res.status(400).json({
        success: false,
        error: 'Campos obligatorios: nombre, tipo, correo, detalleDireccion'
      });
    }

    await executeSP('sp_UpdateHotel', [
      { name: 'idHotel',          type: sql.Int,      value: parseInt(id) },
      { name: 'nombre',           type: sql.VarChar,  value: nombre },
      { name: 'tipo',             type: sql.VarChar,  value: tipo },
      { name: 'correo',           type: sql.VarChar,  value: correo },
      { name: 'url',              type: sql.VarChar,  value: url || null },
      { name: 'gps',              type: sql.VarChar,  value: gps || null },
      { name: 'detalleDireccion', type: sql.VarChar,  value: detalleDireccion }
    ]);

    res.json({ success: true, message: 'Hotel actualizado exitosamente' });
  } catch (err) { next(err); }
});

// DELETE 
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await executeSP('sp_DeleteHotel', [
      { name: 'idHotel', type: sql.Int, value: parseInt(id) }
    ]);

    res.json({ success: true, message: 'Hotel eliminado exitosamente' });
  } catch (err) { next(err); }
});

module.exports = router;
