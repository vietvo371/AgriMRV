import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/Api';
import { saveToken } from '../utils/TokenManager';

interface User {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  role: string;
  profile_image?: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (userData: {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number: string;
    address: string;
    role: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const storedUser = await AsyncStorage.getItem('@AgriTrace:user');
      const storedToken = await AsyncStorage.getItem('@AgriTrace:token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading storage data:', error);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { customer, token } = response.data;

      await AsyncStorage.setItem('@AgriTrace:user', JSON.stringify(customer));
      await AsyncStorage.setItem('@AgriTrace:token', token);
      await saveToken(token);

      setUser(customer);
    } catch (error: any) {
      console.error('Error signing in:', error.response?.data);
      // Ném lỗi với định dạng chuẩn hóa
      if (error.response?.data) {
        throw {
          message: error.response.data.message,
          errors: error.response.data.errors || {},
          status: error.response.status
        };
      }
      // Nếu là lỗi khác (network, timeout...)
      throw {
        message: error.message || 'An error occurred',
        errors: {},
        status: error.response?.status || 500
      };
    }
  };

  const signUp = async (userData: {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number: string;
    address: string;
    role: string;
  }) => {
    try {
      console.log(userData);
      const response = await api.post('/auth/register', userData);
      console.log(response.data);
      const { customer, token } = response.data;

      await AsyncStorage.setItem('@AgriTrace:user', JSON.stringify(customer));
      await AsyncStorage.setItem('@AgriTrace:token', token);
      await saveToken(token);

      setUser(customer);
    } catch (error: any) {
      console.error('Error signing up:', error.response?.data);
      // Ném lỗi với định dạng chuẩn hóa
      if (error.response?.data) {
        throw {
          message: error.response.data.message,
          errors: error.response.data.errors || {},
          status: error.response.status
        };
      }
      // Nếu là lỗi khác (network, timeout...)
      throw {
        message: error.message || 'An error occurred during registration',
        errors: {},
        status: error.response?.status || 500
      };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@AgriTrace:user');
      await AsyncStorage.removeItem('@AgriTrace:token');
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error.response.data);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
} 