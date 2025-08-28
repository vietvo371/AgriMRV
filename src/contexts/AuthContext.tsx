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
  userRole: 'farmer' | 'bank' | 'cooperative' | 'verifier' | 'government' | 'buyer' | null;
  signIn: (credentials: { identifier: string; password: string; type: string }) => Promise<void>;
  signUp: (userData: any) => Promise<void>;
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

  const signIn = async (credentials: { identifier: string; password: string; type: string }) => {
    try {
      console.log('Sending login credentials:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      const payload = response.data?.data ?? response.data;
      const user = payload?.user ?? payload?.user_data ?? payload;
      const token = payload?.token ?? payload?.access_token;

      // Ensure user data matches our interface
      const formattedUser: User = {
        user_id: user.user_id ?? user.id,
        role: user.role ?? user.user_type,
        name: user.name ?? user.full_name,
        dob: user.dob ?? user.date_of_birth,
        phone: user.phone,
        email: user.email,
        gps_location: user.gps_location ?? (
          user.gps_latitude != null && user.gps_longitude != null
            ? `${user.gps_latitude},${user.gps_longitude}`
            : ''
        ),
        org_name: user.org_name ?? user.organization_name,
        employee_id: user.employee_id,
        created_at: user.created_at,
      };
      await AsyncStorage.setItem('@AgriCred:user', JSON.stringify(formattedUser));
      if (token) {
        await AsyncStorage.setItem('@AgriCred:token', token);
        await saveToken(token);
      }

      setUser(formattedUser);
    } catch (error: any) {
      console.log('Error signing in:', error.response?.data);
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

  const signUp = async (userData: any) => {
    try {
      // Format the data to match the database schema
      const formattedData = {
        email: userData.email,
        phone: userData.phone,
        full_name: userData.full_name ?? userData.name,
        date_of_birth: userData.date_of_birth ?? userData.dob,
        user_type: userData.user_type ?? userData.role,
        gps_latitude: userData.gps_latitude ?? userData.gps_location?.split(',')[0]?.trim(),
        gps_longitude: userData.gps_longitude ?? userData.gps_location?.split(',')[1]?.trim(),
        organization_name: userData.organization_name ?? userData.org_name ?? undefined,
        organization_type: userData.organization_type ?? (userData.role === 'bank' ? 'bank' : (userData.role === 'cooperative' ? 'cooperative' : undefined)),
        address: userData.address,
        password: userData.password,
        password_confirmation: userData.password_confirmation,
      };

      console.log('Sending registration data:', formattedData);
      const response = await api.post('/auth/register', formattedData);
      console.log('Registration response:', response.data);
      const payload = response.data?.data ?? response.data;
      const user = payload?.user ?? payload;
      const token = payload?.token ?? payload?.access_token;

      await AsyncStorage.setItem('@AgriCred:user', JSON.stringify(user));
      if (token) {
        await AsyncStorage.setItem('@AgriCred:token', token);
        await saveToken(token);
      }

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
      try {
        await api.post('/auth/logout');
      } catch (e) {
        // ignore network/logout errors
      }
      await AsyncStorage.removeItem('@AgriCred:user');
      await AsyncStorage.removeItem('@AgriCred:token');
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error.response.data);
      throw error;
    }
  };

  const userRole = (user?.role ?? null) as 'farmer' | 'bank' | 'cooperative' | 'verifier' | 'government' | 'buyer' | null;

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