import pg from 'pg';

let pool;

export function obterPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Configure DATABASE_URL para acessar o PostgreSQL.');
  }

  pool ??= new pg.Pool({ connectionString });
  return pool;
}
