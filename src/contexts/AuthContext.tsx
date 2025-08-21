import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/Api';
import { saveToken } from '../utils/TokenManager';

interface User {
  user_id: number;
  role: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  gps_location: string;
  org_name?: string;
  employee_id?: string;
  created_at: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  userRole: 'farmer' | 'bank' | 'coop' | null;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    dob: string;
    role: string;
    gps_location: string;
    org_name?: string;
    employee_id?: string;
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
      const storedUser = await AsyncStorage.getItem('@AgriCred:user');
      const storedToken = await AsyncStorage.getItem('@AgriCred:token');

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
      console.log('Sending login credentials:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      const { user, token } = response.data;

      // Ensure user data matches our interface
      const formattedUser: User = {
        user_id: user.user_id,
        role: user.role,
        name: user.name,
        dob: user.dob,
        phone: user.phone,
        email: user.email,
        gps_location: user.gps_location,
        org_name: user.org_name,
        employee_id: user.employee_id,
        created_at: user.created_at,
      };

      await AsyncStorage.setItem('@AgriCred:user', JSON.stringify(formattedUser));
      await AsyncStorage.setItem('@AgriCred:token', token);
      await saveToken(token);

      setUser(formattedUser);
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
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    dob: string;
    role: string;
    gps_location: string;
    org_name?: string;
    employee_id?: string;
  }) => {
    try {
      // Format the data to match the database schema
      const formattedData = {
        ...userData,
        // Convert GPS string to object for API
        gps_location: userData.gps_location.split(',').map(coord => coord.trim()).join(','),
        // Only include optional fields if they have values
        ...(userData.org_name ? { org_name: userData.org_name } : {}),
        ...(userData.employee_id ? { employee_id: userData.employee_id } : {}),
      };

      console.log('Sending registration data:', formattedData);
      const response = await api.post('/auth/register', formattedData);
      console.log('Registration response:', response.data);
      const { user, token } = response.data;

      await AsyncStorage.setItem('@AgriCred:user', JSON.stringify(user));
      await AsyncStorage.setItem('@AgriCred:token', token);
      await saveToken(token);

      setUser(user);
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
      await AsyncStorage.removeItem('@AgriCred:user');
      await AsyncStorage.removeItem('@AgriCred:token');
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error.response.data);
      throw error;
    }
  };

  const userRole = user?.role as 'farmer' | 'bank' | 'coop' | null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        userRole,
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