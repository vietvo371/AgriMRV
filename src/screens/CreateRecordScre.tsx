import React, { useEffect, useState, useRef } from 'react';
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
  TouchableOpacity,
  Animated,
  PanResponder,
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
  id: string;
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

const { width, height } = Dimensions.get('window');
const MAP_HEIGHT = height * 0.5; // 50% of screen height for map

const CreateRecordScreen: React.FC<CreateRecordScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [mapMode, setMapMode] = useState<'satellite' | 'terrain' | 'hybrid'>('satellite');
  const [drawingMode, setDrawingMode] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Step 1: Plot boundaries
    plotCoordinates: [] as PlotCoordinates[],
    totalArea: '',
    calculatedArea: 0,
    satelliteImageUrl: '',
    plotName: '',
    plotType: '',
    
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
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const mapHeightAnim = useRef(new Animated.Value(MAP_HEIGHT)).current;

  const plotTypeOptions = [
    { label: 'Rice Field', value: 'RICE_FIELD' },
    { label: 'Fruit Orchard', value: 'FRUIT_ORCHARD' },
    { label: 'Agroforestry', value: 'AGROFORESTRY' },
    { label: 'Other', value: 'OTHER' },
  ];

  const wetDryCycleOptions = [
    { label: '7 days wet / 3 days dry', value: '7W3D' },
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
    { label: 'Coconut', value: 'COCONUT' },
    { label: 'Mango', value: 'MANGO' },
    { label: 'Mangrove', value: 'MANGROVE' },
    { label: 'Acacia', value: 'ACACIA' },
    { label: 'Other', value: 'OTHER' },
  ];

  const intercroppingOptions = [
    { label: 'Corn', value: 'CORN' },
    { label: 'Beans', value: 'BEANS' },
    { label: 'Vegetables', value: 'VEGETABLES' },
    { label: 'None', value: 'NONE' },
  ];

  useEffect(() => {
    // Initial animation
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Calculate area from coordinates using Shoelace formula
  const calculateArea = (coordinates: PlotCoordinates[]) => {
    if (coordinates.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i].latitude * coordinates[j].longitude;
      area -= coordinates[j].latitude * coordinates[i].longitude;
    }
    return Math.abs(area) / 2 * 111000 * 111000 / 10000; // Convert to hectares
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.plotCoordinates.length < 3) {
      newErrors.plotCoordinates = 'At least 3 points needed to form an area';
    }
    if (!formData.plotName.trim()) {
      newErrors.plotName = 'Land name is required';
    }
    if (!formData.plotType) {
      newErrors.plotType = 'Land type is required';
    }
    if (!formData.totalArea) {
      newErrors.totalArea = 'Total area is required';
    } else if (isNaN(Number(formData.totalArea)) || Number(formData.totalArea) <= 0) {
      newErrors.totalArea = 'Enter valid area';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.riceAWD.area) {
      newErrors.riceArea = 'Rice AWD area is required';
    } else if (isNaN(Number(formData.riceAWD.area)) || Number(formData.riceAWD.area) <= 0) {
      newErrors.riceArea = 'Enter valid rice area';
    }
    
    if (!formData.riceAWD.wetDryCycle) {
      newErrors.wetDryCycle = 'Wet-dry cycle is required';
    }
    
    if (!formData.riceAWD.strawManagement) {
      newErrors.strawManagement = 'Straw management method is required';
    }
    
    if (!formData.cooperativeMembership.trim()) {
      newErrors.cooperativeMembership = 'Cooperative information is required';
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

  const toggleMapExpansion = () => {
    const newHeight = isMapExpanded ? MAP_HEIGHT : height * 0.8;
    
    Animated.timing(mapHeightAnim, {
      toValue: newHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsMapExpanded(!isMapExpanded);
  };

  const addCoordinate = () => {
    // Mock coordinate for demo - in real app, this would come from GPS/map tap
    const newCoord: PlotCoordinates = {
      id: Date.now().toString(),
      latitude: 10.762622 + (Math.random() - 0.5) * 0.02,
      longitude: 106.660172 + (Math.random() - 0.5) * 0.02,
    };
    
    const newCoordinates = [...formData.plotCoordinates, newCoord];
    const calculatedArea = calculateArea(newCoordinates);
    
    setFormData(prev => ({
      ...prev,
      plotCoordinates: newCoordinates,
      calculatedArea,
      totalArea: calculatedArea.toFixed(2),
    }));
  };

  const removeCoordinate = (id: string) => {
    const newCoordinates = formData.plotCoordinates.filter(coord => coord.id !== id);
    const calculatedArea = calculateArea(newCoordinates);
    
    setFormData(prev => ({
      ...prev,
      plotCoordinates: newCoordinates,
      calculatedArea,
      totalArea: calculatedArea > 0 ? calculatedArea.toFixed(2) : '',
    }));
  };

  const handleCreateRecord = async () => {
    setLoading(true);
    try {
      const payload = {
        plot_boundaries: {
          plotName: formData.plotName,
          plotType: formData.plotType,
          plotCoordinates: formData.plotCoordinates,
          totalArea: Number(formData.totalArea),
          calculatedArea: formData.calculatedArea,
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
      // const response = await api.post('/farm-profiles', payload);
      
      Alert.alert(
        'Success',
        'Land record created successfully!',
        [
          {
            text: 'Go to Dashboard',
            onPress: () => navigation.navigate('MainTabs'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Record creation error:', error.response || error);
      Alert.alert(
        'Error',
        'Could not create record. Please try again.',
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

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill,
            { width: `${(currentStep / 3) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>Step {currentStep}/3</Text>
    </View>
  );

  const renderMapControls = () => (
    <View style={styles.mapControls}>
      <View style={styles.mapModeSelector}>
        <TouchableOpacity
          style={[styles.mapModeButton, mapMode === 'satellite' && styles.mapModeButtonActive]}
          onPress={() => setMapMode('satellite')}>
          <Icon name="satellite-variant" size={16} color={
            mapMode === 'satellite' ? theme.colors.white : theme.colors.primary
          } />
          <Text style={[
            styles.mapModeText,
            mapMode === 'satellite' && styles.mapModeTextActive
          ]}>Satellite</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.mapModeButton, mapMode === 'terrain' && styles.mapModeButtonActive]}
          onPress={() => setMapMode('terrain')}>
          <Icon name="terrain" size={16} color={
            mapMode === 'terrain' ? theme.colors.white : theme.colors.primary
          } />
          <Text style={[
            styles.mapModeText,
            mapMode === 'terrain' && styles.mapModeTextActive
          ]}>Terrain</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.expandMapButton}
        onPress={toggleMapExpansion}>
        <Icon 
          name={isMapExpanded ? "fullscreen-exit" : "fullscreen"} 
          size={20} 
          color={theme.colors.primary} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderMapView = () => (
    <Animated.View style={[styles.mapContainer, { height: mapHeightAnim }]}>
      <LinearGradient
        colors={[theme.colors.primary + '20', theme.colors.info + '20']}
        style={styles.mapGradient}>
        
        {renderMapControls()}
        
        {/* Mock Map View */}
        <View style={styles.mockMap}>
          <View style={styles.mapOverlay}>
            <Icon name="map-marker" size={40} color={theme.colors.primary} />
            <Text style={styles.mapOverlayText}>Interactive Map</Text>
            <Text style={styles.mapOverlaySubtext}>
              Tap to add land boundary points
            </Text>
          </View>
          
          {/* Plot coordinates visualization */}
          {formData.plotCoordinates.map((coord, index) => (
            <TouchableOpacity
              key={coord.id}
              style={[
                styles.coordinateMarker,
                {
                  left: `${20 + (index * 15) % 60}%`,
                  top: `${30 + (index * 20) % 40}%`,
                },
                selectedCoordinate === coord.id && styles.coordinateMarkerSelected
              ]}
              onPress={() => setSelectedCoordinate(
                selectedCoordinate === coord.id ? null : coord.id
              )}>
              <Text style={styles.coordinateMarkerText}>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Map Action Buttons */}
        <View style={styles.mapActions}>
          <TouchableOpacity
            style={[styles.mapActionButton, styles.addPointButton]}
            onPress={addCoordinate}>
            <Icon name="plus" size={20} color={theme.colors.white} />
            <Text style={styles.mapActionText}>Add Point</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.mapActionButton, styles.clearButton]}
            onPress={() => setFormData(prev => ({ 
              ...prev, 
              plotCoordinates: [], 
              calculatedArea: 0, 
              totalArea: '' 
            }))}>
            <Icon name="delete" size={20} color={theme.colors.error} />
            <Text style={[styles.mapActionText, { color: theme.colors.error }]}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderCoordinatesList = () => (
    <View style={styles.coordinatesSection}>
      <View style={styles.coordinatesHeader}>
        <Text style={styles.coordinatesTitle}>
          Boundary Points ({formData.plotCoordinates.length})
        </Text>
        {formData.calculatedArea > 0 && (
          <View style={styles.areaChip}>
            <Icon name="ruler-square" size={14} color={theme.colors.success} />
            <Text style={styles.areaChipText}>
              {formData.calculatedArea.toFixed(2)} ha
            </Text>
          </View>
        )}
      </View>
      
      {formData.plotCoordinates.length === 0 ? (
        <View style={styles.emptyCoordinates}>
          <Icon name="map-marker-plus" size={32} color={theme.colors.textLight} />
          <Text style={styles.emptyCoordinatesText}>
            No boundary points yet
          </Text>
          <Text style={styles.emptyCoordinatesSubtext}>
            Tap on the map or "Add Point" button to start
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.coordinatesList} nestedScrollEnabled>
          {formData.plotCoordinates.map((coord, index) => (
            <View key={coord.id} style={styles.coordinateItem}>
              <View style={styles.coordinateInfo}>
                <View style={styles.coordinateIndex}>
                  <Text style={styles.coordinateIndexText}>{index + 1}</Text>
                </View>
                <View style={styles.coordinateDetails}>
                  <Text style={styles.coordinateText}>
                    {coord.latitude.toFixed(6)}, {coord.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinateLabel}>
                    Latitude, Longitude
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeCoordinateButton}
                onPress={() => removeCoordinate(coord.id)}>
                <Icon name="close" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      
      {errors.plotCoordinates && (
        <Text style={styles.errorText}>{errors.plotCoordinates}</Text>
      )}
    </View>
  );

  const renderStep1 = () => (
    <Animated.View 
      style={[
        styles.stepContainer,
        {
          opacity: slideAnim,
          transform: [{ translateY: Animated.multiply(slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          }), 1) }]
        }
      ]}>
      
      {renderMapView()}
      
      <View style={styles.formSection}>
        <View style={styles.sectionHeader}>
          <Icon name="map-marker-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Land Information</Text>
        </View>
        
        <InputCustom
          label="Land Name"
          placeholder="E.g: Rice field area A"
          value={formData.plotName}
          onChangeText={value => updateFormData('plotName', value)}
          error={errors.plotName}
          required
          leftIcon="tag-outline"
        />

        <SelectCustom
          label="Land Type"
          value={formData.plotType}
          onChange={value => updateFormData('plotType', value)}
          options={plotTypeOptions}
          placeholder="Select land type"
          error={errors.plotType}
          required
        />

        {renderCoordinatesList()}

        <InputCustom
          label="Total Area (ha)"
          placeholder="Enter land area"
          value={formData.totalArea}
          onChangeText={value => updateFormData('totalArea', value)}
          keyboardType="decimal-pad"
          error={errors.totalArea}
          required
          leftIcon="ruler-square"
          rightIcon={formData.calculatedArea > 0 ? "calculator" : undefined}
        />

        <ImagePicker
          label="Satellite Image (Optional)"
          imageUri={formData.satelliteImageUrl}
          onImageSelected={uri => updateFormData('satelliteImageUrl', uri)}
        />
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.formSection}>
        <View style={styles.sectionHeader}>
          <Icon name="leaf" size={24} color={theme.colors.success} />
          <Text style={styles.sectionTitle}>MRV Practices</Text>
        </View>
        
        <Text style={styles.sectionDescription}>
          Declare climate-smart agricultural practices
        </Text>

        {/* Rice AWD Section */}
        <View style={styles.subsection}>
          <View style={styles.subsectionHeader}>
            <Icon name="grain" size={20} color={theme.colors.info} />
            <Text style={styles.subsectionTitle}>Rice AWD (Alternate Wetting and Drying)</Text>
          </View>
          
          <InputCustom
            label="Rice AWD Area (ha)"
            placeholder="Enter area applying AWD"
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
            placeholder="Select wet-dry cycle"
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
          <View style={styles.subsectionHeader}>
            <Icon name="tree" size={20} color={theme.colors.success} />
            <Text style={styles.subsectionTitle}>Agroforestry (Optional)</Text>
          </View>
          
          <InputCustom
            label="Agroforestry Area (ha)"
            placeholder="Enter tree planting area"
            value={formData.agroforestry.area}
            onChangeText={value => updateNestedFormData('agroforestry', 'area', value)}
            keyboardType="decimal-pad"
            leftIcon="ruler-square"
          />

          <InputCustom
            label="Tree Density (trees/ha)"
            placeholder="Enter number of trees per hectare"
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
          <View style={styles.subsectionHeader}>
            <Icon name="account-group" size={20} color={theme.colors.warning} />
            <Text style={styles.subsectionTitle}>Training & Membership</Text>
          </View>
          
          <InputCustom
            label="Cooperative"
            placeholder="Enter cooperative name or code"
            value={formData.cooperativeMembership}
            onChangeText={value => updateFormData('cooperativeMembership', value)}
            error={errors.cooperativeMembership}
            required
            leftIcon="account-group"
          />

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[
                styles.trainingButton,
                formData.trainingCompleted && styles.trainingButtonCompleted
              ]}
              onPress={() => updateFormData('trainingCompleted', !formData.trainingCompleted)}>
              <Icon 
                name={formData.trainingCompleted ? "check-circle" : "circle-outline"} 
                size={20} 
                color={formData.trainingCompleted ? theme.colors.white : theme.colors.primary} 
              />
              <Text style={[
                styles.trainingButtonText,
                formData.trainingCompleted && styles.trainingButtonTextCompleted
              ]}>
                {formData.trainingCompleted ? "Training Completed" : "Training Not Completed"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.completionContainer}>
          
          <Text style={styles.completionTitle}>Ready to Create Record</Text>
          <Text style={styles.completionDescription}>
            Review your information and create your land record. This will help track 
            climate-smart practices and contribute to sustainable agriculture.
          </Text>
          
          <View style={styles.nextStepsContainer}>
            <Text style={styles.nextStepsTitle}>Next Steps:</Text>
            <View style={styles.stepsList}>
              {[
                'Upload agricultural practice photos',
                'Complete declaration and MRV calculation',
                'Wait for AI evidence verification',
                'Receive Carbon Performance score',
                'Connect with green finance partners'
              ].map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText} numberOfLines={2}>{step}</Text>
                </View>
              ))}
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
    <View style={styles.navigationContainer}>
      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.previousButton}
            onPress={handlePreviousStep}>
            <Icon name="chevron-left" size={20} color={theme.colors.primary} />
            <Text style={styles.previousButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 3 ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>Next</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateRecord}>
              <Icon name="check" size={20} color={theme.colors.white} />
              <Text style={styles.createButtonText}>Create Record</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary + '08', theme.colors.white]}
        style={styles.backgroundGradient}>
        
        <Header 
          title="Create Land Record" 
          style={styles.header} 
          onBack={() => navigation.goBack()} 
        />
        
        {renderProgressBar()}
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}>
          
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            
            {renderCurrentStep()}
          </ScrollView>
        </KeyboardAvoidingView>
        
        {renderNavigationButtons()}
        
        <LoadingOverlay visible={loading} message="Creating record..." />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
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
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E6EBE6',
    borderRadius: 2,
    marginRight: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Roboto-Medium',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Reduced padding since navigation is now relative
  },
  stepContainer: {
    flex: 1,
  },
  
  // Map Styles
  mapContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  mapGradient: {
    flex: 1,
    position: 'relative',
  },
  mapControls: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  mapModeSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white + 'E6',
    borderRadius: theme.borderRadius.lg,
    padding: 4,
  },
  mapModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  mapModeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  mapModeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  mapModeTextActive: {
    color: theme.colors.white,
  },
  expandMapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white + 'E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockMap: {
    flex: 1,
    backgroundColor: theme.colors.info + '20',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapOverlay: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  mapOverlayText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  mapOverlaySubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  coordinateMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  coordinateMarkerSelected: {
    backgroundColor: theme.colors.warning,
    transform: [{ scale: 1.2 }],
  },
  coordinateMarkerText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },
  mapActions: {
    position: 'absolute',
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  mapActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  addPointButton: {
    backgroundColor: theme.colors.primary,
  },
  clearButton: {
    backgroundColor: theme.colors.white + 'E6',
    borderWidth: 1,
    borderColor: theme.colors.error + '40',
  },
  mapActionText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
  },

  // Form Styles
  formSection: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    borderRadius: 20,
    padding: theme.spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
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
    marginLeft: theme.spacing.md,
  },
  sectionDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },

  // Coordinates Section
  coordinatesSection: {
    marginVertical: theme.spacing.lg,
  },
  coordinatesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  coordinatesTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success + '15',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.xs,
  },
  areaChipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.success,
    fontFamily: theme.typography.fontFamily.bold,
  },
  emptyCoordinates: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.border + '10',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyCoordinatesText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: theme.spacing.md,
  },
  emptyCoordinatesSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  coordinatesList: {
    maxHeight: 200,
  },
  coordinateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  coordinateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coordinateIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  coordinateIndexText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },
  coordinateDetails: {
    flex: 1,
  },
  coordinateText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 2,
  },
  coordinateLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },
  removeCoordinateButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Subsection Styles
  subsection: {
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  subsectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  checkboxContainer: {
    marginTop: theme.spacing.md,
  },
  trainingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.border + '20',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  trainingButtonCompleted: {
    backgroundColor: theme.colors.success + '15',
    borderColor: theme.colors.success,
  },
  trainingButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.medium,
  },
  trainingButtonTextCompleted: {
    color: theme.colors.success,
    fontFamily: theme.typography.fontFamily.bold,
  },

  // Step 3 Styles
  completionContainer: {
    margin: theme.spacing.lg,
    flex: 1,
  },
  completionGradient: {
    borderRadius: 20,
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 200,
  },
  completionIcon: {
    marginBottom: theme.spacing.lg,
  },
  completionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  completionDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  summaryCards: {
    flexDirection: 'column',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    width: '100%',
  },
  summaryCard: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
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
  summaryCardContent: {
    flex: 1,
    flexDirection: 'column',
  },
  summaryCardTitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
    textAlign: 'left',
    fontFamily: theme.typography.fontFamily.medium,
    flex: 1,
  },
  summaryCardValue: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'left',
    flex: 1,
  },
  summaryCardSubvalue: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'left',
    flex: 1,
  },
  nextStepsContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border,
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
  nextStepsTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  stepsList: {
    gap: theme.spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.bold,
  },
  stepText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 20,
    textAlign: 'left',
  },

  // Navigation Styles
  navigationContainer: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingHorizontal: 24,
    marginTop: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  previousButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  previousButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.bold,
  },
  nextButton: {
    flex: 2,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
  },
  nextButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
  },
  createButton: {
    flex: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
  },
  createButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
});

export default CreateRecordScreen;
