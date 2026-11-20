import pg from 'pg';
import { readFileSync } from 'node:fs';

let pool;

export function obterPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Configure DATABASE_URL para acessar o PostgreSQL.');
  }

  if (!pool) {
    const url = new URL(connectionString);
    const usarCertificadoDoProjeto = url.searchParams.get('sslmode') === 'verify-full'
      && url.searchParams.get('sslrootcert') === './supabase-ca.crt';

    if (usarCertificadoDoProjeto) {
      const ca = readFileSync(new URL('../../supabase-ca.crt', import.meta.url), 'utf8');
      url.searchParams.delete('sslrootcert');
      url.searchParams.delete('sslmode');
      pool = new pg.Pool({ connectionString: url.href, ssl: { ca, rejectUnauthorized: true }, connectionTimeoutMillis: 5000 });
    } else {
      pool = new pg.Pool({ connectionString, connectionTimeoutMillis: 5000 });
    }
  }
  return pool;
}
