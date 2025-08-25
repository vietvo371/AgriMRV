import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import InputCustom from '../component/InputCustom';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import api from '../utils/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LoginScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string }>({});
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);

  const validateForm = () => {
    const newErrors: { identifier?: string } = {};

    if (!identifier) {
      newErrors.identifier = 'Email or phone number is required';
    } else if (isPhoneNumber) {
      // Validate phone number format (adjust regex as needed)
      if (!/^\+?[\d\s-]{10,}$/.test(identifier)) {
        newErrors.identifier = 'Please enter a valid phone number';
      }
    } else {
      // Validate email format
      if (!/\S+@\S+\.\S+/.test(identifier)) {
        newErrors.identifier = 'Please enter a valid email';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const detectInputType = (value: string) => {
    // Check if input looks like a phone number
    const isPhone = /^[\d\s+-]+$/.test(value);
    setIsPhoneNumber(isPhone);
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Request OTP
      type: isPhoneNumber ? 'phone' : 'email'

      // const response = await api.post('/auth/request-otp', {
      //   identifier: identifier,
      //   type: isPhoneNumber ? 'phone' : 'email'
      // });

      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', {
        identifier: identifier,
        type: isPhoneNumber ? 'phone' : 'email'
      });
    } catch (error: any) {
      console.log('Login error:', error);
      
      // Handle validation errors
      if (error.errors) {
        setErrors({
          identifier: error.errors.identifier?.[0]
        });
      } else {
        // Handle other errors (network, timeout...)
        const errorMessage = error.message || 'An error occurred during login';
        setErrors({
          identifier: errorMessage
        });
        
        // Show error message to user
        Alert.alert(
          'Login Failed',
          errorMessage,
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary + '20', theme.colors.white]}
        style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.content}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../assets/images/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Welcome to AgriMRV</Text>
                  <Text style={styles.subtitle}>
                    Enter your phone number or email to continue
                  </Text>
                </View>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.form}>
                  <InputCustom
                    label="Phone Number or Email"
                    placeholder="Enter your phone number or email"
                    value={identifier}
                    onChangeText={(value) => {
                      setIdentifier(value);
                      detectInputType(value);
                    }}
                    keyboardType={isPhoneNumber ? "phone-pad" : "email-address"}
                    autoCapitalize="none"
                    error={errors.identifier}
                    required
                    leftIcon={isPhoneNumber ? "phone-outline" : "email-outline"}
                    containerStyle={styles.input}
                  />

                  <ButtonCustom
                    title="Send OTP"
                    onPress={handleLogin}
                    style={styles.loginButton}
                  />

                  <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    style={styles.registerLink}>
                    <Text style={styles.registerText}>
                      Don't have an account?{' '}
                      <Text style={styles.registerLinkText}>Create Account</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
      <LoadingOverlay visible={loading} message="Sending OTP..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  formContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    marginBottom: 140,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  loginButton: {
    marginBottom: theme.spacing.lg,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginHorizontal: theme.spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  facebookButton: {
    backgroundColor: '#FFFFFF',
  },
  appleButton: {
    backgroundColor: '#FFFFFF',
  },
  registerLink: {
    alignItems: 'center',
  },
  registerText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  registerLinkText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.bold,
  },
});

export default LoginScreen; 