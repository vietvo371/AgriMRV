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
  Dimensions,
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

interface PlotCoordinates {
  latitude: number;
  longitude: number;
}

interface MRVPractices {
  riceAWD: {
    area: number;
    sowingDate: Date;
    wetDryCycle: string;
    strawManagement: string;
  };
  agroforestry: {
    area: number;
    treeDensity: number;
    treeSpecies: string[];
    intercroppingCrops: string[];
  };
  cooperativeMembership: string;
  trainingCompleted: boolean;
}

const CreateRecordScreen: React.FC<CreateRecordScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Plot boundaries
    plotCoordinates: [] as PlotCoordinates[],
    totalArea: '',
    satelliteImageUrl: '',
    
    // Step 2: MRV practices
    riceAWD: {
      area: '',
      sowingDate: new Date(),
      wetDryCycle: '',
      strawManagement: '',
    },
    agroforestry: {
      area: '',
      treeDensity: '',
      treeSpecies: [] as string[],
      intercroppingCrops: [] as string[],
    },
    cooperativeMembership: '',
    trainingCompleted: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const wetDryCycleOptions = [
    { label: '7 days wet / 7 days dry', value: '7W7D' },
    { label: '10 days wet / 10 days dry', value: '10W10D' },
    { label: '14 days wet / 14 days dry', value: '14W14D' },
    { label: 'Continuous flooding', value: 'CONTINUOUS' },
  ];

  const strawManagementOptions = [
    { label: 'Incorporated into soil', value: 'INCORPORATED' },
    { label: 'Removed from field', value: 'REMOVED' },
    { label: 'Burned', value: 'BURNED' },
    { label: 'Left on surface', value: 'SURFACE' },
  ];

  const treeSpeciesOptions = [
    { label: 'Acacia', value: 'ACACIA' },
    { label: 'Eucalyptus', value: 'EUCALYPTUS' },
    { label: 'Mangrove', value: 'MANGROVE' },
    { label: 'Fruit trees', value: 'FRUIT_TREES' },
    { label: 'Other', value: 'OTHER' },
  ];

  const intercroppingOptions = [
    { label: 'Corn', value: 'CORN' },
    { label: 'Beans', value: 'BEANS' },
    { label: 'Vegetables', value: 'VEGETABLES' },
    { label: 'None', value: 'NONE' },
  ];

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.plotCoordinates.length < 3) {
      newErrors.plotCoordinates = 'At least 3 coordinates required to define plot';
    }
    if (!formData.totalArea) {
      newErrors.totalArea = 'Total area is required';
    } else if (isNaN(Number(formData.totalArea)) || Number(formData.totalArea) <= 0) {
      newErrors.totalArea = 'Enter a valid area';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.riceAWD.area) {
      newErrors.riceArea = 'Rice AWD area is required';
    } else if (isNaN(Number(formData.riceAWD.area)) || Number(formData.riceAWD.area) <= 0) {
      newErrors.riceArea = 'Enter a valid rice area';
    }
    
    if (!formData.riceAWD.wetDryCycle) {
      newErrors.wetDryCycle = 'Wet-dry cycle is required';
    }
    
    if (!formData.riceAWD.strawManagement) {
      newErrors.strawManagement = 'Straw management is required';
    }
    
    if (!formData.cooperativeMembership) {
      newErrors.cooperativeMembership = 'Cooperative membership is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateRecord = async () => {
    setLoading(true);
    try {
      const payload = {
        plot_boundaries: {
          plotCoordinates: formData.plotCoordinates,
          totalArea: Number(formData.totalArea),
          satelliteImageUrl: formData.satelliteImageUrl || undefined,
        },
        mrv_practices: {
          riceAWD: {
            area: Number(formData.riceAWD.area),
            sowingDate: formData.riceAWD.sowingDate.toISOString().split('T')[0],
            wetDryCycle: formData.riceAWD.wetDryCycle,
            strawManagement: formData.riceAWD.strawManagement,
          },
          agroforestry: {
            area: Number(formData.agroforestry.area) || 0,
            treeDensity: Number(formData.agroforestry.treeDensity) || 0,
            treeSpecies: formData.agroforestry.treeSpecies,
            intercroppingCrops: formData.agroforestry.intercroppingCrops,
          },
          cooperativeMembership: formData.cooperativeMembership,
          trainingCompleted: formData.trainingCompleted,
        },
      };

      console.log('Creating record with:', payload);
      const response = await api.post('/farm-profiles', payload);
      
      Alert.alert(
        'Success',
        'Record created successfully!',
        [
          {
            text: 'Go to Dashboard',
            onPress: () => navigation.navigate('Dashboard'),
          },
        ]
      );
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

  const updateNestedFormData = (parentKey: keyof typeof formData, childKey: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as Record<string, any>),
        [childKey]: value,
      },
    }));
    
    const errorKey = `${parentKey}${childKey.charAt(0).toUpperCase() + childKey.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addCoordinate = () => {
    // Mock coordinate for demo - in real app, this would come from GPS
    const newCoord = {
      latitude: 10.762622 + Math.random() * 0.01,
      longitude: 106.660172 + Math.random() * 0.01,
    };
    setFormData(prev => ({
      ...prev,
      plotCoordinates: [...prev.plotCoordinates, newCoord],
    }));
  };

  const removeCoordinate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      plotCoordinates: prev.plotCoordinates.filter((_, i) => i !== index),
    }));
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepContainer}>
        <View style={[styles.step, currentStep >= 1 && styles.stepActive]}>
          <Text style={[styles.stepNumber, currentStep >= 1 && styles.stepNumberActive]}>1</Text>
        </View>
        <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>Plot Boundaries</Text>
      </View>
      
      <View style={styles.stepLine} />
      
      <View style={styles.stepContainer}>
        <View style={[styles.step, currentStep >= 2 && styles.stepActive]}>
          <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
        </View>
        <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>MRV Practices</Text>
      </View>
      
      <View style={styles.stepLine} />
      
      <View style={styles.stepContainer}>
        <View style={[styles.step, currentStep >= 3 && styles.stepActive]}>
          <Text style={[styles.stepNumber, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
        </View>
        <Text style={[styles.stepLabel, currentStep >= 3 && styles.stepLabelActive]}>Complete</Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="map-marker" size={20} color={theme.colors.primary} />
        <Text style={styles.sectionTitle}>Plot Boundaries</Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        Define the boundaries of your farming plot using GPS coordinates
      </Text>

      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinatesTitle}>Plot Coordinates:</Text>
        {formData.plotCoordinates.map((coord, index) => (
          <View key={index} style={styles.coordinateItem}>
            <Text style={styles.coordinateText}>
              {index + 1}. Lat: {coord.latitude.toFixed(6)}, Long: {coord.longitude.toFixed(6)}
            </Text>
            <ButtonCustom
              title="Remove"
              onPress={() => removeCoordinate(index)}
              style={styles.removeButton}
              textStyle={styles.removeButtonText}
            />
          </View>
        ))}
        
        <ButtonCustom
          title="Add Coordinate"
          onPress={addCoordinate}
          style={styles.addCoordinateButton}
        />
        
        {errors.plotCoordinates && (
          <Text style={styles.errorText}>{errors.plotCoordinates}</Text>
        )}
      </View>

      <InputCustom
        label="Total Area (ha)"
        placeholder="Enter total plot area in hectares"
        value={formData.totalArea}
        onChangeText={value => updateFormData('totalArea', value)}
        keyboardType="decimal-pad"
        error={errors.totalArea}
        required
        leftIcon="ruler-square"
      />

      <ImagePicker
        label="Satellite Image (optional)"
        imageUri={formData.satelliteImageUrl}
        onImageSelected={uri => updateFormData('satelliteImageUrl', uri)}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="leaf" size={20} color={theme.colors.primary} />
        <Text style={styles.sectionTitle}>MRV Practices</Text>
      </View>
      
      <Text style={styles.sectionDescription}>
        Declare your climate-smart agricultural practices
      </Text>

      {/* Rice AWD Section */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Rice AWD (Alternate Wetting and Drying)</Text>
        
        <InputCustom
          label="Rice AWD Area (ha)"
          placeholder="Enter area under AWD practice"
          value={formData.riceAWD.area}
          onChangeText={value => updateNestedFormData('riceAWD', 'area', value)}
          keyboardType="decimal-pad"
          error={errors.riceArea}
          required
          leftIcon="ruler-square"
        />

        <DatePicker
          label="Sowing Date"
          value={formData.riceAWD.sowingDate}
          onChange={date => updateNestedFormData('riceAWD', 'sowingDate', date)}
          maximumDate={new Date()}
          required
        />

        <SelectCustom
          label="Wet-Dry Cycle"
          value={formData.riceAWD.wetDryCycle}
          onChange={value => updateNestedFormData('riceAWD', 'wetDryCycle', value)}
          options={wetDryCycleOptions}
          placeholder="Select cycle pattern"
          error={errors.wetDryCycle}
          required
        />

        <SelectCustom
          label="Straw Management"
          value={formData.riceAWD.strawManagement}
          onChange={value => updateNestedFormData('riceAWD', 'strawManagement', value)}
          options={strawManagementOptions}
          placeholder="Select straw management method"
          error={errors.strawManagement}
          required
        />
      </View>

      {/* Agroforestry Section */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Agroforestry (Optional)</Text>
        
        <InputCustom
          label="Agroforestry Area (ha)"
          placeholder="Enter area under agroforestry"
          value={formData.agroforestry.area}
          onChangeText={value => updateNestedFormData('agroforestry', 'area', value)}
          keyboardType="decimal-pad"
          leftIcon="ruler-square"
        />

        <InputCustom
          label="Tree Density (trees/ha)"
          placeholder="Enter tree density"
          value={formData.agroforestry.treeDensity}
          onChangeText={value => updateNestedFormData('agroforestry', 'treeDensity', value)}
          keyboardType="numeric"
          leftIcon="tree"
        />

        <SelectCustom
          label="Tree Species"
          value={formData.agroforestry.treeSpecies.join(', ')}
          onChange={value => updateNestedFormData('agroforestry', 'treeSpecies', value.split(', ').filter(v => v.trim()))}
          options={treeSpeciesOptions}
          placeholder="Select tree species"
        />

        <SelectCustom
          label="Intercropping Crops"
          value={formData.agroforestry.intercroppingCrops.join(', ')}
          onChange={value => updateNestedFormData('agroforestry', 'intercroppingCrops', value.split(', ').filter(v => v.trim()))}
          options={intercroppingOptions}
          placeholder="Select intercropping crops"
        />
      </View>

      {/* Training and Membership */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Training & Membership</Text>
        
        <InputCustom
          label="Cooperative Membership"
          placeholder="Enter cooperative name or ID"
          value={formData.cooperativeMembership}
          onChangeText={value => updateFormData('cooperativeMembership', value)}
          error={errors.cooperativeMembership}
          required
          leftIcon="account-group"
        />

        <View style={styles.checkboxContainer}>
          <ButtonCustom
            title={formData.trainingCompleted ? "✓ Training Completed" : "Training Not Completed"}
            onPress={() => updateFormData('trainingCompleted', !formData.trainingCompleted)}
            style={formData.trainingCompleted ? styles.trainingButtonCompleted : styles.trainingButton}
            textStyle={formData.trainingCompleted ? styles.trainingButtonTextCompleted : styles.trainingButtonText}
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="check-circle" size={20} color={theme.colors.primary} />
        <Text style={styles.sectionTitle}>Complete Record</Text>
      </View>
      
      <View style={styles.completionContainer}>
        <Icon name="check-circle-outline" size={80} color={theme.colors.success} />
        <Text style={styles.completionTitle}>Ready to Create Record</Text>
        <Text style={styles.completionDescription}>
          Review your information and create your farming record. This will help track your climate-smart practices and contribute to sustainable agriculture.
        </Text>
        
        <View style={styles.nextStepsContainer}>
          <Text style={styles.nextStepsTitle}>Next Steps:</Text>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <Text style={styles.nextStepNumber}>1.</Text>
              <Text style={styles.stepText}>Upload photos of your farming practices</Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.nextStepNumber}>2.</Text>
              <Text style={styles.stepText}>Complete MRV declaration and calculation</Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.nextStepNumber}>3.</Text>
              <Text style={styles.stepText}>Wait for AI verification of your evidence</Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.nextStepNumber}>4.</Text>
              <Text style={styles.stepText}>Receive your Carbon Performance score</Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.nextStepNumber}>5.</Text>
              <Text style={styles.stepText}>Connect with green finance partners</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  const renderNavigationButtons = () => (
    <View style={styles.navigationButtons}>
      {currentStep > 1 && (
        <ButtonCustom
          title="Previous"
          onPress={handlePreviousStep}
          style={styles.previousButton}
          textStyle={styles.previousButtonText}
        />
      )}
      
      {currentStep < 3 ? (
        <ButtonCustom
          title="Next"
          onPress={handleNextStep}
          style={styles.nextButton}
        />
      ) : (
        <ButtonCustom
          title="Create Record"
          onPress={handleCreateRecord}
          style={styles.createButton}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.secondary + '30', theme.colors.white]}
        style={styles.gradient}>
        <Header 
          title="Create Crop Record" 
          style={styles.header} 
          onBack={() => navigation.goBack()} 
        />
        
        {renderStepIndicator()}
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            
            {renderCurrentStep()}
            
            {renderNavigationButtons()}
          </ScrollView>
        </KeyboardAvoidingView>
        
        <LoadingOverlay visible={loading} message="Creating record..." />
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
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
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
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  stepActive: {
    backgroundColor: theme.colors.primary,
  },
  stepNumber: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textLight,
  },
  stepNumberActive: {
    color: theme.colors.white,
  },
  stepLabel: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: theme.colors.primary,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
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
  sectionDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  subsection: {
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  subsectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  coordinatesContainer: {
    marginBottom: theme.spacing.lg,
  },
  coordinatesTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  coordinateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.border + '20',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  coordinateText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
  },
  addCoordinateButton: {
    marginTop: theme.spacing.sm,
  },
  removeButton: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  removeButtonText: {
    fontSize: 12,
  },
  checkboxContainer: {
    marginTop: theme.spacing.md,
  },
  trainingButton: {
    backgroundColor: theme.colors.border,
  },
  trainingButtonCompleted: {
    backgroundColor: theme.colors.success,
  },
  trainingButtonText: {
    color: theme.colors.text,
  },
  trainingButtonTextCompleted: {
    color: theme.colors.white,
  },
  completionContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  completionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  completionDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  summaryContainer: {
    backgroundColor: theme.colors.border + '20',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
  },
  summaryTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  summaryText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  previousButton: {
    flex: 0.48,
    backgroundColor: theme.colors.border,
  },
  previousButtonText: {
    color: theme.colors.text,
  },
  nextButton: {
    flex: 0.48,
  },
  createButton: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    marginLeft: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
  nextStepsContainer: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
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
  nextStepsTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  stepsList: {
    gap: theme.spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  nextStepNumber: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    minWidth: 20,
  },
  stepText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 20,
  },
});

export default CreateRecordScreen; 