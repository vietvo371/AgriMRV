import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  CreateBatch: undefined;
  QRGenerate: { batchId: string };
  BatchList: undefined;
  BatchDetail: { batchId: string };
  AdminDashboard: undefined;
  Notifications: undefined;
  Onboarding: undefined;
  OTPVerification: { identifier: string; type: 'phone' | 'email' };
};  

export type MainTabParamList = {
  Home: undefined;
  Scan: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 