// CatalogPage.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { fetchProducts, fetchProductCategories } from '../api/products.api';
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
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const requestedPage = Number(searchParams.get('page') ?? '1');

  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const selectedCategory = searchParams.get('category') ?? '';

  useEffect(() => {
    let isActive = true;

    async function loadCategories() {
      try {
        const data = await fetchProductCategories();

        if (isActive) {
          setCategories(data);
        }
      } catch {
        if (isActive) {
          setCategoriesError('Unable to load product categories.');
        }
      } finally {
        if (isActive) {
          setIsCategoriesLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (
      isCategoriesLoading ||
      categoriesError ||
      !selectedCategory ||
      categories.includes(selectedCategory)
    ) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete('category');
    nextParams.delete('page');

    setSearchParams(nextParams, { replace: true });
  }, [
    categories,
    categoriesError,
    isCategoriesLoading,
    searchParams,
    selectedCategory,
    setSearchParams,
  ]);

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
    if (isCategoriesLoading) return;

    async function loadProducts() {
      setIsLoading(true);
      setError(null);
      setTotal(0);

      try {
        const data = await fetchProducts({
          limit: PAGE_SIZE,
          skip: (currentPage - 1) * PAGE_SIZE,
          category: selectedCategory || undefined,
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
  }, [currentPage, selectedCategory, isCategoriesLoading]);

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

  return (
    <PageContainer>
      <h1 className="mb-6 text-3xl font-bold text-text-primary">
        Products
      </h1>

      <div className="mb-6 flex flex-col items-center gap-3 md:flex-row">
        <label
          htmlFor="category-filter"
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          Category
        </label>

        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) => {
            const nextParams = new URLSearchParams(searchParams);

            if (event.target.value) {
              nextParams.set('category', event.target.value);
            } else {
              nextParams.delete('category');
            }

            nextParams.delete('page');

            setSearchParams(nextParams);
          }}
          disabled={isCategoriesLoading || Boolean(categoriesError)}
          className="w-full max-w-xs cursor-pointer rounded-lg border border-border-default bg-surface px-4 py-2 text-sm text-text-primary outline-none transition-colors hover:border-brand focus:border-brand disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category
                .replaceAll('-', ' ')
                .replace(/\b\w/g, (letter) => letter.toUpperCase())}
            </option>
          ))}
        </select>

        {categoriesError && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {categoriesError}
          </p>
        )}
      </div>

      {products.length > 0 ? (
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <p className="text-text-secondary">No products found.</p>
      )}

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
