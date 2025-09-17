import axios from 'axios';
import {load} from 'cheerio';
import express from 'express';
import { ZenRows } from 'zenrows';

const ZENROWS_API_KEY = process.env.ZENROWS_API_KEY;

async function searchMercadoLivre(query: string) {
  try {
    const pathQuery = query.replace(/\s+/g, '-').toLowerCase();
    const encodedQuery = encodeURIComponent(query);
    const url = `https://lista.mercadolivre.com.br/${pathQuery}#D[A:${encodedQuery}]`;
    console.log(url);

    console.log(`Scraping: ${url}`);

    const client = new ZenRows(ZENROWS_API_KEY);
    const zenrows_response = await client.get(url, {
      headers: {
        "Cookie": `LAST_SEARCH=${pathQuery}`
      }
    });

    const raw_data = await zenrows_response.text();
    console.log(raw_data)
    console.log(`LAST_SEARCH=${pathQuery}`);

    const $ = load(raw_data);
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
  res.json({ message: 'MercadoLivre Scraper API is running!' });
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

async function stress() {
  const query = 'iphone';
  const url = `http://localhost:${PORT}/searchByQuery?query=${query}`;
  const requests = [];

  console.log(`Starting stress test: sending ${query} query 500 times...`);
  const startTime = Date.now();

  for (let i = 0; i < 500; i++) {
    requests.push(
      axios.get(url)
        .then(response => ({ success: true, status: response.status, index: i }))
        .catch(error => ({ success: false, error: error.message, index: i }))
    );
  }

  const results = await Promise.all(requests);
  const endTime = Date.now();

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\nStress test completed in ${endTime - startTime}ms`);
  console.log(`Total requests: 500`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success rate: ${(successful / 500 * 100).toFixed(2)}%`);

  if (failed > 0) {
    console.log('\nFailed requests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`Request ${r.index}: ${r.error}`);
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the search endpoint: http://localhost:${PORT}/searchByQuery?query=iphone`);
  console.log(`To run stress test, call stress() function`);
});

stress()
