import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

interface LoginErrors {
  username?: string;
  password?: string;
}

interface LoginLocationState {
  from?: {
    pathname?: string;
  } | string;
}

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LoginLocationState | null;
  const from = state?.from;

  const redirectTo =
    typeof from === 'string'
      ? from
      : from?.pathname || '/';

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    const nextErrors: LoginErrors = {};

    if (!username.trim()) {
      nextErrors.username = 'Username is required';
    }

    if (!password) {
      nextErrors.password = 'Password is required';
    } else if (password.length < 6) {
      nextErrors.password =
        'Password must be at least 6 characters';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    login(username.trim());
    navigate(redirectTo, { replace: true });
  }

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-md">
        <Link
          to="/products"
          className="mb-4 inline-flex min-h-11 items-center rounded-lg bg-gray-900 px-5 py-3 font-medium text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          Back to catalog
        </Link>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Log in
          </h1>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setErrors((current) => ({
                    ...current,
                    username: undefined,
                  }));
                }}
                aria-invalid={Boolean(errors.username)}
                aria-describedby={
                  errors.username ? 'username-error' : undefined
                }
                className="min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              />

              {errors.username && (
                <p
                  id="username-error"
                  role="alert"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.username}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((current) => ({
                    ...current,
                    password: undefined,
                  }));
                }}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
                className="min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              />

              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="min-h-11 w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Log In
            </button>
          </form>
        </section>
      </div>
    </PageContainer>
  );
}

export default LoginPage;
