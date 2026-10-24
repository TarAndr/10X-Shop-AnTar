import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  addItem: (product: Product, quantity: number) => number;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
}

const STORAGE_KEY = 'shop_cart';

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.productId === 'number' &&
    Number.isInteger(item.productId) &&
    typeof item.title === 'string' &&
    typeof item.thumbnail === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.discountPercentage === 'number' &&
    Number.isFinite(item.discountPercentage) &&
    item.discountPercentage >= 0 &&
    item.discountPercentage <= 100 &&
    typeof item.stock === 'number' &&
    Number.isInteger(item.stock) &&
    item.stock >= 0 &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= item.stock
  );
}

function loadCart(): CartItem[] {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (storedValue === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The cart remains usable in memory if storage is unavailable.
    }
  }, [items]);

  function addItem(product: Product, quantity: number): number {
    if (
      !Number.isFinite(quantity) ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      product.stock < 1
    ) {
      return 0;
    }

    const existingItem = items.find(
      (item) => item.productId === product.id,
    );
    const currentQuantity = existingItem?.quantity ?? 0;
    const quantityToAdd = Math.min(
      quantity,
      Math.max(0, product.stock - currentQuantity),
    );

    if (quantityToAdd === 0) {
      return 0;
    }

    setItems((currentItems) => {
      const itemExists = currentItems.some(
        (item) => item.productId === product.id,
      );

      if (itemExists) {
        return currentItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: Math.min(
                  product.stock,
                  item.quantity + quantityToAdd,
                ),
                stock: product.stock,
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          productId: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
          discountPercentage: product.discountPercentage,
          stock: product.stock,
          quantity: quantityToAdd,
        },
      ];
    });

    return quantityToAdd;
  }

  function removeItem(productId: number): void {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  }

  function setQuantity(productId: number, quantity: number): void {
    if (!Number.isInteger(quantity)) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.stock)),
            }
          : item,
      ),
    );
  }

  function clear(): void {
    setItems([]);
  }

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = Math.round(
    items.reduce((total, item) => {
      const discountedPrice =
        item.price * (1 - item.discountPercentage / 100);

      return total + discountedPrice * item.quantity;
    }, 0) * 100,
  ) / 100;

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        subtotal,
        addItem,
        removeItem,
        setQuantity,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
