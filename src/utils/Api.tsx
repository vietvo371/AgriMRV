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
  // Tổng hợp dashboard (thay mock trên client)
  getSummary: async () => {
    const res = await api.get('/dashboard/summary');
    return res.data.data;
  },

  // MRV overview (tuỳ UI sử dụng)
  getMrvOverview: async () => {
    const res = await api.get('/dashboard/mrv-overview');
    return res.data.data;
  },

  // Danh sách plots
  getLandPlots: async () => {
    const res = await api.get('/dashboard/land-plots');
    return res.data.data;
  },

  // Chi tiết plot
  getLandPlotDetail: async (plotId: string | number) => {
    const res = await api.get(`/dashboard/land-plots/${plotId}`);
    return res.data.data;
  },

  // Thống kê tổng quan
  getStatistics: async () => {
    const res = await api.get('/dashboard/statistics');
    return res.data.data;
  },

  // Tạo plot
  createPlot: async (payload: any) => {
    const res = await api.post('/dashboard/land-plots', payload);
    return res.data.data;
  },

  // Cập nhật plot
  updatePlot: async (plotId: string | number, payload: any) => {
    const res = await api.put(`/dashboard/land-plots/${plotId}`, payload);
    return res.data.data;
  },

  // Xoá plot
  deletePlot: async (plotId: string | number) => {
    const res = await api.delete(`/dashboard/land-plots/${plotId}`);
    return res.data.data;
  },

  // Lấy số thông báo chưa đọc (giữ lại nếu backend có)
  getUnreadNotificationCount: async (): Promise<number> => {
    try {
      const response = await api.get('/notifications/unread-count');
      console.log('Notifications count response:', response.data);
      return response.data.unread_count || 0;
    } catch (error: any) {
      console.error('Error getting notification count:', error.response?.data || error.message);
      return 0;
    }
  }
};

export default api;