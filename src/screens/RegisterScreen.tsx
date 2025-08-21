import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
  { label: 'Farmer', value: 'farmer' },
  { label: 'Bank/Cooperative', value: 'bank' },
];

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { signUp } = useAuth();
  interface Location {
    latitude: number;
    longitude: number;
  }

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
    dob: new Date(),
    role: 'farmer',
    gps_location: '',
    org_name: '',
    employee_id: '',
  });

  const [selectedLocation, setSelectedLocation] = useState<Location>();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (!formData.gps_location) {
      newErrors.gps_location = 'GPS location is required';
    } else if (!/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(formData.gps_location)) {
      newErrors.gps_location = 'Invalid GPS location format';
    }

    // Role-specific validations
    if (formData.role === 'cooperative') {
      if (!formData.org_name) {
        newErrors.org_name = 'Organization name is required';
      } else if (formData.org_name.length < 3) {
        newErrors.org_name = 'Organization name must be at least 3 characters';
      }
    }

    if (formData.role === 'bank' || formData.role === 'trader') {
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
    console.log('Proceeding with registration...');
    setLoading(true);
    try {
      const registrationData = {
        ...formData,
        dob: formData.dob.toISOString().split('T')[0], // Format as YYYY-MM-DD
      };
      await signUp(registrationData);
      navigation.replace('Login');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Xử lý lỗi validation từ API
      if (error.errors) {
        // Cập nhật tất cả các lỗi từ API
        const newErrors: Record<string, string> = {};
        Object.keys(error.errors).forEach(field => {
          newErrors[field] = error.errors[field][0];
        });
        setErrors(newErrors);
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

  const updateFormData = (key: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary + '20', theme.colors.white]}
        style={styles.gradient}>
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
              <View style={styles.formContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                  Create an account to start using AgriCred services
                </Text>

                <SelectCustom
                  label="Role"
                  value={formData.role}
                  onChange={value => updateFormData('role', value)}
                  options={roleOptions}
                  placeholder="Select your role"
                  error={errors.role}
                  required
                  containerStyle={styles.input}
                />

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
                  label="Email"
                  placeholder="Enter your email"
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

                    <LocationPicker
                      label="Location"
                      value={selectedLocation}
                      onChange={location => {
                        setSelectedLocation(location);
                        updateFormData('gps_location', `${location.latitude},${location.longitude}`);
                      }}
                      error={errors.gps_location}
                      required
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

                <InputCustom
                  label="Password"
                  placeholder="Enter your password"
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

                <ButtonCustom
                  title="Create Account"
                  onPress={handleRegister}
                  style={styles.registerButton}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
      <LoadingOverlay visible={loading} message="Creating your account..." />
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
  header: {
    backgroundColor: 'transparent',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.lg,
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
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  imagePicker: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  registerButton: {
    marginTop: theme.spacing.lg,
  },
});

export default RegisterScreen; 