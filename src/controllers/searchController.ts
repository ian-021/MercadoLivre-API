import type { Request, Response } from 'express';
import { searchMercadoLivre } from '../services/scraper.js';
import type { SearchResponse, ErrorResponse } from '../types/index.js';

export async function handleSearch(req: Request, res: Response): Promise<void> {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json({
        error: 'Query parameter is required and must be a string'
      } as ErrorResponse);
      return;
    }

    const results = await searchMercadoLivre(query);

    res.json({
      query,
      count: results.length,
      results
    } as SearchResponse);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Failed to search MercadoLivre',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ErrorResponse);
  }
}

export async function handleHealthCheck(_req: Request, res: Response): Promise<void> {
  res.json({ message: 'MercadoLivre Scraper API is running!' });
}
