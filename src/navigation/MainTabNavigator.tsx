import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import { MainTabParamList, RootStackParamList } from './types';

// Auth Screens
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Main Screens
import DashboardScreen from '../screens/DashboardScreen';
import CreateBatchScreen from '../screens/CreateBatchScreen';
import QRGenerateScreen from '../screens/QRGenerateScreen';
import BatchListScreen from '../screens/BatchListScreen';
import BatchDetailScreen from '../screens/BatchDetailScreen';
import QRScanScreen from '../screens/QRScanScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          marginBottom: 10,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: 12,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={QRScanScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="qrcode-scan" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
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
      }}>
      {/* Initial Loading Screen */}
      <Stack.Screen name="Loading" component={LoadingScreen} />

      {/* Auth Stack */}
      <Stack.Group>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Group>

      {/* Main Stack */}
      <Stack.Group>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="CreateBatch" component={CreateBatchScreen} />
        <Stack.Screen name="QRGenerate" component={QRGenerateScreen} />
        <Stack.Screen name="BatchList" component={BatchListScreen} />
        <Stack.Screen name="BatchDetail" component={BatchDetailScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainNavigator; 