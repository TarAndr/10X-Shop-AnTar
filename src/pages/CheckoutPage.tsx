import { useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { Link, Navigate } from 'react-router';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { CartItem, CheckoutFormValues } from '../types';
import { discountedPrice, formatPrice } from '../utils/format';

type CheckoutErrors = Partial<Record<keyof CheckoutFormValues, string>>;

interface OrderSummary {
  customer: CheckoutFormValues;
  items: CartItem[];
  total: number;
}

function validate(
  values: CheckoutFormValues,
): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (values.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters';
  }

  const email = values.email.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (values.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters';
  }

  if (!values.city.trim()) {
    errors.city = 'City is required';
  }

  return errors;
}

function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();

  const [values, setValues] = useState<CheckoutFormValues>(() => ({
    fullName: user?.username ?? '',
    email: '',
    address: '',
    city: '',
  }));

  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderSummary | null>(null);

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const { name, value } = event.target;
    const field = name as keyof CheckoutFormValues;

    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isSubmitting) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      const orderSnapshot: OrderSummary = {
        customer: {
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
        },
        items: items.map((item) => ({ ...item })),
        total: subtotal,
      };

      // Simulate an asynchronous order submission.
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 600);
      });

      setOrder(orderSnapshot);
      clear();
    } finally {
      setIsSubmitting(false);
    }
  }

  // Check the order first: a successful order clears the cart,
  // but the confirmation screen must remain visible.
  if (order) {
    return (
      <PageContainer>
        <section
          aria-live="polite"
          className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Thank you! Your order has been placed.
          </h1>

          <p className="mb-6 text-gray-600">
            Order confirmation for {order.customer.fullName}.
          </p>

          <h2 className="mb-3 text-lg font-semibold">
            Order summary
          </h2>

          <ul className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between gap-4 py-3"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(
                    discountedPrice(
                      item.price,
                      item.discountPercentage,
                    ) * item.quantity,
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h2 className="mb-2 font-semibold">
              Delivery details
            </h2>
            <p>{order.customer.fullName}</p>
            <p>{order.customer.email}</p>
            <p>{order.customer.address}</p>
            <p>{order.customer.city}</p>
          </div>

          <Link
            to="/products"
            className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-700"
          >
            Continue shopping
          </Link>
        </section>
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return (
      <Navigate
        to="/cart"
        replace
        state={{
          message: 'Your cart is empty. Add products before checkout.',
        }}
      />
    );
  }

  const fields: {
    name: keyof CheckoutFormValues;
    label: string;
    type: string;
    autoComplete: string;
  }[] = [
    {
      name: 'fullName',
      label: 'Full name',
      type: 'text',
      autoComplete: 'name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      autoComplete: 'email',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      autoComplete: 'street-address',
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      autoComplete: 'address-level2',
    },
  ];

  return (
    <PageContainer>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Checkout
      </h1>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">
            Delivery information
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            {fields.map((field) => (
              <div key={field.name} className="mb-5">
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  value={values[field.name]}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors[field.name])}
                  aria-describedby={
                    errors[field.name]
                      ? `${field.name}-error`
                      : undefined
                  }
                  className="min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                />

                {errors[field.name] && (
                  <p
                    id={`${field.name}-error`}
                    role="alert"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-11 w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Placing order...' : 'Place order'}
            </button>
          </form>
        </section>

        <aside className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Order summary
          </h2>

          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between gap-4 py-3 text-sm"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(
                    discountedPrice(
                      item.price,
                      item.discountPercentage,
                    ) * item.quantity,
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 font-bold">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <Link
            to="/cart"
            className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to cart
          </Link>
        </aside>
      </div>
    </PageContainer>
  );
}

export default CheckoutPage;
