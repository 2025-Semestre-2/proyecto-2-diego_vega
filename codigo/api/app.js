const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./src/middleware/errorHandler');

// Rutas
const hotelRouter       = require('./src/routes/hotel');
const clienteRouter     = require('./src/routes/cliente');
const habitacionRouter  = require('./src/routes/habitacion');
const actividadRouter   = require('./src/routes/actividad');
const reservacionRouter = require('./src/routes/reservacion');
const facturaRouter     = require('./src/routes/factura');

const app = express();

// Middleware globales
app.use(cors()); 
app.use(express.json());                          
app.use(express.urlencoded({ extended: true }));  

// Rutas de la API
app.use('/api/hotel',       hotelRouter);
app.use('/api/cliente',     clienteRouter);
app.use('/api/habitacion',  habitacionRouter);
app.use('/api/actividad',   actividadRouter);
app.use('/api/reservacion', reservacionRouter);
app.use('/api/factura',     facturaRouter);

// Ruta raíz (verificación)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API StayLimon activa',
    endpoints: {
      hotel:       '/api/hotel',
      cliente:     '/api/cliente',
      habitacion:  '/api/habitacion',
      actividad:   '/api/actividad',
      reservacion: '/api/reservacion',
      factura:     '/api/factura'
    }
  });
});

// Handler de errores
app.use(errorHandler);

module.exports = app;
