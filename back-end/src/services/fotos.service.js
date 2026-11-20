import { randomUUID } from 'node:crypto';
import sharp from 'sharp';

const BUCKET = 'fotos-objetos';
const LIMITE_FOTO = 4 * 1024 * 1024;
const ASSINATURAS = {
  'image/jpeg': Buffer.from([0xff, 0xd8, 0xff]),
  'image/png': Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
};

function origemStorage() {
  if (process.env.SUPABASE_URL) {
    const origem = new URL('/storage/v1/', process.env.SUPABASE_URL);
    if (origem.protocol !== 'https:' || !/^[a-z0-9]+\.supabase\.co$/.test(origem.hostname)
      || origem.username || origem.password || origem.port) {
      throw new Error('SUPABASE_URL deve apontar para o projeto Supabase por HTTPS.');
    }
    return origem;
  }
  const banco = new URL(process.env.DATABASE_URL);
  const projeto = banco.hostname.endsWith('.pooler.supabase.com')
    ? /\.([a-z0-9]+)$/.exec(banco.username)?.[1]
    : /^db\.([a-z0-9]+)\.supabase\.co$/.exec(banco.hostname)?.[1];
  if (!projeto) throw new Error('Configure SUPABASE_URL para habilitar fotos.');
  return new URL('https://' + projeto + '.supabase.co/storage/v1/');
}

async function chamarStorage(caminho, opcoes) {
  const chave = process.env.SUPABASE_SECRET_KEY;
  if (!chave) throw new Error('Configure SUPABASE_SECRET_KEY para habilitar fotos.');
  return fetch(new URL(caminho, origemStorage()), {
    ...opcoes,
    headers: { ...opcoes.headers, apikey: chave },
    redirect: 'error',
    signal: AbortSignal.timeout(15000)
  });
}

export async function validarFoto(arquivo) {
  const assinatura = Object.hasOwn(ASSINATURAS, arquivo.type) ? ASSINATURAS[arquivo.type] : null;
  if (!assinatura || !arquivo.size || arquivo.size > LIMITE_FOTO) return null;
  const conteudo = Buffer.from(await arquivo.arrayBuffer());
  if (!conteudo.subarray(0, assinatura.length).equals(assinatura)) return null;
  try {
    const imagem = await sharp(conteudo, { failOn: 'warning', limitInputPixels: 25_000_000 })
      .autoOrient()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 85 })
      .toBuffer();
    return imagem.length <= LIMITE_FOTO ? { conteudo: imagem, tipo: 'image/jpeg' } : null;
  } catch {
    return null;
  }
}

export async function enviarFoto(foto) {
  const caminho = randomUUID() + '.jpg';
  const resposta = await chamarStorage('object/' + BUCKET + '/' + caminho, {
    method: 'POST',
    headers: { 'content-type': foto.tipo, 'x-upsert': 'false' },
    body: foto.conteudo
  });
  await resposta.body?.cancel();
  if (!resposta.ok) throw new Error('Falha no upload da foto: ' + resposta.status);
  return caminho;
}

export async function removerFoto(caminho) {
  const resposta = await chamarStorage('object/' + BUCKET, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prefixes: [caminho] })
  });
  await resposta.body?.cancel();
  if (!resposta.ok) throw new Error('Falha na limpeza do upload: ' + resposta.status);
}

export function apresentarFoto({ foto_chave, ...objeto }) {
  const caminho = /^[a-f0-9-]{36}\.(?:jpg|png)$/.test(foto_chave ?? '') ? foto_chave : null;
  const foto_url = caminho ? new URL('object/public/' + BUCKET + '/' + caminho, origemStorage()).href : null;
  return { ...objeto, foto_url };
}
