import axios from "axios";
import { Platform } from 'react-native';
import { deriveDashboardStats, deriveRecentBatches, mockUsers } from './mockData';
import { getToken, saveToken } from "./TokenManager";

// Types
export interface DashboardStats {
  batches: {
    total: number;
    trend: { value: number; isPositive: boolean; }
  };
  qr_scans: {
    total: number;
    trend: { value: number; isPositive: boolean; }
  };
  products: {
    total: number;
    trend: { value: number; isPositive: boolean; }
  };
}

export interface Batch {
  id: string;
  product_name: string;
  category: string;
  weight: number;
  harvest_date: string;
  cultivation_method: string;
  status: 'active' | 'completed' | 'cancelled';
  image: string;
}

export interface UserProfile {
  full_name: string;
  role: string;
  farm_name: string;
  profile_image: string;
}


const baseUrl = Platform.select({
    ios: 'http://127.0.0.1:8000/api',
    android: 'http://127.0.0.1:8000/api',
});

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      console.log('token', token);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}); 

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Dashboard APIs
export const dashboardApi = {
  // Lấy thông tin user profile
  getUserProfile: async (): Promise<UserProfile> => {
    // Use mock user for local UI demo
    return {
      full_name: mockUsers[0].name,
      role: 'farmer',
      farm_name: mockUsers[0].org_name,
      profile_image: '',
    };
  },

  // Lấy thống kê tổng quan
  getDashboardStats: async (): Promise<DashboardStats> => {
    return deriveDashboardStats();
  },

  // Lấy danh sách lô hàng gần đây
  getRecentBatches: async (): Promise<Batch[]> => {
    return deriveRecentBatches() as unknown as Batch[];
  },

  // Lấy số thông báo chưa đọc
  getUnreadNotificationCount: async (): Promise<number> => {
    try {
      const response = await api.get('/notifications/unread-count');
      console.log('Notifications count response:', response.data);
      return response.data.unread_count || 0;
    } catch (error: any) {
      console.error('Error getting notification count:', error.response?.data || error.message);
      return 0; // Return 0 if there's an error
    }
  }
};

export default api;