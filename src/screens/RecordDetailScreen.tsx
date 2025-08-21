import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import Badge from '../component/Badge';
import ReviewCard from '../component/ReviewCard';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import api from '../utils/Api';
import { deriveRecordDetail } from '../utils/mockData';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type RecordDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'RecordDetail'>;

interface RecordDetailsResponse {
  data: {
    id: string;
    product_name: string;
    category: string;
    weight: number;
    area_ha?: number;
    expected_yield?: number;
    season?: string;
    avg_price?: number;
    variety: string;
    planting_date: string;
    harvest_date: string;
    cultivation_method: string;
    status: 'active' | 'completed' | 'cancelled';
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    images: {
      farm: string | null;
      product: string | null;
      farmer?: string | null;
    };
    traceability: {
      batch_code: string;
      packaging_date: string;
      best_before: string;
    };
    stats: {
      total_scans: number;
      unique_customers: number;
      average_rating: number;
    };
    farmer: {
      name: string;
      phone: string;
      email: string;
    };
    certification: {
      number: string;
      validUntil: string;
    };
    sustainability: {
      water_usage: string;
      carbon_footprint: string;
      pesticide_usage: string;
    };
    reviews: Array<{
      id: string;
      reviewer: {
        name: string;
      };
      rating: number;
      comment: string;
      date: string;
    }>;
  };
  message: string;
}


const RecordDetailScreen: React.FC<RecordDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(false);
  const { recordId } = route.params;
  const [batch, setBatch] = useState<RecordDetailsResponse['data'] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const convertDateToISOString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  useEffect(() => {
    setLoading(true);
    const data = deriveRecordDetail(recordId);
    setBatch(data as any);
    setLoading(false);
  }, [recordId]);

  console.log(recordId);
  console.log(batch);

  const handleGenerateQR = () => {
    navigation.navigate('QRGenerate', { batch });
  };

  const handleEditBatch = () => {
    // TODO: Implement edit functionality
    console.log('Edit record:', recordId);
  };

  const renderInfoItem = (icon: string, label: string, value: string, color: string) => (
    <View style={styles.infoItem}>
      <View style={[styles.infoIcon, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const renderCertificationItem = (icon: string, title: string, value: string, color: string) => (
    <View style={styles.certificationItem}>
      <View style={[styles.certificationIcon, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={styles.certificationContent}>
        <Text style={styles.certificationTitle}>{title}</Text>
        <Text style={styles.certificationValue}>{value}</Text>
      </View>
    </View>
  );

  if (!batch) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Record Details" onBack={() => navigation.goBack()} />
        <LoadingOverlay visible={loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Record Details" onBack={() => navigation.goBack()} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.productName}>{batch.product_name}</Text>
              {!!batch.category && (
                <View style={styles.categoryContainer}>
                  <Icon name="tag-outline" size={16} color={theme.colors.textLight} />
                  <Text style={styles.category}>{batch.category}</Text>
                </View>
              )}
            </View>
            <Badge text={batch.status?.toUpperCase() || 'SUBMITTED'} variant={batch.status === 'completed' ? 'success' : 'info'} />
          </View>
        </View>

        {/* Verification Banner (from CreateRecord fields) */}
        {batch.status === 'completed' && (
          <View style={[styles.verificationBanner, styles.elevation]}>
            <View style={styles.verificationRow}>
              <Icon name="shield-check" size={22} color={theme.colors.success} />
              <Text style={styles.verificationTitle}>Verification Complete</Text>
            </View>
            <Text style={styles.verificationText}>
              This harvest has been verified by our AI system and contributes to your credit score.
            </Text>
          </View>
        )}

        {/* Product Information */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="information" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Product Information</Text>
          </View>
          <View style={styles.infoGrid}>
            {renderInfoItem('weight-kilogram', 'Weight', `${batch.weight} kg`, theme.colors.primary)}
            {renderInfoItem('ruler-square', 'Area', `${batch.area_ha || '-'} ha`, theme.colors.secondary)}
            {renderInfoItem('leaf', 'Method', batch.cultivation_method, theme.colors.secondary)}
            {renderInfoItem('calendar-blank', 'Planted', convertDateToISOString(new Date(batch.planting_date)), theme.colors.accent)}
            {renderInfoItem('calendar-check', 'Harvested', convertDateToISOString(new Date(batch.harvest_date)), theme.colors.success)}
            {renderInfoItem('cash', 'Avg Price', `${batch.avg_price || 0}`, theme.colors.info)}
          </View>
        </View>


        {/* Farm Location */}
        {/* Verification Photos */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="image-multiple" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Verification Photos</Text>
          </View>
          <View style={styles.photoGrid}>
            {[batch.images.farm, batch.images.product, batch.images.farmer]
              .filter((u): u is string => !!u)
              .map((uri, idx) => (
                <TouchableOpacity key={idx} activeOpacity={0.85} onPress={() => setSelectedImage(uri)}>
                  <Image source={{ uri }} style={styles.photoThumb} />
                </TouchableOpacity>
              ))}
            {![batch.images.farm, batch.images.product, batch.images.farmer].some(Boolean) && (
              <Text style={styles.emptyPhotos}>No verification photos available</Text>
            )}
          </View>
        </View>

        {/* Farm Location */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="map-marker" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Farm Location</Text>
          </View>
          <View style={styles.mapContainer}>
            <View style={styles.addressContainer}>
              <Icon name="home-variant" size={20} color={theme.colors.primary} />
              <Text style={styles.address}>{batch.location.address}</Text>
            </View>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: batch.location.latitude,
                longitude: batch.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: batch.location.latitude,
                  longitude: batch.location.longitude,
                }}
              />
            </MapView>
          </View>
        </View>

        {/* Farmer Information */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="account" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Farmer Information</Text>
          </View>
          <View style={styles.farmerCard}>
            <Image
              source={ require('../assets/images/avatar.jpeg')}
              style={styles.farmerImage}
            />
            <View style={styles.farmerDetails}>
              <Text style={styles.farmerName}>{batch.farmer.name}</Text>
              <View style={styles.contactItem}>
                <Icon name="phone" size={16} color={theme.colors.primary} />
                <Text style={styles.farmerContact}>{batch.farmer.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <Icon name="email" size={16} color={theme.colors.primary} />
                <Text style={styles.farmerContact}>{batch.farmer.email}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <LoadingOverlay visible={loading} />

      {selectedImage && (
        <View style={styles.viewerOverlay}>
          <TouchableOpacity style={styles.viewerBackdrop} onPress={() => setSelectedImage(null)} />
          <Image source={{ uri: selectedImage }} style={styles.viewerImage} resizeMode="contain" />
          <TouchableOpacity style={styles.viewerClose} onPress={() => setSelectedImage(null)}>
            <Icon name="close" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
  },
  elevation: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  batchInfoContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  batchCode: {
    fontSize: 14,
    color: theme.colors.textLight,
    fontFamily: 'monospace',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginVertical: 8,
  },
  statsLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: 12,
  },
  timelineContainer: {
    gap: 16,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
  },
  certificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  certificationContent: {
    flex: 1,
  },
  certificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  certificationValue: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '45%',
    flex: 1,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  sustainabilityGrid: {
    gap: 12,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  address: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
    flex: 1,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  farmerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 16,
  },
  farmerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  farmerDetails: {
    flex: 1,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  farmerContact: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginLeft: 8,
  },
  reviewsContainer: {
    gap: 12,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 12,
  },
  verificationBanner: {
    backgroundColor: theme.colors.successLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.success,
  },
  verificationText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoThumb: {
    width: (Dimensions.get('window').width - 16 * 2 - 12 * 2) / 3,
    height: 90,
    borderRadius: 12,
    backgroundColor: theme.colors.border,
  },
  emptyPhotos: {
    color: theme.colors.textLight,
  },
  viewerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  viewerImage: {
    width: '90%',
    height: '70%',
  },
  viewerClose: {
    position: 'absolute',
    top: 40,
    right: 24,
  },
});

export default RecordDetailScreen; 