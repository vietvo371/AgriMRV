import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/colors';

interface LoadingScreenProps {
  navigation: any;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ navigation }) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    setTimeout(() => {
    if (!loading) {
      // Only navigate when loading is complete
      if (isAuthenticated) {
        navigation.replace('MainTabs');
      } else {
          navigation.replace('Login');
        }
      }
    }, 1500);
  }, [isAuthenticated, loading, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.jpg')}
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