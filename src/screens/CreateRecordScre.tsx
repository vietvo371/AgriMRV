import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import InputCustom from '../component/InputCustom';
import SelectCustom from '../component/SelectCustom';
import DatePicker from '../component/DatePicker';
import LocationPicker from '../component/LocationPicker';
import ImagePicker from '../component/ImagePicker';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import api from '../utils/Api';
import { LinearGradient } from 'react-native-linear-gradient';

interface CreateRecordScreenProps {
  navigation: any;
}

const CreateRecordScreen: React.FC<CreateRecordScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    // farm_profiles
    crop_type: '',
    area_ha: '',
    sowing_date: new Date(),
    expected_yield: '',
    // yield_history
    season: '',
    quantity: '',
    avg_price: '',
    delivery_date: new Date(),
    // images
    image_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const cropOptions = [
    { label: 'Rice', value: 'Rice' },
    { label: 'Wheat', value: 'Wheat' },
    { label: 'Corn', value: 'Corn' },
    { label: 'Soybean', value: 'Soybean' },
    { label: 'Cassava', value: 'Cassava' },
  ];

    const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.crop_type) newErrors.crop_type = 'Crop type is required';
    if (!formData.area_ha) newErrors.area_ha = 'Area (ha) is required';
    else if (isNaN(Number(formData.area_ha)) || Number(formData.area_ha) <= 0) newErrors.area_ha = 'Enter a valid area';

    if (!formData.expected_yield) newErrors.expected_yield = 'Expected yield is required';
    else if (isNaN(Number(formData.expected_yield)) || Number(formData.expected_yield) <= 0) newErrors.expected_yield = 'Enter a valid yield';

    if (!formData.season) newErrors.season = 'Season is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) newErrors.quantity = 'Enter a valid quantity';

    if (!formData.avg_price) newErrors.avg_price = 'Average price is required';
    else if (isNaN(Number(formData.avg_price)) || Number(formData.avg_price) <= 0) newErrors.avg_price = 'Enter a valid price';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRecord = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        farm_profile: {
          crop_type: formData.crop_type,
          area_ha: Number(formData.area_ha),
          sowing_date: formData.sowing_date.toISOString().split('T')[0],
          expected_yield: Number(formData.expected_yield),
        },
        yield_history: {
          season: formData.season,
          quantity: Number(formData.quantity),
          avg_price: Number(formData.avg_price),
          delivery_date: formData.delivery_date.toISOString().split('T')[0],
        },
        image_url: formData.image_url || undefined,
      };

      console.log('Creating record with:', payload);
      const response = await api.post('/farm-profiles', payload);
      navigation.goBack();
    } catch (error: any) {
      console.error('Record creation error:', error.response || error);
      Alert.alert(
        'Error',
        'Failed to create record. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.secondary + '30', theme.colors.white]}
        style={styles.gradient}>
      <Header title="Create Crop Record" style={styles.header} onBack={() => {
        navigation.goBack();
      }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          
          {/* Farm Profile */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="sprout" size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Farm Profile</Text>
            </View>

            <SelectCustom
              label="Crop Type"
              value={formData.crop_type}
              onChange={value => updateFormData('crop_type', value)}
              options={cropOptions}
              placeholder="Select crop"
              error={errors.crop_type}
              required
            />

            <InputCustom
              label="Area (ha)"
              placeholder="Enter farm area in hectares"
              value={formData.area_ha}
              onChangeText={value => updateFormData('area_ha', value)}
              keyboardType="decimal-pad"
              error={errors.area_ha}
              required
              leftIcon="ruler-square"
            />

            <DatePicker
              label="Sowing Date"
              value={formData.sowing_date}
              onChange={date => updateFormData('sowing_date', date)}
              maximumDate={new Date()}
              required
            />

            <InputCustom
              label="Expected Yield (kg)"
              placeholder="Enter expected total yield"
              value={formData.expected_yield}
              onChangeText={value => updateFormData('expected_yield', value)}
              keyboardType="decimal-pad"
              error={errors.expected_yield}
              required
              leftIcon="chart-line"
            />
          </View>

          {/* Harvest Details (Yield History) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="basket-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Harvest Details</Text>
            </View>

            <InputCustom
              label="Season"
              placeholder="e.g., 2024-S1"
              value={formData.season}
              onChangeText={value => updateFormData('season', value)}
              error={errors.season}
              required
              leftIcon="calendar"
            />

            <InputCustom
              label="Quantity (kg)"
              placeholder="Enter harvested quantity"
              value={formData.quantity}
              onChangeText={value => updateFormData('quantity', value)}
              keyboardType="decimal-pad"
              error={errors.quantity}
              required
              leftIcon="weight-kilogram"
            />

            <InputCustom
              label="Average Price"
              placeholder="Enter average price"
              value={formData.avg_price}
              onChangeText={value => updateFormData('avg_price', value)}
              keyboardType="decimal-pad"
              error={errors.avg_price}
              required
              leftIcon="currency-usd"
            />

            <DatePicker
              label="Delivery Date"
              value={formData.delivery_date}
              onChange={date => updateFormData('delivery_date', date)}
              maximumDate={new Date()}
              required
            />
          </View>

          {/* Image (optional) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="image-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Image</Text>
            </View>

            <ImagePicker
              label="Upload Image (optional)"
              imageUri={formData.image_url}
              onImageSelected={uri => updateFormData('image_url', uri)}
            />
          </View>

          <ButtonCustom
            title="Save Record"
            onPress={handleCreateRecord}
            style={styles.createButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingOverlay visible={loading} message="Creating batch..." />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  gradient: {
    flex: 1,
  },
  header: {
    // backgroundColor: 'transparent',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  createButton: {
    marginBottom: theme.spacing.xl,
  },
});

export default CreateRecordScreen; 