
import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products.api';
import type { Product } from '../types';

function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchProducts();

        if (isActive) {
          setProducts(data.products);
        }
      } catch {
        if (isActive) {
          setError('Unable to load products. Please try again.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <p role="status" className="text-gray-600">
          Loading products...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <p role="alert" className="text-red-600">
          {error}
        </p>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-gray-600">No products found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Products
      </h1>

      <p className="text-gray-600">
        Loaded {products.length} products successfully.
      </p>
    </main>
  );
}

export default CatalogPage;
