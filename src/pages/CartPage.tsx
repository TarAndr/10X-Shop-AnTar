import { Link, useLocation } from 'react-router';
import PageContainer from '../components/layout/PageContainer';
import { useCart } from '../context/CartContext';
import { discountedPrice, formatPrice } from '../utils/format';

function CartPage() {
  const { items, subtotal, setQuantity, removeItem, clear } = useCart();
  const location = useLocation();
  const navigationState = location.state as {
    message?: string;
  } | null;

  const checkoutMessage = navigationState?.message;

  if (items.length === 0) {
    return (
      <main>
        <PageContainer>
          {checkoutMessage && (
            <p
              role="status"
              className="mb-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900"
            >
              {checkoutMessage}
            </p>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping cart
          </h1>

          <p className="mt-8 text-gray-600">
            Your cart is empty.
          </p>

          <Link
            to="/"
            className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Browse products
          </Link>
        </PageContainer>
      </main>
    );
  }

  return (
    <main>
      <PageContainer>
        <h1 className="text-3xl font-bold text-gray-900">
          Shopping cart
        </h1>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section
            aria-label="Cart items"
            className="min-w-0 space-y-4"
          >
            {items.map((item) => {
              const unitPrice = discountedPrice(
                item.price,
                item.discountPercentage,
              );
              const lineTotal = Math.round(
                unitPrice * item.quantity * 100,
              ) / 100;

              return (
                <article
                  key={item.productId}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 sm:flex-row"
                >
                  <Link
                    to={`/products/${item.productId}`}
                    className="shrink-0 self-start"
                    aria-label={`View ${item.title}`}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      {item.title}
                    </Link>

                    <p className="mt-2 text-sm text-gray-600">
                      Price per item: {formatPrice(unitPrice)}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div
                        className="flex items-center gap-2"
                        aria-label={`Quantity for ${item.title}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              item.productId,
                              item.quantity - 1,
                            )
                          }
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.title}`}
                          className="min-h-11 min-w-11 rounded-lg border border-gray-300 text-lg disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span
                          className="min-w-8 text-center"
                          aria-live="polite"
                        >
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              item.productId,
                              item.quantity + 1,
                            )
                          }
                          disabled={item.quantity >= item.stock}
                          aria-label={`Increase quantity of ${item.title}`}
                          className="min-h-11 min-w-11 rounded-lg border border-gray-300 text-lg disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="min-h-11 px-2 text-sm font-medium text-red-700 hover:text-red-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="sm:min-w-28 sm:text-right">
                    <p className="text-sm text-gray-500">
                      Item total
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {formatPrice(lineTotal)}
                    </p>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="rounded-xl border border-gray-200 p-5 lg:sticky lg:top-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Order summary
            </h2>

            <div className="mt-5 flex items-center justify-between gap-4 text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 border-t border-gray-200 pt-4 font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <Link
              to="/checkout"
              className="mt-6 flex min-h-11 w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-center font-medium text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              Proceed to checkout
            </Link>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear the cart? This cannot be undone.')) {
                  clear();
                }
              }}
              className="mt-3 min-h-11 w-full rounded-lg border border-red-300 px-5 py-3 font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Clear cart
            </button>
          </aside>
        </div>
      </PageContainer>
    </main>
  );
}

export default CartPage;
