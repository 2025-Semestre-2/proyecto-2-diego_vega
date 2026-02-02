const express = require('express');
const router  = express.Router();
const { executeQuery, executeSP, sql } = require('../../config/db');

// vista SelectActividad

router.get('/', async (req, res, next) => {
  try {
    const actividades = await executeQuery('SELECT * FROM SelectActividad');
    res.json({ success: true, data: actividades });
  } catch (err) { next(err); }
});


// Retorna una actividad por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const actividades = await executeQuery(
      'SELECT * FROM SelectActividad WHERE idActividad = @idActividad',
      [{ name: 'idActividad', type: sql.Int, value: parseInt(id) }]
    );

    if (actividades.length === 0) {
      return res.status(404).json({ success: false, error: 'Actividad no encontrada' });
    }

    res.json({ success: true, data: actividades[0] });
  } catch (err) { next(err); }
});

// sp_InsertarActividad
router.post('/', async (req, res, next) => {
  try {
    const { cedula, nombre, contacto, correo, tipo, descripcion, precio, detalleDireccion } = req.body;

    if (!cedula || !nombre || !correo || !tipo || precio === undefined || !detalleDireccion) {
      return res.status(400).json({
        success: false,
        error: 'Campos obligatorios: cedula, nombre, correo, tipo, precio, detalleDireccion'
      });
    }

    await executeSP('sp_InsertarActividad', [
      { name: 'cedula',           type: sql.VarChar,  value: cedula },
      { name: 'nombre',           type: sql.VarChar,  value: nombre },
      { name: 'contacto',         type: sql.VarChar,  value: contacto || null },
      { name: 'correo',           type: sql.VarChar,  value: correo },
      { name: 'tipo',             type: sql.VarChar,  value: tipo },
      { name: 'descripcion',      type: sql.VarChar,  value: descripcion || null },
      { name: 'precio',           type: sql.Decimal,  value: parseFloat(precio) },
      { name: 'detalleDireccion', type: sql.VarChar,  value: detalleDireccion }
    ]);

    res.status(201).json({ success: true, message: 'Actividad creada exitosamente' });
  } catch (err) { next(err); }
});


//sp_UpdateActividad

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { precio, descripcion, detalleDireccion } = req.body;

    if (precio === undefined || !detalleDireccion) {
      return res.status(400).json({
        success: false,
        error: 'Campos obligatorios: precio, detalleDireccion'
      });
    }

    await executeSP('sp_UpdateActividad', [
      { name: 'idActividad',      type: sql.Int,     value: parseInt(id) },
      { name: 'precio',           type: sql.Decimal, value: parseFloat(precio) },
      { name: 'descripcion',      type: sql.VarChar, value: descripcion || null },
      { name: 'detalleDireccion', type: sql.VarChar, value: detalleDireccion }
    ]);

    res.json({ success: true, message: 'Actividad actualizada exitosamente' });
  } catch (err) { next(err); }
});


//sp_DeleteActividad
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await executeSP('sp_DeleteActividad', [
      { name: 'idActividad', type: sql.Int, value: parseInt(id) }
    ]);

    res.json({ success: true, message: 'Actividad eliminada exitosamente' });
  } catch (err) { next(err); }
});

module.exports = router;
