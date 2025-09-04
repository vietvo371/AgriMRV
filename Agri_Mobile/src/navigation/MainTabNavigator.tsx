import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import { MainTabParamList, RootStackParamList, TabScreen, StackScreen } from './types';
import { useAuth } from '../contexts/AuthContext';

// Auth Screens
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Farmer Screens
import CreditDashboardScreen from '../screens/CreditDashboardScreen';
import SeasonProfileScreen from '../screens/SeasonProfileScreen';
import FarmerProfileScreen from '../screens/FarmerProfileScreen';
import ImageUploadScreen from '../screens/ImageUploadScreen';
import BlockchainAnchorScreen from '../screens/BlockchainAnchorScreen';
import TrainingQuizScreen from '../screens/TrainingQuizScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FinanceScreen from '../screens/FinanceScreen';

// Bank/Coop Screens
import BankViewerScreen from '../screens/BankViewerScreen';
import CreditProfileScreen from '../screens/CreditProfileScreen';
import LoanApprovalScreen from '../screens/LoanApprovalScreen';

// Common Screens
import NotificationsScreen from '../screens/NotificationsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import QRScanScreen from '../screens/QRScanScreen';
import CreateRecordScreen from '../screens/CreateRecordScre';
import RecordDetailScreen from '../screens/RecordDetailScreen';
import RecordListScreen from '../screens/RecordListScreen';
import AiVerifyScreen from '../screens/AiVerifyScreen';
import AiAnalysisDetailScreen from '../screens/AiAnalysisDetailScreen';
import BanksScreen from '../screens/BanksScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ShareProfileScreen from '../screens/ShareProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const { userRole } = useAuth();

  const tabScreenOptions = {
    headerShown: false,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textLight,
    tabBarStyle: {
      backgroundColor: theme.colors.white,
      borderTopColor: theme.colors.border,
      height: 60,
      paddingBottom: 14,
      paddingTop: 8,
      marginBottom: 25,
      elevation: 8,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    tabBarLabelStyle: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: 12,
    },
  };

  // Farmer View
  if (userRole === 'farmer') {
    return (
      <Tab.Navigator screenOptions={tabScreenOptions}>
        <Tab.Screen
          name="Home"
          component={DashboardScreen}
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AiVerify"
          component={AiVerifyScreen}
          options={{
            title: 'AI Verify',
            tabBarIcon: ({ color, size }) => (
              <Icon name="shield-check" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Credit"
          component={CreditDashboardScreen}
          options={{
            title: 'Credit',
            tabBarIcon: ({ color, size }) => (
              <Icon name="credit-card-check" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Finance"
          component={FinanceScreen}
          options={{
            title: 'Finance',
            tabBarIcon: ({ color, size }) => (
              <Icon name="finance" size={size + 4} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Icon name="account" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  // Bank/Coop View
  if (userRole === 'bank' || userRole === 'cooperative') {
    return (
      <Tab.Navigator screenOptions={tabScreenOptions}>
        <Tab.Screen
          name="CreditViewer"
          component={BankViewerScreen}
          options={{
            title: 'Credit Viewer',
            tabBarIcon: ({ color, size }) => (
              <Icon name="credit-card-search" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Applications"
          component={LoanApprovalScreen}
          options={{
            title: 'Applications',
            tabBarIcon: ({ color, size }) => (
              <Icon name="file-document" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Analytics"
          component={CreditProfileScreen}
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, size }) => (
              <Icon name="chart-bar" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Icon name="cog" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  // Default/Other roles view
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        animationTypeForReplace: 'push',
        presentation: 'card',
        contentStyle: {
          backgroundColor: theme.colors.white,
        },
      }}>
      {/* Initial Loading Screen */}
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      {/* Auth Stack */}
      <Stack.Group>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      </Stack.Group>

      {/* Main Stack */}
      <Stack.Group>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        
        {/* Farmer Screens */}
        <Stack.Screen name="FarmerProfile" component={FarmerProfileScreen} />
        <Stack.Screen name="SeasonProfile" component={SeasonProfileScreen} />
        <Stack.Screen name="ImageUpload" component={ImageUploadScreen} />
        <Stack.Screen name="CreditDashboard" component={CreditDashboardScreen as any} />
        <Stack.Screen name="BlockchainAnchor" component={BlockchainAnchorScreen} />
        <Stack.Screen name="TrainingQuiz" component={TrainingQuizScreen} />
        <Stack.Screen name="AiVerify" component={AiVerifyScreen as any} />
        <Stack.Screen name="AiAnalysisDetail" component={AiAnalysisDetailScreen as any} />

        
        {/* Bank/Coop Screens */}
        <Stack.Screen name="BankViewer" component={BankViewerScreen} />
        <Stack.Screen name="CreditProfile" component={CreditProfileScreen as any} />
        <Stack.Screen name="LoanApproval" component={LoanApprovalScreen as any} />
        <Stack.Screen name="CreateRecord" component={CreateRecordScreen as any} />
        <Stack.Screen name="RecordDetail" component={RecordDetailScreen as any} />
        <Stack.Screen name="RecordList" component={RecordListScreen as any} />
        <Stack.Screen name="Finance" component={FinanceScreen as any} />
        <Stack.Screen name="Profile" component={ProfileScreen as any} />
        <Stack.Screen name="ShareProfile" component={ShareProfileScreen as any} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainNavigator;