import { Link } from 'react-router';
import PageContainer from '../components/layout/PageContainer';

function NotFoundPage() {
  return (
    <main>
      <PageContainer>
        <section className="py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Page not found
          </h1>

          <p className="mt-4 text-gray-600">
            The page you are looking for does not exist.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-900 px-5 py-2 font-medium text-white transition hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Go to catalog
          </Link>
        </section>
      </PageContainer>
    </main>
  );
}

export default NotFoundPage;
