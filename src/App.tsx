import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import ScrollToTop from './components/layout/ScrollToTop';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';

import ProtectedRoute from './routes/ProtectedRoute';

const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center text-text-secondary">
                  Loading page...
                </div>
              }
            >
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<CatalogPage />} />
                  <Route
                    path="products"
                    element={<Navigate to="/" replace />}
                  />
                  <Route path="/products/:id" element={<ProductPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
