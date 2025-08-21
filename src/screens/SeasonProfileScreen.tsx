import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import InputCustom from '../component/InputCustom';
import SelectCustom from '../component/SelectCustom';
import DatePicker from '../component/DatePicker';
import ButtonCustom from '../component/ButtonCustom';
import Card from '../component/Card';
import { Shadow } from 'react-native-shadow-2';

interface SeasonProfileScreenProps {
  navigation: any;
}

const cropTypes = [
  { label: 'Rice', value: 'rice' },
  { label: 'Corn', value: 'corn' },
  { label: 'Wheat', value: 'wheat' },
  { label: 'Soybean', value: 'soybean' },
  { label: 'Cassava', value: 'cassava' },
];

interface PreviousHarvest {
  quantity: string;
  price: string;
  date: Date;
}

const SeasonProfileScreen: React.FC<SeasonProfileScreenProps> = ({
  navigation,
}) => {
  const [formData, setFormData] = useState({
    cropType: '',
    area: '',
    sowingDate: new Date(),
    expectedYield: '',
  });

  const [previousHarvests, setPreviousHarvests] = useState<PreviousHarvest[]>([
    { quantity: '', price: '', date: new Date() },
    { quantity: '', price: '', date: new Date() },
    { quantity: '', price: '', date: new Date() },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cropType) {
      newErrors.cropType = 'Please select a crop type';
    }

    if (!formData.area) {
      newErrors.area = 'Area is required';
    } else if (isNaN(Number(formData.area)) || Number(formData.area) <= 0) {
      newErrors.area = 'Please enter a valid area';
    }

    if (!formData.expectedYield) {
      newErrors.expectedYield = 'Expected yield is required';
    } else if (
      isNaN(Number(formData.expectedYield)) ||
      Number(formData.expectedYield) <= 0
    ) {
      newErrors.expectedYield = 'Please enter a valid yield';
    }

    // Validate previous harvests
    previousHarvests.forEach((harvest, index) => {
      if (harvest.quantity && isNaN(Number(harvest.quantity))) {
        newErrors[`harvest${index}quantity`] = 'Please enter a valid quantity';
      }
      if (harvest.price && isNaN(Number(harvest.price))) {
        newErrors[`harvest${index}price`] = 'Please enter a valid price';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      navigation.navigate('ImageUpload', { seasonId: '123' }); // Replace with actual season ID
    } else {
      Alert.alert('Error', 'Please fill in all required fields correctly');
    }
  };

  const updateHarvest = (index: number, field: keyof PreviousHarvest, value: any) => {
    const newHarvests = [...previousHarvests];
    newHarvests[index] = { ...newHarvests[index], [field]: value };
    setPreviousHarvests(newHarvests);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Shadow startColor={'#00000010'} offset={[0, 2]} style={styles.fullWidth}>
            <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Current Season</Text>
            <Text style={styles.sectionSubtitle}>Provide key details to estimate yield and risk.</Text>
            <SelectCustom
              label="Crop Type"
              value={formData.cropType}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, cropType: value }))
              }
              options={cropTypes}
              placeholder="Select crop type"
              error={errors.cropType}
              required
              containerStyle={styles.input}
            />

            <InputCustom
              label="Area (hectares)"
              placeholder="Enter area in hectares"
              value={formData.area}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, area: value }))
              }
              keyboardType="decimal-pad"
              error={errors.area}
              required
              leftIcon="ruler-square"
              containerStyle={styles.input}
            />

            <DatePicker
              label="Sowing Date"
              value={formData.sowingDate}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, sowingDate: value }))
              }
              error={errors.sowingDate}
              required
              maximumDate={new Date()}
            />

            <InputCustom
              label="Expected Yield (tons)"
              placeholder="Enter expected yield"
              value={formData.expectedYield}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, expectedYield: value }))
              }
              keyboardType="decimal-pad"
              error={errors.expectedYield}
              required
              leftIcon="weight"
              containerStyle={styles.input}
            />
            </Card>
          </Shadow>

          <Shadow startColor={'#00000010'} offset={[0, 2]} style={styles.fullWidth}>
            <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Previous Harvests</Text>
            <Text style={styles.sectionSubtitle}>
              Add up to 3 previous harvests to improve your credit score
            </Text>

            {previousHarvests.map((harvest, index) => (
              <View key={index} style={styles.harvestContainer}>
                <Text style={styles.harvestTitle}>Harvest {index + 1}</Text>
                <InputCustom
                  label="Quantity (tons)"
                  placeholder="Enter quantity"
                  value={harvest.quantity}
                  onChangeText={(value) => updateHarvest(index, 'quantity', value)}
                  keyboardType="decimal-pad"
                  error={errors[`harvest${index}quantity`]}
                  leftIcon="weight"
                  containerStyle={styles.input}
                />

                <InputCustom
                  label="Price per ton"
                  placeholder="Enter price"
                  value={harvest.price}
                  onChangeText={(value) => updateHarvest(index, 'price', value)}
                  keyboardType="decimal-pad"
                  error={errors[`harvest${index}price`]}
                  leftIcon="currency-usd"
                  containerStyle={styles.input}
                />

                <DatePicker
                  label="Delivery Date"
                  value={harvest.date}
                  onChange={(value) => updateHarvest(index, 'date', value)}
                  error={errors[`harvest${index}date`]}
                  maximumDate={new Date()}
                  containerStyle={styles.input}
                />
              </View>
            ))}
            </Card>
          </Shadow>

          <ButtonCustom
            title="Continue to Photos"
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  formCard: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    width: '100%',
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  sectionSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  harvestContainer: {
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  harvestTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
});

export default SeasonProfileScreen;
