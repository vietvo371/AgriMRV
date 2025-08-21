import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import api from '../utils/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../component/Header';

interface OTPVerificationScreenProps {
  navigation: any;
  route: {
    params: {
      identifier: string;
      type: 'phone' | 'email';
    };
  };
}

const OTP_LENGTH = 6;

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ navigation, route }) => {
  const { signIn } = useAuth();
  const { identifier, type } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let interval: number;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer, canResend]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };  

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) {
      Alert.alert('Error', 'Please enter the complete OTP');
      return;
    }

    setLoading(true);
    try {
      navigation.navigate('MainTabs', { screen: 'Home' });
      // const response = await api.post('/auth/verify-otp', {
      //   identifier,
      //   type,
      //   otp: otpString,
      // });

      // const { user, token } = response.data;

      // // Navigate based on user role
      // switch (user.role) {
      //   case 'farmer':
      //     navigation.replace('MainTabs', { screen: 'FarmerProfile' });
      //     break;
      //   case 'bank':
      //     navigation.replace('MainTabs', { screen: 'BankDashboard' });
      //     break;
      //   default:
      //     navigation.replace('MainTabs');
      // }
    } catch (error: any) {
      console.log('OTP verification error:', error);
      Alert.alert(
        'Verification Failed',
        error.message || 'Invalid OTP. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      await api.post('/auth/request-otp', {
        identifier,
        type,
      });
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      Alert.alert('Success', 'OTP has been resent successfully');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to resend OTP. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
       colors={[theme.colors.primary + '10', theme.colors.white]}
        style={styles.gradient}
        >
           <Header
          title=""
          onBack={() => navigation.goBack()}
          containerStyle={styles.header}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.headerContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="shield-check" size={40} color={theme.colors.primary} />
                </View>
                <Text style={styles.title}>Verification Code</Text>
                <Text style={styles.subtitle}>
                  We've sent a verification code to{'\n'}
                  <Text style={styles.identifier}>
                    {type === 'phone' ? 
                      identifier.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3') : 
                      identifier}
                  </Text>
                </Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <View key={index} style={styles.otpInputWrapper}>
                      <TextInput
                        ref={el => { inputRefs.current[index] = el }}
                        style={[
                          styles.otpInput,
                          digit ? styles.otpInputFilled : {},
                          index === otp.findIndex(d => !d) ? styles.otpInputActive : {}
                        ]}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                      />
                    </View>
                  ))}
                </View>

                <ButtonCustom
                  title="Verify Code"
                  onPress={handleVerifyOTP}
                  style={styles.verifyButton}
                />

                <View style={styles.resendContainer}>
                  {!canResend ? (
                    <View style={styles.timerContainer}>
                      <Icon name="clock-outline" size={20} color={theme.colors.textLight} />
                      <Text style={styles.timerText}>
                        Resend code in <Text style={styles.timer}>{timer}s</Text>
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      onPress={handleResendOTP}
                      style={styles.resendButton}>
                      <Icon name="refresh" size={20} color={theme.colors.primary} />
                      <Text style={styles.resendButtonText}>Resend Code</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
      <LoadingOverlay visible={loading} message="Verifying..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    backgroundColor: 'transparent',
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
  headerContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl * 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  identifier: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  },
  formContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    marginBottom: theme.spacing.xl * 2,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  otpInputWrapper: {
    alignItems: 'center',
    
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
  },
  otpInputFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '05',
  },
  otpInputActive: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  verifyButton: {
    marginBottom: theme.spacing.xl,
  },
  resendContainer: {
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.border + '20',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  timerText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.sm,
  },
  timer: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  resendButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
});

export default OTPVerificationScreen;
