import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { login as apiLogin, logout as apiLogout, getCurrentUser } from "../api";

export interface User {
  id: number;
  ten_dang_nhap: string;
  email: string;
  ho: string;
  ten: string;
  vai_tro: string;
  anh_dai_dien?: string;
}

export type UserRole = 'hoc_vien' | 'giang_vien' | 'admin';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isStudent: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "lms_auth_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const result = await apiLogin(username, password);
      if (result.user) {
        const userData = {
          id: result.user.id,
          ten_dang_nhap: result.user.ten_dang_nhap,
          email: result.user.email,
          ho: result.user.ho,
          ten: result.user.ten,
          vai_tro: result.user.vai_tro,
          anh_dai_dien: result.user.anh_dai_dien,
        };
        setUser(userData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isStudent = user?.vai_tro === 'hoc_vien';
  const isTeacher = user?.vai_tro === 'giang_vien';
  const isAdmin = user?.vai_tro === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isStudent, isTeacher, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
