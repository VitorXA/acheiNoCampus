const MAX_INT_POSTGRES = 2147483647;

export function inteiroPositivo(valor, maximo = MAX_INT_POSTGRES) {
  if (typeof valor !== 'string' || !/^\d+$/.test(valor)) return null;

  const numero = Number(valor);
  return numero >= 1 && numero <= maximo ? numero : null;
}
