import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import Header from '../component/Header';
import InputCustom from '../component/InputCustom';
import ButtonCustom from '../component/ButtonCustom';
import SelectCustom from '../component/SelectCustom';
import DatePicker from '../component/DatePicker';
import LocationPicker from '../component/LocationPicker';
import LoadingOverlay from '../component/LoadingOverlay';

interface RegisterScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const roleOptions = [
  {
    label: 'Farmer',
    value: 'farmer',
    icon: 'account',
    description: 'Individual farmer',
    color: theme.colors.success,
  },
  {
    label: 'Bank',
    value: 'bank',
    icon: 'bank',
    description: 'Financial institution ',
    color: theme.colors.primary,
  },
];

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { signUp } = useAuth();

  interface Location {
    latitude: number;
    longitude: number;
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
    dob: new Date(),
    role: 'farmer',
    gps_location: '',
    gps_latitude: '',
    gps_longitude: '',
    address: '',
    org_name: '',
    employee_id: '',
  });

  const [selectedLocation, setSelectedLocation] = useState<Location>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Set default location to India (New Delhi)
  useEffect(() => {
    if (!selectedLocation) {
      const defaultIndia = { latitude: 28.6139, longitude: 77.2090 };
      setSelectedLocation(defaultIndia);
      updateFormData('gps_location', `${defaultIndia.latitude},${defaultIndia.longitude}`);
      updateFormData('gps_latitude', String(defaultIndia.latitude));
      updateFormData('gps_longitude', String(defaultIndia.longitude));
      // Prefill minimal address; LocationPicker will refine once interacted
      if (!formData.address) {
        updateFormData('address', 'New Delhi, India');
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Password confirmation
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const age = new Date().getFullYear() - formData.dob.getFullYear();
      if (age < 18) {
        newErrors.dob = 'You must be at least 18 years old';
      } else if (age > 100) {
        newErrors.dob = 'Please enter a valid date of birth';
      }
    }

    // GPS location validation
    if (!formData.gps_latitude || !formData.gps_longitude) {
      newErrors.gps_location = 'GPS location is required';
    }
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    // Role-specific validations
    if (formData.role === 'bank') {
      if (!formData.org_name) {
        newErrors.org_name = 'Organization name is required';
      } else if (formData.org_name.length < 3) {
        newErrors.org_name = 'Organization name must be at least 3 characters';
      }

      if (!formData.employee_id) {
        newErrors.employee_id = 'Employee ID is required';
      } else if (!/^[A-Z0-9-]{4,}$/.test(formData.employee_id)) {
        newErrors.employee_id = 'Employee ID must be at least 4 characters and contain only uppercase letters, numbers, and hyphens';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      const registrationData = {
        email: formData.email,
        phone: formData.phone,
        full_name: formData.name,
        date_of_birth: formData.dob.toISOString().split('T')[0],
        user_type: formData.role,
        gps_latitude: formData.gps_latitude,
        gps_longitude: formData.gps_longitude,
        organization_name: formData.org_name || undefined,
        organization_type: formData.role === 'bank' ? 'bank' : (formData.role === 'cooperative' ? 'cooperative' : undefined),
        address: formData.address,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };
      await signUp(registrationData);
      navigation.replace('Login');
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.errors) {
        const newErrors: Record<string, string> = {};
        Object.keys(error.errors).forEach(field => {
          newErrors[field] = error.errors[field][0];
        });
        setErrors(newErrors);
      } else {
        setErrors({
          email: error.message
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderRoleSelector = () => (
    <Animated.View
      style={styles.roleSelectorContainer}
      entering={FadeInDown.duration(500).springify()}
    >
      <Text style={styles.roleTitle}>Choose Your Role</Text>
      <Text style={styles.roleSubtitle}>Select the option that best describes you</Text>

      <View style={styles.roleGrid}>
        {roleOptions.map((option, index) => (
          <Animated.View
            key={option.value}
            entering={FadeInDown.duration(400).delay(index * 100).springify()}
            style={{ flex: 1 }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => updateFormData('role', option.value)}
              style={[
                styles.roleCard,
                formData.role === option.value && [styles.roleCardActive, { borderColor: option.color + '60' }],
              ]}
            >
              <View style={[styles.roleIconCircle, { backgroundColor: option.color + '15' }]}>
                <Icon name={option.icon} size={28} color={option.color} />
              </View>
              <Text style={styles.roleLabel}>
                {option.label}
              </Text>
              <Text style={styles.roleDesc}>
                {option.description}
              </Text>
              {formData.role === option.value && (
                <View style={styles.roleCheck}>
                  <Icon name="check" size={16} color={option.color} />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderBasicInfo = () => (
    <Animated.View
      style={styles.stepContainer}
      entering={FadeInDown.duration(500).springify()}
    >
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <View style={styles.inputGroup}>
        <InputCustom
          label="Phone Number"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChangeText={value => updateFormData('phone', value)}
          keyboardType="phone-pad"
          error={errors.phone}
          required
          leftIcon="phone-outline"
          containerStyle={styles.input}
        />

        <InputCustom
          label="Email Address"
          placeholder="Enter your email address"
          value={formData.email}
          onChangeText={value => updateFormData('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          required
          leftIcon="email-outline"
          containerStyle={styles.input}
        />

        {formData.role === 'farmer' ? (
          <>
            <InputCustom
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={value => updateFormData('name', value)}
              error={errors.name}
              required
              leftIcon="account-outline"
              containerStyle={styles.input}
            />

            <DatePicker
              label="Date of Birth"
              value={formData.dob}
              onChange={value => updateFormData('dob', value)}
              error={errors.dob}
              required
              maximumDate={new Date()}
            />
          </>
        ) : (
          <>
            <InputCustom
              label="Organization Name"
              placeholder="Enter your organization name"
              value={formData.org_name}
              onChangeText={value => updateFormData('org_name', value)}
              error={errors.org_name}
              required
              leftIcon="office-building-outline"
              containerStyle={styles.input}
            />

            <InputCustom
              label="Employee ID"
              placeholder="Enter your employee ID"
              value={formData.employee_id}
              onChangeText={value => updateFormData('employee_id', value)}
              error={errors.employee_id}
              required
              leftIcon="badge-account-outline"
              containerStyle={styles.input}
            />
          </>
        )}
      </View>
    </Animated.View>
  );

  const renderSecurityInfo = () => (
    <Animated.View
      style={styles.stepContainer}
      entering={FadeInDown.duration(500).springify()}
    >
      <Text style={styles.stepTitle}>Security & Location</Text>
      <Text style={styles.stepSubtitle}>Set up your password and location</Text>

      <View style={styles.inputGroup}>
        <LocationPicker
          label="Address"
          value={selectedLocation}
          onChange={location => {
            setSelectedLocation(location);
            updateFormData('gps_location', `${location.latitude},${location.longitude}`);
            updateFormData('gps_latitude', String(location.latitude));
            updateFormData('gps_longitude', String(location.longitude));
          }}
          onAddressChange={(addr) => updateFormData('address', addr || '')}
          error={errors.gps_location || errors.address}
          required
        />

        <InputCustom
          label="Password"
          placeholder="Create a strong password"
          value={formData.password}
          onChangeText={value => updateFormData('password', value)}
          secureTextEntry={!showPassword}
          error={errors.password}
          required
          leftIcon="lock-outline"
          rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
          onRightIconPress={() => setShowPassword(!showPassword)}
          containerStyle={styles.input}
        />

        <InputCustom
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.password_confirmation}
          onChangeText={value => updateFormData('password_confirmation', value)}
          secureTextEntry={!showConfirmPassword}
          error={errors.password_confirmation}
          required
          leftIcon="lock-check-outline"
          rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
          onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          containerStyle={styles.input}
        />

        {/* Password Strength Indicator */}
        <View style={styles.passwordStrength}>
          <Text style={styles.passwordStrengthLabel}>Password Requirements:</Text>
          <View style={styles.requirementsList}>
            <View style={styles.requirement}>
              <Icon
                name={formData.password.length >= 8 ? 'check-circle' : 'circle-outline'}
                size={16}
                color={formData.password.length >= 8 ? theme.colors.success : theme.colors.textLight}
              />
              <Text style={[
                styles.requirementText,
                formData.password.length >= 8 && { color: theme.colors.success }
              ]}>
                At least 8 characters
              </Text>
            </View>
            <View style={styles.requirement}>
              <Icon
                name={/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'check-circle' : 'circle-outline'}
                size={16}
                color={/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? theme.colors.success : theme.colors.textLight}
              />
              <Text style={[
                styles.requirementText,
                /(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) && { color: theme.colors.success }
              ]}>
                Upper & lowercase letters
              </Text>
            </View>
            <View style={styles.requirement}>
              <Icon
                name={/(?=.*\d)/.test(formData.password) ? 'check-circle' : 'circle-outline'}
                size={16}
                color={/(?=.*\d)/.test(formData.password) ? theme.colors.success : theme.colors.textLight}
              />
              <Text style={[
                styles.requirementText,
                /(?=.*\d)/.test(formData.password) && { color: theme.colors.success }
              ]}>
                At least one number
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderRoleSelector();
      case 2:
        return renderBasicInfo();
      case 3:
        return renderSecurityInfo();
      default:
        return renderRoleSelector();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={[theme.colors.primary + '10', theme.colors.white]}
          style={styles.gradient}
        >
          <Header
            title=""
            onBack={() => navigation.goBack()}
            containerStyle={styles.header}
          />

          {/* Progress Indicator */}
          <Animated.View
            style={styles.progressContainer}
            entering={FadeInUp.duration(500).springify()}
          >
            <View style={styles.progressHeader}>
              <Text style={styles.progressSubtitle}> Creat Account Step {currentStep} of 3</Text>
            </View>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={[
                  styles.progressFill,
                  { width: `${(currentStep / 3) * 100}%` }
                ]}
              />
            </View>
            <View style={styles.stepIndicators}>
              {[1, 2, 3].map((step) => (
                <View
                  key={step}
                  style={[
                    styles.stepIndicator,
                    {
                      backgroundColor: step <= currentStep
                        ? theme.colors.primary
                        : theme.colors.border
                    }
                  ]}
                >
                  <Text style={[
                    styles.stepIndicatorText,
                    { color: step <= currentStep ? theme.colors.white : theme.colors.textLight }
                  ]}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.content}>
                <View style={styles.formContainer}>
                  {renderStepContent()}
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <Animated.View
              style={styles.actionContainer}
              entering={FadeInUp.duration(500).delay(300).springify()}
            >
              <View style={styles.buttonRow}>
                {currentStep > 1 && (
                  <ButtonCustom
                    title="Previous"
                    onPress={prevStep}
                    style={styles.actionButton}
                  />
                )}

                {currentStep < 3 ? (
                  <ButtonCustom
                    title="Next"
                    onPress={nextStep}
                    style={styles.actionButton}
                    icon="arrow-right"
                  />
                ) : (
                  <ButtonCustom
                    title="Create Account"
                    onPress={handleRegister}
                    style={styles.actionButton}
                    icon="account-plus"
                  />
                )}
              </View>

              {/* Sign In Link */}
              <TouchableOpacity
                style={styles.signInLink}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.signInText}>
                  Already have an account? <Text style={styles.signInTextBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </View>
      <LoadingOverlay visible={loading} message="Creating your account..." />
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
  gradient: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
    marginTop: theme.spacing.xxl,
  },

  // Progress Styles
  progressContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  progressTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicatorText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.sm,
  },

  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    padding: theme.spacing.lg,
  },
  formContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: theme.spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  // Role Selector Styles
  roleSelectorContainer: {
    alignItems: 'center',
  },
  roleTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  roleSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  roleOptions: {
    gap: theme.spacing.lg,
    width: '100%',
  },
  roleGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
  },
  roleOption: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleOptionActive: {
    borderColor: theme.colors.primary + '30',
  },
  roleOptionGradient: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    position: 'relative',
  },
  roleCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: 8,
  },
  roleCardActive: {
    backgroundColor: theme.colors.primary + '08',
    borderWidth: 2,
  },
  roleIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  roleLabel: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  roleDesc: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
  },
  roleCheck: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  roleIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  roleOptionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  roleOptionDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
  },

  // Step Styles
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  stepSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  inputGroup: {
    width: '100%',
    gap: theme.spacing.md,
  },
  input: {
    marginBottom: theme.spacing.md,
  },

  // Password Strength Styles
  passwordStrength: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  passwordStrengthLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  requirementsList: {
    gap: theme.spacing.sm,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  requirementText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },

  // Action Styles
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 20 : theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  signInLink: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  signInText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
  },
  signInTextBold: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
  },
});

export default RegisterScreen;
