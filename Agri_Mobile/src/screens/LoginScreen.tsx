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
import Animated, { FadeInDown, FadeInUp, SlideInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import InputCustom from '../component/InputCustom';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import api from '../utils/Api';

interface LoginScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string, password?: string }>({});
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);
  const [password, setPassword] = useState('');
  const validateForm = () => {
    const newErrors: { identifier?: string, password?: string } = {};

    if (!identifier) {
      newErrors.identifier = 'Email or phone number is required';
    } else if (isPhoneNumber) {
      if (!/^\+?[\d\s-]{10,}$/.test(identifier)) {
        newErrors.identifier = 'Please enter a valid phone number';
      }
    } else {
      if (!/\S+@\S+\.\S+/.test(identifier)) {
        newErrors.identifier = 'Please enter a valid email';
      }
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const detectInputType = (value: string) => {
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
      // const response = await api.post('/auth/request-otp', {
      //   identifier: identifier,
      //   type: isPhoneNumber ? 'phone' : 'email'
      // });
      // Navigate to OTP verification screen
      // navigation.navigate('OTPVerification', {
      //   identifier: identifier,
      //   type: isPhoneNumber ? 'phone' : 'email'
      // });
      await signIn({ identifier: identifier, password: password , type: isPhoneNumber ? 'phone' : 'email'});
      navigation.replace('MainTabs');

      // console.log('Login response:', response);
    } catch (error: any) {
      console.log('Login error:', error);
// Xử lý lỗi validation từ API
    if (error.errors) {
      setErrors({
        identifier: error.errors.identifier?.[0],
        password: error.errors.password?.[0]
      });
    } else {
      // Xử lý các lỗi khác (network, timeout...)
      setErrors({
        identifier: error.message
      });
    }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} login will be available soon`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={[theme.colors.primary + '15', theme.colors.white]}
          style={StyleSheet.absoluteFill}
        />

        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View
            style={styles.headerContainer}
            entering={FadeInDown.duration(600).springify()}
          >
            <Animated.Text
              style={styles.welcomeText}
              entering={FadeInDown.duration(800).delay(200).springify()}
            >
              Welcome Back
            </Animated.Text>

            <Animated.Text
              style={styles.title}
              entering={FadeInDown.duration(800).delay(400).springify()}
            >
              AgriMRV
            </Animated.Text>

            <Animated.Text
              style={styles.subtitle}
              entering={FadeInDown.duration(800).delay(600).springify()}
            >
              Sign in to continue your sustainable farming journey
            </Animated.Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            style={styles.formContainer}
            entering={SlideInDown.duration(800).delay(800).springify()}
          >
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Sign In</Text>
              <Text style={styles.formSubtitle}>
                Enter your credentials to access your account
              </Text>
            </View>

            <View style={styles.form}>
              {/* Input Type Indicator */}
              <View style={styles.inputTypeIndicator}>
                <View style={[
                  styles.inputTypeTab,
                  !isPhoneNumber && styles.inputTypeTabActive
                ]}>
                  <Icon
                    name="email-outline"
                    size={16}
                    color={!isPhoneNumber ? theme.colors.primary : theme.colors.textLight}
                  />
                  <Text style={[
                    styles.inputTypeText,
                    !isPhoneNumber && styles.inputTypeTextActive
                  ]}>
                    Email
                  </Text>
                </View>
                <View style={[
                  styles.inputTypeTab,
                  isPhoneNumber && styles.inputTypeTabActive
                ]}>
                  <Icon
                    name="phone-outline"
                    size={16}
                    color={isPhoneNumber ? theme.colors.primary : theme.colors.textLight}
                  />
                  <Text style={[
                    styles.inputTypeText,
                    isPhoneNumber && styles.inputTypeTextActive
                  ]}>
                    Phone
                  </Text>
                </View>
              </View>

              <InputCustom
                label={isPhoneNumber ? "Phone Number" : "Email Address"}
                placeholder={isPhoneNumber ? "Enter your phone number" : "Enter your email address"}
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
               <InputCustom
                label={"Password"}
                placeholder={"Enter your password"}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                }}
                keyboardType={"default"}
                autoCapitalize="none"
                error={errors.password}
                secureTextEntry={true}
                required
                leftIcon={"lock-outline"}
                containerStyle={styles.input}
              />

              <ButtonCustom
                title="Login"
                onPress={handleLogin}
                style={styles.loginButton}
                icon="login"
              />

              {/* Social Login */}
              {/* <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => handleSocialLogin('Google')}
                  activeOpacity={0.7}
                >
                  <Icon name="google" size={24} color="#DB4437" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={() => handleSocialLogin('Facebook')}
                  activeOpacity={0.7}
                >
                  <Icon name="facebook" size={24} color="#4267B2" />
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[styles.socialButton, styles.appleButton]}
                    onPress={() => handleSocialLogin('Apple')}
                    activeOpacity={0.7}
                  >
                    <Icon name="apple" size={24} color="#000000" />
                  </TouchableOpacity>
                )}
              </View> */}
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={styles.footerContainer}
            entering={FadeInUp.duration(600).delay(1200).springify()}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.registerLink}
            >
              <Text style={styles.registerText}>
                Don't have an account?{' '}
                <Text style={styles.registerLinkText}>Create Account</Text>
              </Text>
            </TouchableOpacity>



            {/* Security Badge */}
            <View style={styles.securityBadge}>
              <Icon name="shield-check" size={16} color={theme.colors.success} />
              <Text style={styles.securityText}>
                Your data is protected with enterprise-grade security
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={loading} message="Sending verification code..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.colors.primary + '10',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.secondary + '10',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
  },

  // Header Styles
  headerContainer: {
    alignItems: 'center',
    paddingTop: height * 0.08,
    paddingBottom: theme.spacing.xl,
  },
  logoContainer: {
    marginBottom: theme.spacing.lg,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 36,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.lg,
  },

  // Form Styles
  formContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 32,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  formTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  formSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },

  // Input Type Indicator
  inputTypeIndicator: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  inputTypeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: 12,
    gap: 6,
  },
  inputTypeTabActive: {
    backgroundColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputTypeText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
  },
  inputTypeTextActive: {
    color: theme.colors.primary,
  },

  input: {
    marginBottom: theme.spacing.lg,
  },
  loginButton: {
    marginBottom: theme.spacing.lg,
    height: 56,
  },

  // Divider Styles
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
    marginHorizontal: theme.spacing.lg,
  },

  // Social Login Styles
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  googleButton: {},
  facebookButton: {},
  appleButton: {},

  // Footer Styles
  footerContainer: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  registerLink: {
    paddingVertical: theme.spacing.sm,
  },
  registerText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    textAlign: 'center',
  },
  registerLinkText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.bold,
  },
  helpSection: {
    alignItems: 'center',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: theme.spacing.sm,
  },
  helpText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.success + '10',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.success + '20',
  },
  securityText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: 'center',
    flex: 1,
  },
});

export default LoginScreen;
