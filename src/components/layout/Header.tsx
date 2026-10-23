import { NavLink } from 'react-router';
import { useCart } from '../../context/CartContext';

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700',
  ].join(' ');

function Header() {
  const { totalQuantity } = useCart();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <NavLink
          to="/"
          end
          className="text-2xl font-bold text-blue-700"
        >
          10X Shop
        </NavLink>

        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap items-center gap-1">
            <li>
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={navLinkClass}>
                Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className={navLinkClass}>
                Cart
                {totalQuantity > 0 && (
                  <span className="inline-flex min-w-6 h-6 items-center justify-center rounded-full bg-red-600 ms-2 px-1.5 text-xs font-bold text-white">
                    {totalQuantity}
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
