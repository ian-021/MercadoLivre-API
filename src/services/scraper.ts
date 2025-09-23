import { load } from 'cheerio';
import { ZenRows } from 'zenrows';
import { config } from '../config/index.js';
import { buildMercadoLivreUrl, formatPathQuery, buildHeaders } from '../utils/queryHelpers.js';
import type { ProductItem } from '../types/index.js';

const client = new ZenRows(config.zenrowsApiKey);

function findByMultipleSelectors($element: any, selectors: string[]): string | null {
  for (const selector of selectors) {
    const result = $element.find(selector).text().trim();
    if (result) return result;
  }
  return null;
}

function findAttributeByMultipleSelectors($element: any, selectors: string[], attribute: string): string | null {
  for (const selector of selectors) {
    const result = $element.find(selector).attr(attribute);
    if (result) return result;
  }
  return null;
}

export async function searchMercadoLivre(query: string, page: number = 1, limit: number = 50): Promise<ProductItem[]> {
  try {
    const pathQuery = formatPathQuery(query);
    const url = buildMercadoLivreUrl(query, page, limit);
    const headers = buildHeaders(pathQuery);

    console.log(`Scraping: ${url}`);
    console.log(`LAST_SEARCH=${pathQuery}`);

    const zenrowsResponse = await client.get(
      url,
      { "custom_headers": "true", "premium_proxy": "true" },
      { headers }
    );

    const rawData = await zenrowsResponse.text();

    const $ = load(rawData);
    const items = $(".ui-search-layout__item");

    const arr = []

    items.each((i, el) => {
      const $i = $(el);

      const title = $i.find('.poly-component__title').text().trim() || null

      const mainPrice = $i.find('.andes-money-amount--cents-superscript .andes-money-amount__fraction').text().trim() || null
      const cents = $i.find('.andes-money-amount__cents').text().trim() || null
      const current_price = mainPrice ? (cents ? mainPrice + cents : mainPrice) : null

      const currency = $i.find('.andes-money-amount--cents-superscript .andes-money-amount__currency-symbol').text().trim() || null

      const link = $i.find('a.poly-component__title').attr('href') || null

      const condition = findByMultipleSelectors($i, [
        '.poly-component__item-condition',
        '.poly-component__visit-history',
      ]) || null

      const seller = $i.find('.poly-component__seller').text().trim() || null

      arr.push({
        title,
        current_price,
        currency,
        link,
        condition,
        seller
      })
    })


    return arr;


  } catch (error) {
    console.error('Error scraping MercadoLivre:', error);
    throw error;
  }
}
