import { OxylabsResidentialProxy } from '@scrapechain/oxylabs';
import {ScrapeChain} from 'scrapechain';
import {load} from 'cheerio';
import express from 'express';

const scraper = new ScrapeChain();

async function searchMercadoLivre(query: string) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://lista.mercadolivre.com.br/${encodedQuery.replace(/%20/g, '-')}#D[A:${encodedQuery}]`;

    console.log(`Scraping: ${url}`);
    const html = await scraper.scrapeHttp(url);

    const $ = load(html);
    const items = $(".ui-search-layout__item");

    const extractedData = items.map((index, element) => {
      const $item = $(element);

      return {
        title: $item.find('.poly-component__title').text().trim(),
        price: $item.find('.andes-money-amount__fraction').text().trim(),
        currency: $item.find('.andes-money-amount__currency-symbol').text().trim(),
        link: $item.find('.ui-search-item__group__element a').attr('href'),
        condition: $item.find('.poly-component__item-condition').text().trim(),
        Seller: $item.find('.poly-component__seller').text().trim()
      };
    }).get();

    return extractedData;
  } catch (error) {
    console.error('Error scraping MercadoLivre:', error);
    throw error;
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', async (_req, res) => {
  try {
    const defaultData = await searchMercadoLivre('iphone x');
    res.json(defaultData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch default data' });
  }
});

app.get('/searchByQuery', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Query parameter is required and must be a string'
      });
    }

    const results = await searchMercadoLivre(query);

    res.json({
      query,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Failed to search MercadoLivre',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the search endpoint: http://localhost:${PORT}/searchByQuery?query=iphone`);
});
