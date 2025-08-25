import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { User, LoginResponse } from "../types";
import { apiService } from "../services/apiService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        apiService.setAuthToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to load auth data:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      const loginResponse = (await apiService.login(
        email,
        password
      )) as LoginResponse;

      if (!loginResponse.success) {
        return false;
      }

      // if (loginResponse.role !== 'User') {
      //   return false;
      // }

      const userDataResponse = (await apiService.getUserById(
        loginResponse.id
      )) as User[];

      if (!userDataResponse || userDataResponse.length === 0) {
        return false;
      }

      let userData = userDataResponse[0];

      try {
        const walletDataResponse = (await apiService.getWalletUserByUserId(
          loginResponse.id
        )) as User[];

        if (walletDataResponse && walletDataResponse.length > 0) {
          userData = {
            ...userData,
            balance: walletDataResponse[0].balance,
          };
        }
      } catch (err) {
        console.error("Failed to fetch wallet data:", err);
      }

      await SecureStore.setItemAsync(TOKEN_KEY, loginResponse.accessToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));

      setToken(loginResponse.accessToken);
      setUser(userData);
      apiService.setAuthToken(loginResponse.accessToken);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);

    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update stored user data:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
