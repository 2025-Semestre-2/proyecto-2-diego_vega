const sql = require('mssql');

const config = {
  user: 'A1',
  password: '12345678',
  server: 'localhost',
  database: 'StayLimon',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

let pool = null;

async function getPool() {
  if (pool && pool.connected) return pool;

  pool = await new sql.ConnectionPool(config).connect();
  console.log('Conexión al pool de MSSQL exitosa');
  return pool;
}

// Ejecuta Stored Procedure
async function executeSP(spName, parametros = []) {
  const connection = await getPool();
  const request = connection.request();

  parametros.forEach(p => {
    request.input(p.name, p.type, p.value);
  });

  const result = await request.execute(spName); 
  return result;
}

// Ejecuta query directa
async function executeQuery(query, parametros = []) {
  const connection = await getPool();
  const request = connection.request();

  parametros.forEach(p => {
    request.input(p.name, p.type, p.value);
  });

  const result = await request.query(query);
  return result.recordset;
}

module.exports = { executeSP, executeQuery, sql };
