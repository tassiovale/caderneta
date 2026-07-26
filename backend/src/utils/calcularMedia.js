const N_MINIMO_DECIDIDOS = 4;

function calcularMediaStatus(avaliacoes, notaPorAvaliacao, mediaMinima) {
  const pesoTotal = avaliacoes.reduce((soma, a) => soma + a.peso, 0);

  let somaPonderada = 0;
  let pesoLancado = 0;
  avaliacoes.forEach((a) => {
    if (notaPorAvaliacao.has(a.id)) {
      somaPonderada += notaPorAvaliacao.get(a.id) * a.peso;
      pesoLancado += a.peso;
    }
  });

  if (pesoLancado === 0) {
    return { media: null, status: 'sem notas', pesoLancado, pesoTotal };
  }

  const media = somaPonderada / pesoLancado;
  let status;
  if (pesoLancado >= pesoTotal) {
    status = media >= mediaMinima ? 'aprovado' : 'reprovado';
  } else {
    status = 'em andamento';
  }

  return { media, status, pesoLancado, pesoTotal };
}

function isDecidido(status) {
  return status === 'aprovado' || status === 'reprovado';
}

function percentil(arrOrdenadoAsc, p) {
  const n = arrOrdenadoAsc.length;
  const idx = p * (n - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  const frac = idx - lo;
  return arrOrdenadoAsc[lo] + frac * (arrOrdenadoAsc[hi] - arrOrdenadoAsc[lo]);
}

function calcularQuartis(medias) {
  const n = medias.length;
  if (n < 4) {
    return { n, Q1: null, mediana: null, Q3: null, iqr: null, limiteInferior: null, limiteSuperior: null };
  }

  const ordenado = [...medias].sort((a, b) => a - b);
  const Q1 = percentil(ordenado, 0.25);
  const mediana = percentil(ordenado, 0.5);
  const Q3 = percentil(ordenado, 0.75);
  const iqr = Q3 - Q1;
  const limiteInferior = Q1 - 1.5 * iqr;
  const limiteSuperior = Q3 + 1.5 * iqr;

  return { n, Q1, mediana, Q3, iqr, limiteInferior, limiteSuperior };
}

function arredondar(valor, casas = 2) {
  if (valor === null || valor === undefined) return null;
  return Number(valor.toFixed(casas));
}

module.exports = {
  calcularMediaStatus,
  isDecidido,
  percentil,
  calcularQuartis,
  arredondar,
  N_MINIMO_DECIDIDOS,
};
