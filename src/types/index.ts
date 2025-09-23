export interface ProductItem {
  title: string | null;
  current_price: string | null;
  currency: string | null;
  link: string | null;
  condition: string | null;
  seller: string | null;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: ProductItem[];
  pagination: PaginationMetadata;
}

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}