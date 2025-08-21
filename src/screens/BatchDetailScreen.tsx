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

interface BatchDetailScreenProps {
  navigation: any;
  route: {
    params: {
      batchId: string;
    };
  };
}

interface BatchDetailsResponse {
  data: {
    id: string;
    product_name: string;
    category: string;
    weight: number;
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


const BatchDetailScreen: React.FC<BatchDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(false);
  const { batchId } = route.params;
  const [batch, setBatch] = useState<BatchDetailsResponse['data'] | null>(null);
  const convertDateToISOString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  useEffect(() => {
    const fetchBatch = async () => {
      setLoading(true);
      try {
        const response = await api.get<BatchDetailsResponse>(`/batches/details/${batchId}`);
        setBatch(response.data.data);
      } catch (error: any) {
        console.error('Error fetching batch details:', error.response);
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, [batchId]);

  console.log(batchId);
  console.log(batch);

  const handleGenerateQR = () => {
    navigation.navigate('QRGenerate', { batch: batch });
  };

  const handleEditBatch = () => {
    // TODO: Implement edit functionality
    console.log('Edit batch:', batchId);
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
        <Header
          title="Batch Details"
          onBack={() => navigation.goBack()}
        />
        <LoadingOverlay visible={loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Batch Details"
        onBack={() => navigation.goBack()}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.productName}>{batch.product_name}</Text>
              <View style={styles.categoryContainer}>
                <Icon name="tag-outline" size={16} color={theme.colors.textLight} />
                <Text style={styles.category}>{batch.category}</Text>
              </View>
            </View>
            <Badge
              text={batch.status.toUpperCase()}
              variant={batch.status === 'active' ? 'success' : 'error'}
            />
          </View>
          <View style={styles.batchInfoContainer}>
            <Text style={styles.batchCode}>Batch Code: {batch.traceability.batch_code}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statsCard, styles.elevation]}>
            <Icon name="qrcode-scan" size={24} color={theme.colors.primary} />
            <Text style={styles.statsValue}>{batch.stats.total_scans}</Text>
            <Text style={styles.statsLabel}>Total Scans</Text>
          </View>
          <View style={[styles.statsCard, styles.elevation]}>
            <Icon name="account-group" size={24} color={theme.colors.secondary} />
            <Text style={styles.statsValue}>{batch.stats.unique_customers}</Text>
            <Text style={styles.statsLabel}>Customers</Text>
          </View>
          <View style={[styles.statsCard, styles.elevation]}>
            <Icon name="star" size={24} color={theme.colors.warning} />
            <Text style={styles.statsValue}>{batch.stats.average_rating}</Text>
            <Text style={styles.statsLabel}>Rating</Text>
          </View>
        </View>

        {/* Traceability Information */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="timeline-text" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Traceability Information</Text>
          </View>
          <View style={styles.timelineContainer}>
            {renderCertificationItem(
              'calendar-check',
              'Packaging Date',
              convertDateToISOString(new Date(batch.traceability.packaging_date)),
              theme.colors.primary
            )}
            {renderCertificationItem(
              'calendar-clock',
              'Best Before',
              convertDateToISOString(new Date(batch.traceability.best_before)),
              theme.colors.warning
            )}
            {renderCertificationItem(
              'certificate',
              'VietGAP Certification',
              `${batch.certification.number} (Valid until ${batch.certification.validUntil})`,
              theme.colors.success
            )}
          </View>
        </View>

        {/* Product Information */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="information" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Product Information</Text>
          </View>
          <View style={styles.infoGrid}>
            {renderInfoItem('weight-kilogram', 'Weight', `${batch.weight} kg`, theme.colors.primary)}
            {renderInfoItem('leaf', 'Method', batch.cultivation_method, theme.colors.secondary)}
            {renderInfoItem('calendar-blank', 'Planted', convertDateToISOString(new Date(batch.planting_date)), theme.colors.accent)}
            {renderInfoItem('calendar-check', 'Harvested', convertDateToISOString(new Date(batch.harvest_date)), theme.colors.success)}
          </View>
        </View>

        {/* Sustainability Metrics */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="leaf-circle" size={24} color={theme.colors.success} />
            <Text style={styles.sectionTitle}>Sustainability Metrics</Text>
          </View>
          <View style={styles.sustainabilityGrid}>
            {renderCertificationItem(
              'water',
              'Water Usage',
              batch.sustainability.water_usage,
              theme.colors.primary
            )}
            {renderCertificationItem(
              'molecule-co2',
              'Carbon Footprint',
              batch.sustainability.carbon_footprint,
              theme.colors.secondary
            )}
            {renderCertificationItem(
              'flask',
              'Pesticide Usage',
              batch.sustainability.pesticide_usage,
              theme.colors.success
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

        {/* Reviews */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="comment-text" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Customer Reviews</Text>
          </View>
          <View style={styles.reviewsContainer}>
            {batch.reviews.map((review: BatchDetailsResponse['data']['reviews'][0]) => (
              <ReviewCard
                key={review.id}
                reviewer={review.reviewer}
                rating={review.rating}
                comment={review.comment}
                date={review.date}
              />
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <ButtonCustom
            title="Generate QR Code"
            onPress={handleGenerateQR}
            style={styles.actionButton}
          />
          <ButtonCustom
            title="Edit Batch"
            onPress={handleEditBatch}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
      <LoadingOverlay visible={loading} />
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
});

export default BatchDetailScreen; 