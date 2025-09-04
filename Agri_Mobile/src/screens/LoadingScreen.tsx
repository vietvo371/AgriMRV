import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/colors';

interface LoadingScreenProps {
  navigation: any;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ navigation }) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        
        setTimeout(async () => {
          if (!loading) {
            if (isAuthenticated) {
              navigation.replace('MainTabs');
            } else {
              // Nếu chưa từng mở app (isFirstLaunch là null hoặc không tồn tại)
              if (isFirstLaunch === null) {
                navigation.replace('Onboarding');
              } else {
                navigation.replace('Login');
              }
            }
          }
        }, 1500);
      } catch (error) {
        console.error('Error checking first launch:', error);
        navigation.replace('Login');
      }
    };

    checkFirstLaunch();
  }, [isAuthenticated, loading, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        style={styles.spinner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: theme.spacing.xl,
  },
  spinner: {
    marginTop: theme.spacing.lg,
  },
});

export default LoadingScreen; 