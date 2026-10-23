
import type { Product, ProductsResponse } from '../types';

const API_URL = 'https://dummyjson.com/products';

interface FetchProductsParams {
  limit?: number;
  skip?: number;
}

export async function fetchProducts({
  limit = 12,
  skip = 0,
}: FetchProductsParams = {}): Promise<ProductsResponse> {
  const url = new URL(API_URL);

  url.searchParams.set('limit', String(limit));
  url.searchParams.set('skip', String(skip));

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

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
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch product: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

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
