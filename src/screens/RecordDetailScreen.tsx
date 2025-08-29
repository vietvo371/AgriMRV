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
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import Badge from '../component/Badge';
import ReviewCard from '../component/ReviewCard';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import { dashboardApi } from '../utils/Api';
import { deriveRecordDetail } from '../utils/mockData';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import LinearGradient from 'react-native-linear-gradient';

type RecordDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'RecordDetail'>;

interface PlotDetailsResponse {
  data: {
    id: string;
    plot_name: string;
    location: string;
    status: 'verified' | 'pending' | 'processing';
    mrvData: {
      plotBoundaries: {
        coordinates: Array<{ lat: number, lng: number }>;
        verified: boolean;
        area: number;
      };
      ricePractices: {
        area: number;
        awdCycle: string;
        strawManagement: string;
        sowingDate: string;
      };
      agroforestrySystem: {
        area: number;
        treeDensity: number;
        species: string[];
        intercropping: string[];
      };
      evidencePhotos: Array<{
        id: number;
        type: string;
        url: string;
        uploadDate: string;
      }>;
      mrvScores: {
        carbonPerformance: number;
        mrvReliability: number;
        grade: string;
      };
      blockchainAnchor: {
        hash: string;
        timestamp: string;
        reportUrl: string;
      };
    };
    farmer: {
      name: string;
      phone: string;
      email: string;
      cooperative: string;
      avatar: string;
    };
  };
  message: string;
}


const RecordDetailScreen: React.FC<RecordDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(false);
  const { recordId } = route.params;
  const [plot, setPlot] = useState<PlotDetailsResponse['data'] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const convertDateToISOString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getLandPlotDetail(recordId);
        if (!mounted) return;

        // Map backend response to UI structure expected by this screen
        const mapped: PlotDetailsResponse['data'] = {
          id: String(data?.id ?? recordId),
          plot_name: data?.plot_name || data?.name || `Plot #${recordId}`,
          location: data?.location || data?.address || 'Unknown',
          status: (data?.status || 'pending'),
          mrvData: data?.mrvData ? data.mrvData : {
            plotBoundaries: {
              coordinates: Array.isArray(data?.coordinates) ? data.coordinates : [
                { lat: Number(data?.gps_latitude || 0) || 0, lng: Number(data?.gps_longitude || 0) || 0 }
              ],
              verified: Boolean(data?.plot_verified ?? false),
              area: Number(
                data?.area_hectares ?? data?.total_area ?? 0
              ) || 0,
            },
            ricePractices: {
              area: Number(data?.rice_area ?? 0) || 0,
              awdCycle: data?.awdCycle || data?.awd_cycles_per_season || data?.water_management_method || 'AWD',
              strawManagement: data?.straw_management || 'Unknown',
              sowingDate: data?.rice_sowing_date || data?.sowingDate || '',
            },
            agroforestrySystem: {
              area: Number(data?.agroforestry_area ?? 0) || 0,
              treeDensity: Number(data?.tree_density_per_hectare ?? data?.treeDensity ?? 0) || 0,
              species: Array.isArray(data?.tree_species) ? data.tree_species : (Array.isArray(data?.species) ? data.species : []),
              intercropping: Array.isArray(data?.intercrop_species) ? data.intercrop_species : (Array.isArray(data?.intercropping) ? data.intercropping : []),
            },
            evidencePhotos: Array.isArray(data?.evidencePhotos)
              ? data.evidencePhotos
              : Array.isArray(data?.evidence_files)
                ? data.evidence_files.map((f: any, idx: number) => ({
                  id: f.id ?? idx,
                  type: f.file_type || 'photo',
                  url: f.file_url || '',
                  uploadDate: f.capture_timestamp || '',
                }))
                : [],
            mrvScores: data?.mrvScores || {
              carbonPerformance: Number(data?.carbon_performance_score ?? 0) || 0,
              mrvReliability: Number(data?.mrv_reliability_score ?? 0) || 0,
              grade: data?.grade || 'N/A',
            },
            blockchainAnchor: data?.blockchainAnchor || {
              hash: data?.transaction_hash || '',
              timestamp: data?.anchor_timestamp || '',
              reportUrl: data?.verification_url || '',
            },
          },
          farmer: data?.farmer || {
            name: data?.farmer_name || data?.user_full_name || 'Unknown',
            phone: data?.farmer_phone || data?.user_phone || '',
            email: data?.farmer_email || data?.user_email || '',
            cooperative: data?.cooperative_name || data?.organization_name || '',
          },
        };

        setPlot(mapped);
      } catch (e) {
        // fallback minimal state to avoid blank screen
        setPlot({
          id: String(recordId),
          plot_name: `Plot #${recordId}`,
          location: 'Unknown',
          status: 'pending',
          mrvData: {
            plotBoundaries: { coordinates: [{ lat: 0, lng: 0 }], verified: false, area: 0 },
            ricePractices: { area: 0, awdCycle: 'AWD', strawManagement: '', sowingDate: '' },
            agroforestrySystem: { area: 0, treeDensity: 0, species: [], intercropping: [] },
            evidencePhotos: [],
            mrvScores: { carbonPerformance: 0, mrvReliability: 0, grade: 'N/A' },
            blockchainAnchor: { hash: '', timestamp: '', reportUrl: '' },
          },
          farmer: { name: 'Unknown', phone: '', email: '', cooperative: '', avatar: '' },
        });
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [recordId]);

  console.log(recordId);
  console.log(plot);

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

  if (!plot) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Plot Details" onBack={() => navigation.goBack()} />
        <LoadingOverlay visible={loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Record Details" onBack={() => navigation.goBack()} />
      <LinearGradient colors={[theme.colors.secondary + '30', theme.colors.white]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerCard}>
            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.productName}>{plot.plot_name}</Text>
                <View style={styles.categoryContainer}>
                  <Icon name="map-marker" size={16} color={theme.colors.textLight} />
                  <Text style={styles.category}>{plot.location}</Text>
                </View>
              </View>
              <Badge text={plot.status?.toUpperCase() || 'PENDING'} variant={plot.status === 'verified' ? 'success' : 'warning'} />
            </View>
          </View>

          {/* MRV Verification Banner */}
          {plot.status === 'verified' && (
            <View style={[styles.verificationBanner, styles.elevation]}>
              <View style={styles.verificationRow}>
                <Icon name="shield-check" size={22} color={theme.colors.success} />
                <Text style={styles.verificationTitle}>MRV Verification Complete</Text>
              </View>
              <Text style={styles.verificationText}>
                This plot has been verified by our AI system and contributes to your carbon credit score.
              </Text>
            </View>
          )}
  {/* MRV Calculation Results */}
  <View style={[styles.section, styles.elevation]}>
            <View style={styles.sectionHeader}>
              <Icon name="file-document" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>MRV Calculation Results</Text>
            </View>

            {/* Total Carbon Impact & Carbon Badge */}
            <View style={styles.carbonOverview}>
              <View style={styles.carbonImpact}>
                <Text style={styles.carbonImpactLabel}>Total Carbon Impact</Text>
                <Text style={styles.carbonImpactValue}>{plot.mrvData.mrvScores.carbonPerformance} tCO₂e</Text>
                <Text style={styles.carbonImpactUnit}>per season</Text>
              </View>
              <View style={styles.carbonBadge}>
                <Text style={styles.carbonBadgeLabel}>Carbon Badge</Text>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>Grade A</Text>
                </View>
              </View>
            </View>

            {/* Carbon Performance (CP) */}
            <View style={styles.performanceSection}>
              <View style={styles.performanceHeader}>
                <Text style={styles.performanceLabel}>Carbon Performance (CP)</Text>
                <Text style={styles.performanceScore}>{plot.mrvData.mrvScores.carbonPerformance}/100</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '78.8%', backgroundColor: theme.colors.primary }]} />
              </View>
              <View style={styles.performanceBreakdown}>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownText}>Rice AWD: {plot.mrvData.mrvScores.carbonPerformance}/100 → {plot.mrvData.mrvScores.carbonPerformance} tCO₂e</Text>
                </View>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownText}>Agroforestry: {plot.mrvData.mrvScores.carbonPerformance}/100 → {plot.mrvData.mrvScores.carbonPerformance} tCO₂e</Text>
                </View>
              </View>
            </View>

            {/* MRV Reliability (MR) */}
            <View style={styles.reliabilitySection}>
              <View style={styles.reliabilityHeader}>
                <Text style={styles.reliabilityLabel}>MRV Reliability (MR)</Text>
                <Text style={styles.reliabilityScore}>{plot.mrvData.mrvScores.mrvReliability}/100</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '75.0%', backgroundColor: theme.colors.warning }]} />
              </View>
              <View style={styles.reliabilityBreakdown}>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownText}>Rice evidence: {plot.mrvData.mrvScores.mrvReliability}/100 (photos + GPS + diary)</Text>
                </View>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownText}>Agroforestry evidence: {plot.mrvData.mrvScores.mrvReliability}/100 (tree coverage)</Text>
                </View>
              </View>
            </View>

            {/* Blockchain Anchor & View MRV Report */}
            <View style={styles.blockchainSection}>
              <View style={styles.blockchainHeader}>
                <Text style={styles.blockchainHeaderLabel}># Blockchain Anchor</Text>
              </View>
              <Text style={styles.blockchainHash}>{plot.mrvData.blockchainAnchor.hash || 'N/A'}</Text>
              <TouchableOpacity style={styles.mrvReportButton} onPress={() => Linking.openURL(plot.mrvData.blockchainAnchor.reportUrl)}>
                <Icon name="earth" size={16} color={theme.colors.white} />
                <Text style={styles.mrvReportButtonText}>View MRV Report</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Plot Information */}
          <View style={[styles.section, styles.elevation]}>
            <View style={styles.sectionHeader}>
              <Icon name="information" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Plot Information</Text>
            </View>

            {/* Area Overview */}
            <View style={styles.areaOverview}>
              <View style={styles.areaCard}>
                <Icon name="ruler-square" size={24} color={theme.colors.primary} />
                <Text style={styles.areaValue}>{plot.mrvData.plotBoundaries.area} ha</Text>
                <Text style={styles.areaLabel}>Total Area</Text>
              </View>
              <View style={styles.areaCard}>
                <Icon name="rice" size={24} color={theme.colors.secondary} />
                <Text style={styles.areaValue}>{plot.mrvData.ricePractices.area} ha</Text>
                <Text style={styles.areaLabel}>Rice Area</Text>
              </View>
              <View style={styles.areaCard}>
                <Icon name="tree" size={24} color={theme.colors.success} />
                <Text style={styles.areaValue}>{plot.mrvData.agroforestrySystem.area} ha</Text>
                <Text style={styles.areaLabel}>Agroforestry</Text>
              </View>
            </View>

            {/* Practice Details */}
            <View style={styles.practiceDetails}>
              <View style={styles.practiceRow}>
                <View style={styles.practiceIcon}>
                  <Icon name="water" size={20} color={theme.colors.info} />
                </View>
                <View style={styles.practiceContent}>
                  <Text style={styles.practiceLabel}>AWD Cycle</Text>
                  <Text style={styles.practiceValue}>{plot.mrvData.ricePractices.awdCycle}</Text>
                </View>
              </View>

              <View style={styles.practiceRow}>
                <View style={styles.practiceIcon}>
                  <Icon name="leaf" size={20} color={theme.colors.warning} />
                </View>
                <View style={styles.practiceContent}>
                  <Text style={styles.practiceLabel}>Straw Management</Text>
                  <Text style={styles.practiceValue}>{plot.mrvData.ricePractices.strawManagement}</Text>
                </View>
              </View>

              <View style={styles.practiceRow}>
                <View style={styles.practiceIcon}>
                  <Icon name="calendar-blank" size={20} color={theme.colors.accent} />
                </View>
                <View style={styles.practiceContent}>
                  <Text style={styles.practiceLabel}>Sowing Date</Text>
                  <Text style={styles.practiceValue}>{plot.mrvData.ricePractices.sowingDate}</Text>
                </View>
              </View>
            </View>

            {/* Agroforestry Details */}
            {plot.mrvData.agroforestrySystem.area > 0 && (
              <View style={styles.agroforestrySection}>
                <Text style={styles.subsectionTitle}>Agroforestry Details</Text>
                <View style={styles.agroforestryGrid}>
                  <View style={styles.agroforestryItem}>
                    <Icon name="tree" size={16} color={theme.colors.success} />
                    <Text style={styles.agroforestryLabel}>Tree Density</Text>
                    <Text style={styles.agroforestryValue}>{plot.mrvData.agroforestrySystem.treeDensity} trees/ha</Text>
                  </View>
                  <View style={styles.agroforestryItem}>
                    <Icon name="sprout" size={16} color={theme.colors.warning} />
                    <Text style={styles.agroforestryLabel}>Species</Text>
                    <Text style={styles.agroforestryValue}>{plot.mrvData.agroforestrySystem.species.join(', ')}</Text>
                  </View>
                  <View style={styles.agroforestryItem}>
                    <Icon name="flower" size={16} color={theme.colors.accent} />
                    <Text style={styles.agroforestryLabel}>Intercropping</Text>
                    <Text style={styles.agroforestryValue}>{plot.mrvData.agroforestrySystem.intercropping.join(', ')}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>


          {/* Farm Location */}
          {/* MRV Evidence Photos */}
          <View style={[styles.section, styles.elevation]}>
            <View style={styles.sectionHeader}>
              <Icon name="image-multiple" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>MRV Evidence Photos</Text>
            </View>
            <View style={styles.photoGrid}>
              {plot.mrvData.evidencePhotos
                .filter((photo): photo is typeof photo & { url: string } => !!photo.url)
                .map((photo, idx) => (
                  <TouchableOpacity key={photo.id} activeOpacity={0.85} onPress={() => setSelectedImage(photo.url)}>
                    <Image source={{ uri: photo.url }} style={styles.photoThumb} />
                  </TouchableOpacity>
                ))}
              {plot.mrvData.evidencePhotos.length === 0 && (
                <Text style={styles.emptyPhotos}>No MRV evidence photos available</Text>
              )}
            </View>
          </View>

          {/* Plot Location */}
          <View style={[styles.section, styles.elevation]}>
            <View style={styles.sectionHeader}>
              <Icon name="map-marker" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Plot Location</Text>
            </View>
            <View style={styles.mapContainer}>
              <View style={styles.addressContainer}>
                <Icon name="home-variant" size={20} color={theme.colors.primary} />
                <Text style={styles.address}>{plot.location}</Text>
              </View>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: plot.mrvData.plotBoundaries.coordinates[0].lat,
                  longitude: plot.mrvData.plotBoundaries.coordinates[0].lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                <Marker
                  coordinate={{
                    latitude: plot.mrvData.plotBoundaries.coordinates[0].lat,
                    longitude: plot.mrvData.plotBoundaries.coordinates[0].lng,
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
                source={{ uri: plot.farmer.avatar }}
                style={styles.farmerImage}
              />
              <View style={styles.farmerDetails}>
                <Text style={styles.farmerName}>{plot.farmer.name}</Text>
                <View style={styles.contactItem}>
                  <Icon name="phone" size={16} color={theme.colors.primary} />
                  <Text style={styles.farmerContact}>{plot.farmer.phone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Icon name="email" size={16} color={theme.colors.primary} />
                  <Text style={styles.farmerContact}>{plot.farmer.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Icon name="account-group" size={16} color={theme.colors.primary} />
                  <Text style={styles.farmerContact}>{plot.farmer.cooperative}</Text>
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
      </LinearGradient>
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
  scoresGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scoreLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  scoreUnit: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  verificationGrid: {
    gap: 16,
    marginTop: 16,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  verificationLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  blockchainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  blockchainText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },
  blockchainInfo: {
    gap: 16,
    marginTop: 16,
  },
  blockchainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  blockchainLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary + '10',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  reportButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  areaOverview: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  areaCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  areaValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  areaLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  practiceDetails: {
    gap: 16,
    marginBottom: 20,
  },
  practiceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  practiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  practiceContent: {
    flex: 1,
  },
  practiceLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
  practiceValue: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    lineHeight: 22,
  },
  agroforestrySection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  agroforestryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  agroforestryItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  agroforestryLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 6,
    marginBottom: 4,
    textAlign: 'center',
  },
  agroforestryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  carbonOverview: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  carbonImpact: {
    flex: 1,
  },
  carbonImpactLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 8,
  },
  carbonImpactValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  carbonImpactUnit: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  carbonBadge: {
    alignItems: 'center',
  },
  carbonBadgeLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 8,
  },
  badgeContainer: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  performanceSection: {
    marginBottom: 24,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  performanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  performanceScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  performanceBreakdown: {
    gap: 8,
  },
  breakdownItem: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  breakdownText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  reliabilitySection: {
    marginBottom: 24,
  },
  reliabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reliabilityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  reliabilityScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.warning,
  },
  reliabilityBreakdown: {
    gap: 8,
  },
  blockchainSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  blockchainHeader: {
    marginBottom: 12,
  },
  blockchainHeaderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  blockchainHash: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: theme.colors.textLight,
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mrvReportButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  mrvReportButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
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