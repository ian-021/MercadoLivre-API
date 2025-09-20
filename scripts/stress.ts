
import axios from 'axios';

async function stress() {
  const query = 'carro';
  const PORT = process.env.PORT || 3000;
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
}

stress().catch(console.error);
