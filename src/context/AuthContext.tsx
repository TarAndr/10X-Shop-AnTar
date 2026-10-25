import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('shop_user');

      if (!savedUser) {
        return null;
      }

      const parsedUser: unknown = JSON.parse(savedUser);

      if (
        typeof parsedUser === 'object' &&
        parsedUser !== null &&
        'username' in parsedUser &&
        typeof parsedUser.username === 'string' &&
        parsedUser.username.trim().length > 0
      ) {
        return {
          username: parsedUser.username,
          isLoggedIn: true,
        };
      }

      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('shop_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('shop_user');
      }
    } catch {
      // Authentication remains available for the current session.
    }
  }, [user]);

  function login(username: string): void {
    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
      return;
    }

    setUser({
      username: normalizedUsername,
      isLoggedIn: true,
    });
  }

  function logout(): void {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user?.isLoggedIn ?? false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
