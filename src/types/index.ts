export interface ProductItem {
  title: string | null;
  price: string | null;
  currency: string | null;
  link: string | null;
  condition: string | null;
  Seller: string | null;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: ProductItem[];
}

export interface ErrorResponse {
  error: string;
  message?: string;
}