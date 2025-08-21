import axios from "axios";
import { Platform } from 'react-native';
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
    ios: 'https://agritrace.dzfullstack.com/api',
    android: 'https://agritrace.dzfullstack.com/api',
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
    try {
      const response = await api.get('/auth/profile');
      console.log('Profile response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Error getting user profile:', error.response?.data || error.message);
      throw error;
    }
  },

  // Lấy thống kê tổng quan
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/dashboard/stats');
      console.log('Stats response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error getting dashboard stats:', error.response?.data || error.message);
      throw error;
    }
  },

  // Lấy danh sách lô hàng gần đây
  getRecentBatches: async (): Promise<Batch[]> => {
    try {
      const response = await api.get('/dashboard/batches');
      console.log('Batches response:', response.data);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error getting recent batches:', error.response?.data || error.message);
      throw error;
    }
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