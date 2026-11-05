import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-page text-text-primary">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-2">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
