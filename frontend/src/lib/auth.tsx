import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, getToken, setToken } from "./api";

// export type User = {
//   name: string;
//   email: string;
//   role?: string;
//   skills?: string[];
//   projects?: string[];
//   experience?: string[];
//   avatar_url?: string;
// };

export type Project = {
  name: string;
  description: string;
};

export type Experience = {
  role: string;
  description: string;
};

export type User = {
  name: string;
  email: string;
  role?: string;

  skills?: string[];

  projects?: Project[];

  experience?: Experience[];

  avatar_url?: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api<User>("/auth/me");
      setUser(me);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api<{ access_token: string; token_type?: string }>(
      "/auth/login",
      { method: "POST", body: { email, password }, auth: false },
    );
    if (!res.access_token) throw new Error("No token returned from server");
    setToken(res.access_token);
    await refresh();
  };

  const register = async (name: string, email: string, password: string) => {
    await api<{ message: string }>(
      "/auth/register",
      { method: "POST", body: { name, email, password }, auth: false },
    );
    // Backend returns only a confirmation; sign the user in to grab a token.
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
