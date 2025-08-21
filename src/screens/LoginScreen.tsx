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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import InputCustom from '../component/InputCustom';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LoginScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await signIn({ email, password });
      navigation.replace('MainTabs');
    } catch (error: any) {
      console.log('Login error:', error);
      
      // Xử lý lỗi validation từ API
      if (error.errors) {
        setErrors({
          email: error.errors.email?.[0],
          password: error.errors.password?.[0]
        });
      } else {
        // Xử lý các lỗi khác (network, timeout...)
        setErrors({
          email: error.message
        });
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
                  source={require('../assets/images/logo.jpg')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Welcome Back!</Text>
                  <Text style={styles.subtitle}>
                    Sign in to continue tracking your agricultural products
                  </Text>
                </View>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.form}>
                  <InputCustom
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email}
                    required
                    leftIcon="email-outline"
                    containerStyle={styles.input}
                  />

                  <InputCustom
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    error={errors.password}
                    required
                    leftIcon="lock-outline"
                    rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    containerStyle={styles.input}
                  />

                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <ButtonCustom
                    title="Sign In"
                    onPress={handleLogin}
                    style={styles.loginButton}
                  />
                </View>

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>

                <View style={styles.socialButtons}>
                  <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                    <Icon name="google" size={24} color="#DB4437" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                    <Icon name="facebook" size={24} color="#4267B2" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
                    <Icon name="apple" size={24} color="#000000" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                  style={styles.registerLink}>
                  <Text style={styles.registerText}>
                    Don't have an account?{' '}
                    <Text style={styles.registerLinkText}>Sign Up</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
      <LoadingOverlay visible={loading} message="Signing in..." />
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
    padding: theme.spacing.xl,
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