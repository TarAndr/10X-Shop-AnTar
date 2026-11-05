import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { fetchProducts } from '../api/products.api';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import ProductGrid from '../components/ProductGrid';
import PageContainer from '../components/layout/PageContainer';

const PAGE_SIZE = 12;

function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedPage = Number(searchParams.get('page') ?? '1');

  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  useEffect(() => {
    const pageParam = searchParams.get('page');

    if (pageParam === null && currentPage === 1) {
      return;
    }

    if (pageParam === String(currentPage) && currentPage !== 1) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    if (currentPage === 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(currentPage));
    }

    setSearchParams(nextParams, { replace: true });
  }, [currentPage, searchParams, setSearchParams]);

  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      const nextParams = new URLSearchParams(searchParams);

      if (totalPages === 1) {
        nextParams.delete('page');
      } else {
        nextParams.set('page', String(totalPages));
      }

      setSearchParams(nextParams, { replace: true });
    }
  }, [currentPage, totalPages, searchParams, setSearchParams]);

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
        const data = await fetchProducts({
          limit: PAGE_SIZE,
          skip: (currentPage - 1) * PAGE_SIZE,
        });

        if (isActive) {
          setProducts(data.products);
          setTotal(data.total);
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
  }, [currentPage]);

  function handlePageChange(page: number) {
    const nextParams = new URLSearchParams(searchParams);

    if (page === 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(page));
    }

    setSearchParams(nextParams);
  }

  if (isLoading) {
    return (
      <PageContainer>
        <p role="status" className="text-text-secondary">
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
        <p className="text-text-secondary">No products found.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="mb-6 text-3xl font-bold text-text-primary">
        Products
      </h1>

      <ProductGrid
        products={products}
        onAddToCart={handleAddToCart}
      />

      {totalPages > 1 && (
        <nav
          aria-label="Product catalog pagination"
          className="mt-8 flex items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="cursor-pointer rounded-lg border border-border-default px-4 py-2 text-sm text-text-primary transition-colors hover:bg-page hover:border-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-text-secondary">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="cursor-pointer rounded-lg border border-border-default px-4 py-2 text-sm text-text-primary transition-colors hover:bg-page hover:border-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}

      {toastVisible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-13 right-13 z-50 max-w-sm rounded-lg bg-brand px-5 py-4 text-sm text-white shadow-lg"
        >
          {cartMessage}
        </div>
      )}
    </PageContainer>
  );
}

export default CatalogPage;
