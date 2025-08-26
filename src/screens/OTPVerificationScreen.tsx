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
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp, SlideInDown } from 'react-native-reanimated';
import { theme } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import api from '../utils/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface OTPVerificationScreenProps {
  navigation: any;
  route: {
    params: {
      identifier: string;
      type: 'phone' | 'email';
    };
  };
}

const { width, height } = Dimensions.get('window');
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
    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
  }, []);

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

    // Auto-verify when complete
    if (value && index === OTP_LENGTH - 1 && newOtp.every(digit => digit)) {
      setTimeout(() => {
        handleVerifyOTP();
      }, 300);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
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
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ mã OTP');
      return;
    }

    setLoading(true);
    try {
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch (error: any) {
      console.log('OTP verification error:', error);
      Alert.alert(
        'Xác thực thất bại',
        error.message || 'Mã OTP không hợp lệ. Vui lòng thử lại.',
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
      inputRefs.current[0]?.focus();
      Alert.alert('Thành công', 'Mã OTP đã được gửi lại');
    } catch (error: any) {
      Alert.alert(
        'Lỗi',
        error.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const formatIdentifier = (id: string) => {
    if (type === 'phone') {
      return id.replace(/(\d{3})(\d{3})(\d{4})/, '***-***-$3');
    }
    const [username, domain] = id.split('@');
    return `${username.charAt(0)}***@${domain}`;
  };

  const getActiveInputIndex = () => {
    return otp.findIndex(digit => !digit);
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
            <Animated.View 
              style={styles.iconContainer}
              entering={FadeInDown.duration(800).delay(200).springify()}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primary + '80']}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <Icon name="shield-check" size={32} color={theme.colors.white} />
              </LinearGradient>
            </Animated.View>
            
            <Animated.Text 
              style={styles.title}
              entering={FadeInDown.duration(800).delay(400).springify()}
            >
              Xác thực mã OTP
            </Animated.Text>
            
            <Animated.Text 
              style={styles.subtitle}
              entering={FadeInDown.duration(800).delay(600).springify()}
            >
              Chúng tôi đã gửi mã xác thực đến
            </Animated.Text>
            
            <Animated.Text 
              style={styles.identifier}
              entering={FadeInDown.duration(800).delay(800).springify()}
            >
              {formatIdentifier(identifier)}
            </Animated.Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View 
            style={styles.formContainer}
            entering={SlideInDown.duration(800).delay(1000).springify()}
          >
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Nhập mã OTP</Text>
              <Text style={styles.formSubtitle}>
                Vui lòng nhập mã 6 số đã được gửi đến {type === 'phone' ? 'số điện thoại' : 'email'} của bạn
              </Text>
            </View>

            <View style={styles.form}>
              {/* OTP Input Section */}
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => {
                  const isActive = index === getActiveInputIndex();
                  const isFilled = Boolean(digit);
                  
                  return (
                    <View 
                      key={index} 
                      style={[
                        styles.otpInputWrapper,
                        isActive && styles.otpInputWrapperActive
                      ]}>
                      <TextInput
                        ref={el => { inputRefs.current[index] = el }}
                        style={[
                          styles.otpInput,
                          isFilled && styles.otpInputFilled,
                          isActive && styles.otpInputActive
                        ]}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                        autoFocus={index === 0}
                      />
                      {isFilled && (
                        <View style={styles.filledIndicator}>
                          <Icon name="check" size={16} color={theme.colors.white} />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${(otp.filter(d => d).length / OTP_LENGTH) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {otp.filter(d => d).length}/{OTP_LENGTH}
                </Text>
              </View>

              <ButtonCustom
                title="Xác thực"
                onPress={handleVerifyOTP}
                style={otp.join('').length === OTP_LENGTH ? styles.verifyButtonActive : styles.verifyButton}
                disabled={otp.join('').length !== OTP_LENGTH}
                icon="shield-check"
              />

              {/* Resend Section */}
              <View style={styles.resendContainer}>
                {!canResend ? (
                  <View style={styles.timerContainer}>
                    <Icon name="clock-outline" size={18} color={theme.colors.primary} />
                    <Text style={styles.timerText}>
                      Gửi lại mã sau <Text style={styles.timer}>{timer}s</Text>
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    onPress={handleResendOTP}
                    style={styles.resendButton}
                    activeOpacity={0.7}>
                    <Icon name="refresh" size={20} color={theme.colors.primary} />
                    <Text style={styles.resendButtonText}>Gửi lại mã</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View 
            style={styles.footerContainer}
            entering={FadeInUp.duration(600).delay(1400).springify()}
          >

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={loading} message="Đang xác thực..." />
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
  iconContainer: {
    marginBottom: theme.spacing.lg,
  },
  iconGradient: {
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
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 36,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  identifier: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary,
    textAlign: 'center',
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

  // OTP Input Styles
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  otpInputWrapper: {
    position: 'relative',
  },
  otpInputWrapperActive: {
    transform: [{ scale: 1.05 }],
  },
  otpInput: {
    width: (width - 120) / 6,
    height: 56,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
  },
  otpInputFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '08',
    color: theme.colors.primary,
  },
  otpInputActive: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
    backgroundColor: theme.colors.primary + '05',
  },
  filledIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // Progress Bar Styles
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },

  // Button Styles
  verifyButton: {
    marginBottom: theme.spacing.lg,
    height: 56,
    opacity: 0.5,
  },
  verifyButtonActive: {
    marginBottom: theme.spacing.lg,
    height: 56,
    opacity: 1,
  },

  // Resend Section Styles
  resendContainer: {
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '08',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 20,
    gap: theme.spacing.sm,
  },
  timerText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  timer: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 20,
    gap: theme.spacing.sm,
  },
  resendButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
  },

  // Footer Styles
  footerContainer: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  helpContainer: {
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

export default OTPVerificationScreen;
