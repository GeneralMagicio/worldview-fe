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
} from "@/lib/auth";
import { useRouter } from "next/navigation";

type AuthContextType = {
  token: string | null;
  isLoggedIn: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoggedIn: false,
  logout: () => {},
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

  const logout = () => {
    clearToken();
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn: !!token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
