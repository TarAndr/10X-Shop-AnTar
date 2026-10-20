
export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  brand?: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  reviews: Review[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartItem {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  stock: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  promoCode?: string | null;
}

export interface AuthUser {
  username: string;
  isLoggedIn: boolean;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface CheckoutFormValues {
  fullName: string;
  email: string;
  address: string;
  city: string;
}
