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

interface CreateBatchScreenProps {
  navigation: any;
}

const cultivationMethodOptions = [
  { label: 'Organic', value: 'organic', icon: 'leaf' },
  { label: 'Traditional', value: 'traditional', icon: 'sprout' },
];

const CreateBatchScreen: React.FC<CreateBatchScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    category_id: '',
    product_name: '',
    weight: '',
    variety: '',
    planting_date: new Date(),
    harvest_date: new Date(),
    cultivation_method: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
    farm_image: '',
    product_image: '',
    farmer_image: '',
  });
  const [category, setCategory] = useState<any>([]);
  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await api.get('/categories');
      setCategory(response.data.data);
      setCategoryOptions(response.data.data.map((category: any) => ({
        label: category.name,
        value: category.id,
      })));
    };
    fetchCategories();
  }, []);

    const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    if (!formData.product_name) {
      newErrors.product_name = 'Product name is required';
    }

    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }

    if (!formData.variety) {
      newErrors.variety = 'Variety is required';
    }

    if (!formData.cultivation_method) {
      newErrors.cultivation_method = 'Cultivation method is required';
    }

    if (formData.location.latitude === 0 && formData.location.longitude === 0) {
      newErrors.location = 'Location is required';
    }

    if (!formData.farm_image) {
      newErrors.farm_image = 'Farm image is required';
    }

    if (!formData.product_image) {
      newErrors.product_image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBatch = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Tạo FormData object để gửi file
      const formDataToSend = new FormData();

      // Thêm các thông tin cơ bản
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('product_name', formData.product_name);
      formDataToSend.append('weight', formData.weight.toString());
      formDataToSend.append('variety', formData.variety);
      formDataToSend.append('planting_date', formData.planting_date.toISOString());
      formDataToSend.append('harvest_date', formData.harvest_date.toISOString());
      formDataToSend.append('cultivation_method', formData.cultivation_method);
      formDataToSend.append('location[latitude]', formData.location.latitude.toString());
      formDataToSend.append('location[longitude]', formData.location.longitude.toString());

      // Thêm các file ảnh
      if (formData.farm_image) {
        const farmImageName = formData.farm_image.split('/').pop() || 'farm_image.jpg';
        formDataToSend.append('farm_image', {
          uri: formData.farm_image,
          type: 'image/jpeg',
          name: farmImageName
        });
      }

      if (formData.product_image) {
        const productImageName = formData.product_image.split('/').pop() || 'product_image.jpg';
        formDataToSend.append('product_image', {
          uri: formData.product_image,
          type: 'image/jpeg',
          name: productImageName
        });
      }

      if (formData.farmer_image) {
        const farmerImageName = formData.farmer_image.split('/').pop() || 'farmer_image.jpg';
        formDataToSend.append('farmer_image', {
          uri: formData.farmer_image,
          type: 'image/jpeg',
          name: farmerImageName
        });
      }

      console.log('Creating batch with:', formDataToSend);
      const response = await api.post('/batches', formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log(response);
      navigation.navigate('QRGenerate', { batchId: response.data.data.id });
    } catch (error: any) {
      console.error('Batch creation error:', error.response);
      Alert.alert(
        'Error',
        'Failed to create batch. Please try again.',
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
      <Header
        title="Create New Batch"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          
          {/* Product Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="cube-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Product Information</Text>
            </View>

            <SelectCustom
              label="Category"
              value={formData.category_id}
              onChange={value => updateFormData('category_id', value)}
              options={categoryOptions}
              placeholder="Select product category"
              error={errors.category_id}
              required
            />

            <InputCustom
              label="Product Name"
              placeholder="Enter product name"
              value={formData.product_name}
              onChangeText={value => updateFormData('product_name', value)}
              error={errors.product_name}
              required
              leftIcon="tag-outline"
            />

            <InputCustom
              label="Weight (kg)"
              placeholder="Enter weight in kilograms"
              value={formData.weight}
              onChangeText={value => updateFormData('weight', value)}
              keyboardType="decimal-pad"
              error={errors.weight}
              required
              leftIcon="weight-kilogram"
            />

            <InputCustom
              label="Variety"
              placeholder="Enter product variety"
              value={formData.variety}
              onChangeText={value => updateFormData('variety', value)}
              error={errors.variety}
              required
              leftIcon="leaf-maple"
            />
          </View>

          {/* Cultivation Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="sprout-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Cultivation Details</Text>
            </View>

            <DatePicker
              label="Planting Date"
              value={formData.planting_date}
              onChange={date => updateFormData('planting_date', date)}
              maximumDate={new Date()}
              required
            />

            <DatePicker
              label="Harvest Date"
              value={formData.harvest_date}
              onChange={date => updateFormData('harvest_date', date)}
              minimumDate={formData.planting_date}
              maximumDate={new Date()}
              required
            />

            <SelectCustom
              label="Cultivation Method"
              value={formData.cultivation_method}
              onChange={value => updateFormData('cultivation_method', value)}
              options={cultivationMethodOptions}
              placeholder="Select cultivation method"
              error={errors.cultivation_method}
              required
            />

            <LocationPicker
              label="Farm Location"
              value={formData.location}
              onChange={location => updateFormData('location', location)}
              error={errors.location}
              required
            />
          </View>

          {/* Images Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="image-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Images</Text>
            </View>

            <ImagePicker
              label="Farm Image"
              imageUri={formData.farm_image}
              onImageSelected={uri => updateFormData('farm_image', uri)}
              error={errors.farm_image}
              required
            />

            <ImagePicker
              label="Product Image"
              imageUri={formData.product_image}
              onImageSelected={uri => updateFormData('product_image', uri)}
              error={errors.product_image}
              required
            />

            <ImagePicker
              label="Farmer Image"
              imageUri={formData.farmer_image}
              onImageSelected={uri => updateFormData('farmer_image', uri)}
            />
          </View>

          <ButtonCustom
            title="Create Batch"
            onPress={handleCreateBatch}
            style={styles.createButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingOverlay visible={loading} message="Creating batch..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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

export default CreateBatchScreen; 