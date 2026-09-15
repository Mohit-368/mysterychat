import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./lib";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/auth/me").then((data) => setUser(data.user)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const logout = async () => { await api("/auth/logout", { method: "POST" }).catch(() => {}); setUser(null); };
  return <AuthContext.Provider value={{ user, setUser, logout, loading }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
