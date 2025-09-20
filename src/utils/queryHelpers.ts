export function formatPathQuery(query: string): string {
  return query.replace(/\s+/g, '-').toLowerCase();
}

export function buildMercadoLivreUrl(query: string): string {
  const pathQuery = formatPathQuery(query);
  const encodedQuery = encodeURIComponent(query);
  return `https://lista.mercadolivre.com.br/${pathQuery}#D[A:${encodedQuery}]`;
}

export function buildHeaders(pathQuery: string) {
  return {
    "Cookie": `LAST_SEARCH=${pathQuery}`
  };
}