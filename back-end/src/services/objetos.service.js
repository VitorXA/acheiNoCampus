import { listarObjetos } from '../repositories/objetos.repository.js';
import { inteiroPositivo } from '../utils/validators.js';

const TIPOS = ['perdido', 'encontrado'];
const STATUS = ['pendente', 'devolvido'];

export function validarNovaFicha(body, idUsuario) {
  const { tipo, data_ocorrencia, id_categoria, id_local } = body ?? {};
  const texto = (valor, max) => typeof valor === 'string' && valor.length <= max && !valor.includes('\0')
    ? valor.trim()
    : null;
  const titulo = texto(body?.titulo, 45);
  const cor = texto(body?.cor ?? '', 45);
  const descricao = texto(body?.descricao ?? '', 2000);
  const idCategoria = inteiroPositivo(id_categoria);
  const idLocal = inteiroPositivo(id_local);
  const data = typeof data_ocorrencia === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data_ocorrencia)
    ? new Date(data_ocorrencia + 'T00:00:00Z')
    : null;
  const dataValida = data && !Number.isNaN(data.getTime())
    && data.getUTCFullYear() >= 1 && data.toISOString().slice(0, 10) === data_ocorrencia;

  if (!titulo || cor === null || descricao === null || !TIPOS.includes(tipo) || !dataValida || !idCategoria || !idLocal) {
    return null;
  }
  return { titulo, cor, descricao, tipo, data: data_ocorrencia, idUsuario, idCategoria, idLocal };
}

export async function consultarObjetos(query) {
  const { busca, tipo, status, id_categoria, id_local, pagina = '1', limite = '50' } = query;

  if (busca !== undefined && (typeof busca !== 'string' || busca.length > 150 || busca.includes('\0'))) {
    return { erro: 'Informe uma busca de até 150 caracteres.' };
  }
  if (tipo !== undefined && !TIPOS.includes(tipo)) {
    return { erro: 'O tipo deve ser perdido ou encontrado.' };
  }
  if (status !== undefined && !STATUS.includes(status)) {
    return { erro: 'O status deve ser pendente ou devolvido.' };
  }

  const idCategoria = inteiroPositivo(id_categoria);
  const idLocal = inteiroPositivo(id_local);
  if ((id_categoria !== undefined && idCategoria === null) || (id_local !== undefined && idLocal === null)) {
    return { erro: 'Os filtros de categoria e local devem conter IDs inteiros positivos.' };
  }

  const paginaAtual = inteiroPositivo(pagina);
  const tamanho = inteiroPositivo(limite, 100);
  if (paginaAtual === null || tamanho === null) {
    return { erro: 'Informe uma página positiva e um limite de 1 a 100.' };
  }

  const termo = busca?.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  const registros = await listarObjetos({
    busca: termo || null,
    tipo: tipo ?? null,
    status: status ?? null,
    idCategoria,
    idLocal,
    limite: tamanho + 1,
    deslocamento: (paginaAtual - 1) * tamanho
  });

  return {
    dados: registros.slice(0, tamanho),
    pagina: paginaAtual,
    limite: tamanho,
    temProximaPagina: registros.length > tamanho
  };
}
