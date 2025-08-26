import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Badge from '../component/Badge';
import LoadingOverlay from '../component/LoadingOverlay';
import { LinearGradient } from 'react-native-linear-gradient';
interface DashboardScreenProps {
  navigation: any;
}

// Mockup data based on the 4-stage process
const mockFarmerData = {
  rice: {
    area: 1.8, // hectare
    awdCycle: "7 ngày ngập, 3 ngày khô",
    strawManagement: "Incorporated into soil"
  },
  agroforestry: {
    area: 0.7, // hectare
    treeDensity: 150, // cây/hectare
    species: ["Coconut", "Mango"]
  },
  aiResults: {
    avgAuthenticity: 92,
    avgHealth: 85,
    practiceMatch: 88
  }
};

// Calculate scores based on the formula
const calculateScores = () => {
  // Carbon Performance calculation
  const riceScore = mockFarmerData.rice.area * 0.85 * 1.1; // 1.683 tCO2
  const agroScore = mockFarmerData.agroforestry.area * mockFarmerData.agroforestry.treeDensity * 1.1 * 0.02; // 2.31 tCO2
  const CP = (riceScore * 0.6) + (agroScore * 0.4); // 1.934 tCO2

  // Convert to 100-point scale
  const CPScore = Math.round((CP / 3.0) * 100); // 65

  // MRV Reliability calculation
  const aiConf = (mockFarmerData.aiResults.avgAuthenticity * 0.5) +
    (mockFarmerData.aiResults.avgHealth * 0.3) +
    (mockFarmerData.aiResults.practiceMatch * 0.2); // 88.1
  const verHistory = 85; // based on history
  const docQuality = 82; // document quality
  const consistency = 78; // consistency

  const MR = Math.round((aiConf * 0.4) + (verHistory * 0.3) + (docQuality * 0.2) + (consistency * 0.1)); // 85

  // Final score
  const finalScore = Math.round((CPScore * 0.7) + (MR * 0.3)); // 71

  return { CP: CPScore, MR, finalScore };
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [selectedPlot, setSelectedPlot] = useState(1);
  const [loading, setLoading] = useState(false);

  const scores = calculateScores();

  const handleCreateRecord = () => {
    navigation.navigate('CreateRecord', { recordId: '1' });
  };

  const handlePlotSelect = (plotId: number) => {
    setSelectedPlot(plotId);
  };

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading dashboard..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={[theme.colors.primary + '15', theme.colors.white]}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.recordsHeaderRow}>
            <View style={styles.recordsHeaderLeft}>
              <Text style={styles.recordsTitle}>AgriMRV Dashboard</Text>
              <Text style={styles.recordsSubtitle}>Proof of Practice, Proof of Carbon</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleCreateRecord}>
              <Icon name="plus" size={18} color={theme.colors.white} />
              <Text style={styles.addButtonText}>Add Plot</Text>
            </TouchableOpacity>
          </View>

          {/* MRV Process Overview */}
          <View style={styles.processSection}>
            <Text style={styles.sectionTitle}>MRV Process Overview</Text>
            <View style={styles.processGrid}>
              <View style={styles.processCard}>
                <View style={styles.processIcon}>
                  <Icon name="account-plus" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.processTitle}>Stage 1</Text>
                <Text style={styles.processSubtitle}>Registration & MRV Declaration</Text>
              </View>

              <View style={styles.processCard}>
                <View style={styles.processIcon}>
                  <Icon name="camera" size={24} color={theme.colors.info} />
                </View>
                <Text style={styles.processTitle}>Stage 2</Text>
                <Text style={styles.processSubtitle}>Evidence Collection</Text>
              </View>

              <View style={styles.processCard}>
                <View style={styles.processIcon}>
                  <Icon name="shield-check" size={24} color={theme.colors.warning} />
                </View>
                <Text style={styles.processTitle}>Stage 3</Text>
                <Text style={styles.processSubtitle}>Verification & Scoring</Text>
              </View>

              <View style={styles.processCard}>
                <View style={styles.processIcon}>
                  <Icon name="currency-usd" size={24} color={theme.colors.info} />
                </View>
                <Text style={styles.processTitle}>Stage 4</Text>
                <Text style={styles.processSubtitle}>Carbon Credits & Trading</Text>
              </View>
            </View>
          </View>


          {/* Land Plots */}
          <View style={styles.plotsSection}>
            <View style={styles.sectionHeaderContainer}>
              <View>
                <Text style={styles.sectionTitle}>Land Plots</Text>
              </View>
              <View style={styles.plotCountBadge}>
                <Text style={styles.plotCountText}>2 plots</Text>
              </View>
            </View>

            <View style={styles.plotsList}>
              {/* Main Plot */}
              <TouchableOpacity
                style={styles.plotCard}
                onPress={() => navigation.navigate('RecordDetail', { recordId: 'main-plot-1' })}
              >
                <View style={styles.plotCardContent}>
                  <View style={styles.plotInfo}>
                    <Text style={styles.plotTitle}>Main Plot - An Giang</Text>
                    <Text style={styles.plotDetails}>{mockFarmerData.rice.area + mockFarmerData.agroforestry.area} ha • Rice + Agroforestry</Text>
                    <View style={styles.plotMetrics}>
                      <View style={styles.metricItem}>
                        <Icon name="ruler" size={14} color={theme.colors.textLight} />
                        <Text style={styles.metricText}>{mockFarmerData.rice.area} ha/rice</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Icon name="tree" size={14} color={theme.colors.textLight} />
                        <Text style={styles.metricText}>{mockFarmerData.agroforestry.area} ha/trees</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Icon name="water" size={14} color={theme.colors.textLight} />
                        <Text style={styles.metricText}>AWD</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.plotStatus}>
                    <Badge text="Verified" variant="success" size="small" />
                    <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Secondary Plot */}
              <TouchableOpacity
                style={styles.plotCard}
                onPress={() => navigation.navigate('RecordDetail', { recordId: 'secondary-plot-2' })}
              >
                <View style={styles.plotCardContent}>
                  <View style={styles.plotInfo}>
                    <Text style={styles.plotTitle}>Secondary Plot - Dong Thap</Text>
                    <Text style={styles.plotDetails}>2.0 ha • Certified AWD Practice</Text>
                    <View style={styles.plotMetrics}>
                      <View style={styles.metricItem}>
                        <Icon name="ruler" size={14} color={theme.colors.textLight} />
                        <Text style={styles.metricText}>2.0 ha</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Icon name="water" size={14} color={theme.colors.textLight} />
                        <Text style={styles.metricText}>AWD</Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Icon name="calendar" size={14} color={theme.colors.textLight} />
                        <Text style={styles.metricText}>2024</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.plotStatus}>
                    <Badge text="Pending" variant="warning" size="small" />
                    <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
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
  viewAllText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginRight: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: 4,
  },
  gradient: {
    flex: 1,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  scrollContent: {
    marginTop: theme.spacing.xxl,
    padding: theme.spacing.lg,
  },
  recordsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  recordsHeaderLeft: {
    flex: 1,
  },
  recordsTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
  },
  recordsSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 6,
  },
  addButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.medium,
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    minHeight: 88,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  miniStatInner: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    // height: '100%',
  },
  miniIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniStatText: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  miniStatValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 22,
    textAlign: 'center',
  },
  miniStatLabel: {
    marginTop: 6,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  recordsList: {
    gap: theme.spacing.md,
  },
  recordCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  recordLeftIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.secondary + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  recordHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  recordTitle: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  recordMeta: {
    color: theme.colors.text,
  },
  recordSubmeta: {
    marginTop: 2,
    color: theme.colors.textLight,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
  },
  recentBatchesSection: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  plotsSection: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  plotCountBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  plotCountText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  plotsList: {
    gap: theme.spacing.md,
  },
  plotCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedPlotCard: {
    borderColor: theme.colors.info,
    borderWidth: 2,
    backgroundColor: theme.colors.info + '10',
  },
  plotCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  plotInfo: {
    flex: 1,
  },
  plotTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  plotDetails: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  plotStatus: {
    alignItems: 'flex-end',
  },
  statusButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  verifiedStatus: {
    backgroundColor: theme.colors.info,
  },
  pendingStatus: {
    backgroundColor: theme.colors.warning,
  },
  statusButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  plotScore: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  plotDetailsSection: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  plotDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plotDetailsContent: {
    gap: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  detailLabelText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.medium,
  },
  satelliteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
  },
  satelliteButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.medium,
  },
  detailCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  detailCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  detailCardTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  },
  detailCardValue: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.sm,
  },
  copyButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  areaBreakdown: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  areaItem: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.secondary + '20',
    borderRadius: theme.borderRadius.sm,
  },
  areaLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  areaValue: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.success,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  sectionSubtitle: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
    marginTop: 2,
  },
  plotMetrics: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metricText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreProgress: {
    width: 60,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginTop: theme.spacing.xs,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    backgroundColor: theme.colors.warning,
    borderRadius: 2,
  },
  processSection: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  processGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  processCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  processIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  processTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  processSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  processStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  processStatusText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.success,
    fontFamily: theme.typography.fontFamily.medium,
  },
  scoresSection: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  scoresGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scoreLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  scoreValue: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  scoreUnit: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  scoreBreakdown: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  breakdownText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});

export default DashboardScreen; 