import {
  createContext,
  useContext,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => number;
  getCartQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  function getCartQuantity(productId: number): number {
    return items.find((item) => item.productId === productId)?.quantity ?? 0;
  }

  function addToCart(product: Product, quantity: number): number {
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
    const availableStock = Math.max(0, product.stock - currentQuantity);
    const quantityToAdd = Math.min(quantity, availableStock);

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

  return (
    <CartContext.Provider
      value={{ items, addToCart, getCartQuantity }}
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
