import { Link } from 'react-router';
import PageContainer from '../components/layout/PageContainer';

function NotFoundPage() {
  return (
    <PageContainer>
      <section className="py-12 text-center">
        <h1 className="text-3xl font-bold text-text-primary">
          Page not found
        </h1>

        <p className="mt-4 text-text-secondary">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 py-2 font-medium text-white transition hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Go to catalog
        </Link>
      </section>
    </PageContainer>
  );
}

export default NotFoundPage;
