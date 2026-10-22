import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products.api';
import type { Product } from '../types';
import ProductGrid from '../components/ProductGrid';
import PageContainer from '../components/layout/PageContainer';

function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleAddToCart(product: Product) {
    console.info('Cart integration is not implemented yet:', product.id);
  }

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
      <main>
        <PageContainer>
          <p role="status" className="text-gray-600">
            Loading products...
          </p>
        </PageContainer>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <PageContainer>
          <p role="alert" className="text-red-600">
            {error}
          </p>
        </PageContainer>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main>
        <PageContainer>
          <p className="text-gray-600">No products found.</p>
        </PageContainer>
      </main>
    );
  }

  return (
    <main>
      <PageContainer>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Products
        </h1>

        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
        />
      </PageContainer>
    </main>
  );
}

export default CatalogPage;
