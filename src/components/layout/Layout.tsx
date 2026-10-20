
import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
