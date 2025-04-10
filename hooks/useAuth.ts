import { isTokenExpired } from "../lib/auth";

export const useAuth = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const isLoggedIn = token && !isTokenExpired(token);

  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return { token, isLoggedIn, logout };
};
