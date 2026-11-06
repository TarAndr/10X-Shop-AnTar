// products.api.ts
import type { Product, ProductsResponse } from '../types';
import { apiClient } from './api-client';

const API_URL = 'https://dummyjson.com/products';

interface FetchProductsParams {
  limit?: number;
  skip?: number;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
  signal?: AbortSignal;
}

export async function fetchProducts({
  limit = 12,
  skip = 0,
  category,
  sortBy,
  order,
  search,
  signal,
}: FetchProductsParams = {}): Promise<ProductsResponse> {
  const endpoint = search
    ? `${API_URL}/search`
    : category
      ? `${API_URL}/category/${encodeURIComponent(category)}`
      : API_URL;

  const url = new URL(endpoint);

  url.searchParams.set('limit', String(limit));
  url.searchParams.set('skip', String(skip));

  if (search) {
    url.searchParams.set('q', search);
  }

  if (sortBy) {
    url.searchParams.set('sortBy', sortBy);
  }

  if (order) {
    url.searchParams.set('order', order);
  }

  const data: unknown = await apiClient.get(url, { signal });

  if (
    typeof data !== 'object' ||
    data === null ||
    !('products' in data) ||
    !Array.isArray(data.products) ||
    !('total' in data) ||
    typeof data.total !== 'number' ||
    !('skip' in data) ||
    typeof data.skip !== 'number' ||
    !('limit' in data) ||
    typeof data.limit !== 'number'
  ) {
    throw new Error('Invalid products response');
  }

  return data as ProductsResponse;
}

export async function fetchProductById(id: number): Promise<Product> {
  const data: unknown = await apiClient.get(`${API_URL}/${id}`);

  if (
    typeof data !== 'object' ||
    data === null ||
    !('id' in data) ||
    typeof data.id !== 'number' ||
    !('title' in data) ||
    typeof data.title !== 'string' ||
    !('price' in data) ||
    typeof data.price !== 'number'
  ) {
    throw new Error('Invalid product response');
  }

  return data as Product;
}

export async function fetchProductCategories(): Promise<string[]> {
  const data: unknown = await apiClient.get(
    `${API_URL}/category-list`,
  );

  if (
    !Array.isArray(data) ||
    !data.every((category) => typeof category === 'string')
  ) {
    throw new Error('Invalid categories response');
  }

  return data;
}