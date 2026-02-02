
// Middleware: manejo centralizado de errores
function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message || err);

  // Errores que lanza MSSQL (RAISERROR en los SP)
  const statusCode = err.statusCode || 500;
  const message   = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    error: message
  });
}

module.exports = { errorHandler };
