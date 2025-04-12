"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getToken,
  isTokenExpired,
  clearToken,
  scheduleAutoLogout,
  setToken as setTokenFromLib,
} from "@/lib/auth";
import { useRouter } from "next/navigation";

type AuthContextType = {
  token: string | null;
  isLoggedIn: boolean;
  logout: () => void;
  storeToken: (token: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoggedIn: false,
  logout: () => {},
  storeToken: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const stored = getToken();
    if (stored && !isTokenExpired(stored)) {
      setToken(stored);
      scheduleAutoLogout(stored, logout);
    } else {
      clearToken();
      router.push("/login");
    }
  }, []);

  // store the token after successful login
  const storeToken = (token: string) => {
    setTokenFromLib(token);
    setToken(token);
    router.push("/");

    scheduleAutoLogout(token, logout);
  };

  const logout = () => {
    clearToken();
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ token, isLoggedIn: !!token, logout, storeToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
