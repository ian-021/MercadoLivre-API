export function formatPathQuery(query: string): string {
  return query.replace(/\s+/g, '-').toLowerCase();
}

export function calculateOffset(page: number, limit: number): number {
  return page === 1 ? 1 : ((page - 1) * limit) + 1;
}

export function buildMercadoLivreUrl(query: string, page: number = 1, limit: number = 50): string {
  const pathQuery = formatPathQuery(query);
  const encodedQuery = encodeURIComponent(query);
  const offset = calculateOffset(page, limit);

  if (page === 1) {
    return `https://lista.mercadolivre.com.br/${pathQuery}#D[A:${encodedQuery}]`;
  }

  return `https://lista.mercadolivre.com.br/${pathQuery}/${pathQuery}_Desde_${offset}_NoIndex_True`;
}

export function buildHeaders(pathQuery: string) {
  return {
    "Cookie": `LAST_SEARCH=${pathQuery}`
  };
}