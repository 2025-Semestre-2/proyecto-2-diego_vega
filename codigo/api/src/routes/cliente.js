const express = require('express');
const router  = express.Router();
const { executeQuery, executeSP, sql } = require('../../config/db');

// vista SelectCliente
router.get('/', async (req, res, next) => {
  try {
    const clientes = await executeQuery('SELECT * FROM SelectCliente');
    res.json({ success: true, data: clientes });
  } catch (err) { next(err); }
});

// Retorna un cliente por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const clientes = await executeQuery(
      'SELECT * FROM SelectCliente WHERE idCliente = @idCliente',
      [{ name: 'idCliente', type: sql.Int, value: parseInt(id) }]
    );

    if (clientes.length === 0) {
      return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
    }

    res.json({ success: true, data: clientes[0] });
  } catch (err) { next(err); }
});

// Crea un nuevo cliente  
router.post('/', async (req, res, next) => {
  try {
    const {
      cedula, nombre, apellido1, apellido2,
      correo, tipoIdentificacion, pais,
      direccion, fechaNacimiento
    } = req.body;

    // Validación básica de campos obligatorios
    if (!cedula || !nombre || !apellido1 || !correo || !tipoIdentificacion || !pais || !fechaNacimiento) {
      return res.status(400).json({
        success: false,
        error: 'Campos obligatorios: cedula, nombre, apellido1, correo, tipoIdentificacion, pais, fechaNacimiento'
      });
    }

    await executeSP('sp_InsertarCliente', [
      { name: 'cedula',              type: sql.VarChar, value: cedula },
      { name: 'nombre',              type: sql.VarChar, value: nombre },
      { name: 'apellido1',           type: sql.VarChar, value: apellido1 },
      { name: 'apellido2',           type: sql.VarChar, value: apellido2 || null },
      { name: 'correo',              type: sql.VarChar, value: correo },
      { name: 'tipoIdentificacion',  type: sql.VarChar, value: tipoIdentificacion },
      { name: 'pais',                type: sql.VarChar, value: pais },
      { name: 'direccion',           type: sql.VarChar, value: direccion || null },
      { name: 'fechaNacimiento',     type: sql.Date,    value: new Date(fechaNacimiento) }
    ]);

    res.status(201).json({ success: true, message: 'Cliente creado exitosamente' });
  } catch (err) { next(err); }
});


// Actualiza un cliente 
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { correo, direccion, pais } = req.body;

    if (!correo || !pais) {
      return res.status(400).json({
        success: false,
        error: 'Campos obligatorios: correo, pais'
      });
    }

    await executeSP('sp_UpdateCliente', [
      { name: 'idCliente',  type: sql.Int,     value: parseInt(id) },
      { name: 'correo',     type: sql.VarChar, value: correo },
      { name: 'direccion',  type: sql.VarChar, value: direccion || null },
      { name: 'pais',       type: sql.VarChar, value: pais }
    ]);

    res.json({ success: true, message: 'Cliente actualizado exitosamente' });
  } catch (err) { next(err); }
});

// Elimina un cliente
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await executeSP('sp_DeleteCliente', [
      { name: 'idCliente', type: sql.Int, value: parseInt(id) }
    ]);

    res.json({ success: true, message: 'Cliente eliminado exitosamente' });
  } catch (err) { next(err); }
});

module.exports = router;
