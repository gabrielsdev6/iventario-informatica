const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'inventario_db',
});

pool.on('connect', () => {
  console.log('Conectado ao banco PostgreSQL.');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no cliente do banco:', err);
  process.exit(-1);
});

module.exports = pool;