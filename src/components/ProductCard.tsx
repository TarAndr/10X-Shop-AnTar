
import { Link } from 'react-router';
import type { Product } from '../types';
import { discountedPrice, formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const finalPrice = discountedPrice(
    product.price,
    product.discountPercentage,
  );

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Link
        to={`/products/${product.id}`}
        aria-label={`View details for ${product.title}`}
        className="rounded-t-xl focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gray-900"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-48 w-full bg-gray-50 object-contain p-4"
          loading="lazy"
        />

        <h2 className="line-clamp-2 min-h-12 px-4 font-semibold text-gray-900 hover:underline">
          {product.title}
        </h2>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(finalPrice)}
          </span>

          {product.discountPercentage > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-gray-600">
          Rating: {product.rating.toFixed(1)} / 5
        </p>

        <div className="mt-2">
          {isOutOfStock ? (
            <span className="text-sm font-medium text-red-600">
              Out of stock
            </span>
          ) : isLowStock ? (
            <span className="text-sm font-medium text-amber-700">
              Only {product.stock} left
            </span>
          ) : (
            <span className="text-sm text-green-700">In stock</span>
          )}
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => onAddToCart(product)}
          className="mt-auto min-h-11 w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
        >
          {isOutOfStock ? 'Unavailable' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
