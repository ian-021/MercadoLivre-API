import express from 'express';
import { config } from './config/index.ts';
import { handleSearch, handleHealthCheck } from './controllers/searchController.js';

const app = express();

app.use(express.json());

app.get('/', handleHealthCheck);
app.get('/searchByQuery', handleSearch);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`Test the search endpoint: http://localhost:${config.port}/searchByQuery?query=iphone`);
});

export default app;
