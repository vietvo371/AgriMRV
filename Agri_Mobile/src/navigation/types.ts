import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  // Auth Flow
  Loading: undefined;
  Login: undefined;
  Register: { role: 'farmer' | 'bank' | 'coop' };
  OTPVerification: { identifier: string; type: 'phone' | 'email' };
  Onboarding: undefined;

  // Main Navigation
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  
  // Farmer Flow
  FarmerProfile: { userId: string };
  SeasonProfile: { seasonId?: string };
  ImageUpload: { seasonId: string };
  CreditDashboard: { seasonId: string };
  RecordDetail: { recordId: string };
  RecordList: undefined;
  QRGenerate: { batchId?: string; batch?: any };
  AiAnalysisDetail: { analysisId: string };
  BlockchainAnchor: { profileId: string; score: number };
  TrainingQuiz: undefined;
  Banks: undefined;
  ShareProfile: undefined;
  
  // Bank/Coop Flow
  BankViewer: { txHash?: string; farmerId?: string };
  CreditProfile: { profileId: string };
  LoanApproval: { profileId: string; score: number };
  
  // Common
  Notifications: undefined;
  AiVerify: undefined;
  CreateRecord: undefined;
  Finance: undefined;
  Profile: undefined;
};  

export type MainTabParamList = {
  // Farmer Tabs
  Home: undefined;
  Seasons: undefined;
  Credit: undefined;
  Profile: undefined;
  AiVerify: undefined;
  // Bank/Coop Tabs
  CreditViewer: undefined;
  Applications: undefined;
  Analytics: undefined;
  Settings: undefined;
};

export type TabScreenProps<T extends keyof MainTabParamList> = {
  navigation: BottomTabNavigationProp<MainTabParamList, T>;
  route: RouteProp<MainTabParamList, T>;
};

export type TabScreen<T extends keyof MainTabParamList> = React.FC<TabScreenProps<T>>;

export type StackScreen<T extends keyof RootStackParamList> = React.FC<NativeStackScreenProps<RootStackParamList, T>>;

export type TabScreenComponent<T extends keyof MainTabParamList> = React.FC<TabScreenProps<T>>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 