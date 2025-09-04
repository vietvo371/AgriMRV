/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainNavigator from './src/navigation/MainTabNavigator';
import { theme } from './src/theme/colors';
import { AuthProvider } from './src/contexts/AuthContext';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const navigationTheme: Theme = {
    dark: isDarkMode,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.white,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.error,
    },
    fonts: {
      regular: {
        fontFamily: theme.typography.fontFamily.regular,
        fontWeight: '400',
      },
      medium: {
        fontFamily: theme.typography.fontFamily.medium,
        fontWeight: '500',
      },
      bold: {
        fontFamily: theme.typography.fontFamily.bold,
        fontWeight: '700',
      },
      heavy: {
        fontFamily: theme.typography.fontFamily.bold,
        fontWeight: '900',
      },
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={theme.colors.background}
          />
          <NavigationContainer theme={navigationTheme}>
            <MainNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;
