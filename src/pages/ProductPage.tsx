import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useCart } from '../context/CartContext';
import { fetchProductById } from '../api/products.api';
import { discountedPrice, formatPrice } from '../utils/format';
import PageContainer from '../components/layout/PageContainer';
import type { Product } from '../types';

function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, items } = useCart();
  const [cartMessage, setCartMessage] = useState('');

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
          setSelectedImage(0);
          setQuantity(1);
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
    <PageContainer>
      <Link
        to="/"
        className="mb-4 inline-flex min-h-11 items-center rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
      >
        Back to catalog
      </Link>

      {isLoading && (
        <p role="status" className="text-gray-600">
          Loading product...
        </p>
      )}

      {!isLoading && error && (
        <section className="py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Page not found
          </h1>

          <p role="alert" className="mt-3 text-gray-600">
            The product you are looking for does not exist.
          </p>
        </section>
      )}


      {!isLoading && product && (
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <div className="flex h-80 items-center justify-center rounded-xl bg-white p-4">
              <img
                src={product.images[selectedImage] ?? product.thumbnail}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={`${product.id}-image-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1} of ${product.title}`}
                    aria-pressed={selectedImage === index}
                    className={`flex h-20 w-20 items-center justify-center rounded-lg border p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${selectedImage === index
                      ? 'border-gray-900'
                      : 'border-gray-200'
                      }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {product.title}
            </h1>

            <p className="mt-4 text-gray-600">{product.description}</p>

            <p className="mt-4 text-lg font-semibold text-gray-900">
              {formatPrice(discountedPrice(product.price, product.discountPercentage))}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Rating: {product.rating.toFixed(1)} / 5
            </p>

            <p className="mt-2 text-sm text-gray-600">
              {product.stock === 0
                ? 'Out of stock'
                : product.stock <= 5
                  ? `Only ${product.stock} left`
                  : 'In stock'}
            </p>

            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-gray-900">
                Quantity
              </p>

              <div className="flex justify-center items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={product.stock === 0 || quantity <= 1}
                  aria-label="Decrease quantity"
                  className="min-h-11 min-w-11 rounded-lg border border-gray-300 text-lg disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>

                <span
                  aria-live="polite"
                  className="min-w-8 text-center font-medium"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => Math.min(product.stock, current + 1))
                  }
                  disabled={product.stock === 0 || quantity >= product.stock}
                  aria-label="Increase quantity"
                  className="min-h-11 min-w-11 rounded-lg border border-gray-300 text-lg disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <div>
                <button
                  type="button"
                  disabled={
                    product.stock === 0 ||
                    quantity > product.stock - (items.find((item) => item.productId === product.id)?.quantity ?? 0)
                  }
                  onClick={() => {
                    const added = addItem(product, quantity);

                    setCartMessage(
                      added > 0
                        ? `Added ${added} item(s) to cart.`
                        : 'No additional stock available.',
                    );
                  }}
                  className="mt-5 min-h-11 w-full rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
                >
                  Add to cart
                </button>

                {cartMessage && (
                  <p role="status" className="mt-3 text-sm text-gray-600">
                    {cartMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </PageContainer>
  );
}

export default ProductPage;
