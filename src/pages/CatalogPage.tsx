import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products.api';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import ProductGrid from '../components/ProductGrid';
import PageContainer from '../components/layout/PageContainer';

function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const { addItem } = useCart();

  function handleAddToCart(product: Product) {
    const added = addItem(product, 1);

    setCartMessage(
      added > 0
        ? `"${product.title}" added to cart.`
        : `No additional stock available for "${product.title}".`,
    );

    setToastVisible(true);
  }

  useEffect(() => {
    if (!toastVisible) return;

    const timer = window.setTimeout(() => {
      setToastVisible(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [toastVisible, cartMessage]);

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
      <PageContainer>
        <p role="status" className="text-gray-600">
          Loading products...
        </p>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <p role="alert" className="text-red-600">
          {error}
        </p>
      </PageContainer>
    );
  }

  if (products.length === 0) {
    return (
      <PageContainer>
        <p className="text-gray-600">No products found.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Products
      </h1>

      <ProductGrid
        products={products}
        onAddToCart={handleAddToCart}
      />

      {toastVisible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-10 right-13 z-50 max-w-sm rounded-lg bg-gray-900 px-5 py-4 text-sm text-white shadow-lg"
        >
          {cartMessage}
        </div>
      )}
    </PageContainer>
  );
}

export default CatalogPage;
