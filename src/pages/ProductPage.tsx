import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { fetchProductById } from '../api/products.api';
import PageContainer from '../components/layout/PageContainer';
import type { Product } from '../types';

function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProduct() {
      setProduct(null);
      setError(null);
      setIsLoading(true);

      const productId = Number(id);

      if (!id || !Number.isInteger(productId) || productId <= 0) {
        setError('Product not found.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchProductById(productId);

        if (isActive) {
          setProduct(data);
        }
      } catch {
        if (isActive) {
          setError('Product not found.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      isActive = false;
    };
  }, [id]);

  return (
    <main>
      <PageContainer>
        {isLoading && (
          <p role="status" className="text-gray-600">
            Loading product...
          </p>
        )}

        {!isLoading && error && (
          <section>
            <h1 className="text-2xl font-bold text-gray-900">
              Page not found
            </h1>

            <p role="alert" className="mt-3 text-gray-600">
              The product you are looking for does not exist.
            </p>

            <Link
              to="/products"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-900 px-5 py-2 font-medium text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              Go to catalog
            </Link>
          </section>
        )}

        {!isLoading && product && (
          <section>
            <h1 className="text-2xl font-bold text-gray-900">
              {product.title}
            </h1>

            <p className="mt-4 text-gray-600">
              {product.description}
            </p>
          </section>
        )}
      </PageContainer>
    </main>
  );
}

export default ProductPage;
