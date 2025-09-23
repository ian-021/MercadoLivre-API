import type { Request, Response } from 'express';
import { searchMercadoLivre } from '../services/scraper.js';
import type { SearchResponse, ErrorResponse, PaginationMetadata } from '../types/index.js';

export async function handleSearch(req: Request, res: Response): Promise<void> {
  try {
    const { query, page, limit } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json({
        error: 'Query parameter is required and must be a string'
      } as ErrorResponse);
      return;
    }

    const pageNum = page ? parseInt(page as string) : 1;
    const limitNum = limit ? parseInt(limit as string) : 50;

    if (pageNum < 1) {
      res.status(400).json({
        error: 'Page must be a positive integer'
      } as ErrorResponse);
      return;
    }

    if (limitNum < 1 || limitNum > 50) {
      res.status(400).json({
        error: 'Limit must be between 1 and 50'
      } as ErrorResponse);
      return;
    }

    const results = await searchMercadoLivre(query, pageNum, limitNum);

    const pagination: PaginationMetadata = {
      page: pageNum,
      limit: limitNum,
      total: results.length,
      totalPages: Math.ceil(results.length / limitNum),
      hasNext: results.length === limitNum,
      hasPrev: pageNum > 1
    };

    res.json({
      query,
      count: results.length,
      results,
      pagination
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
