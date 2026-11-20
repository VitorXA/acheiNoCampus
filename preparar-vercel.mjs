import { cpSync, mkdirSync, mkdtempSync, realpathSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cabecalhosSeguranca } from './back-end/src/config/cabecalhos.js';

const raiz = realpathSync.native(fileURLToPath(new URL('.', import.meta.url)));
const destino = mkdtempSync(join(raiz, '.vercel-upload-'));
const pastaPublica = join(destino, 'public');
mkdirSync(pastaPublica);

const copiar = {
  recursive: true,
  filter: (origem) => !basename(origem).startsWith('.') && basename(origem) !== 'node_modules'
};

for (const arquivo of ['package.json', 'package-lock.json', 'src', 'supabase-ca.crt']) {
  cpSync(new URL('./back-end/' + arquivo, import.meta.url), join(destino, arquivo), copiar);
}

for (const arquivo of [
  'index.html',
  'css',
  'js',
  'pages',
  'assets',
  'acheinocampus-logo-transparente-branca.png'
]) {
  cpSync(new URL('./front-end/' + arquivo, import.meta.url), join(pastaPublica, arquivo), copiar);
}

const headers = Object.entries(cabecalhosSeguranca(true)).map(([key, value]) => ({ key, value }));
writeFileSync(join(destino, 'vercel.json'), JSON.stringify({ headers: [{ source: '/(.*)', headers }] }, null, 2));

console.log(destino);
