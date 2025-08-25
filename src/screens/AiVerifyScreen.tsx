import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  Platform, 
  TextInput,
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Badge from '../component/Badge';
import Card from '../component/Card';
import LoadingOverlay from '../component/LoadingOverlay';
import { mockAiResults, mockFarmProfiles, mockImages, mockUsers } from '../utils/mockData';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface AIAnalysis {
  id: string;
  cropType: string;
  imageUrl: string;
  confidence: number;
  status: 'processing' | 'verified' | 'needs_review' | 'rejected';
  analysisDate: string;
  location: string;
  findings: { cropHealth: number; authenticity: number; maturity: number; quality: number };
  insights: string[];
  recommendations: string[];
  creditImpact: number;
}

const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = theme.colors.primary }) => (
  <View style={styles.progressTrack}>
    <LinearGradient
      colors={[color, color + '80']}
      style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, value))}%` }]}
    />
  </View>
);

const statusToVariant = (status: AIAnalysis['status']) => {
  switch (status) {
    case 'verified':
      return 'success' as const;
    case 'processing':
      return 'info' as const;
    case 'needs_review':
      return 'warning' as const;
    case 'rejected':
      return 'error' as const;
    default:
      return 'default' as const;
  }
};

const getStatusColor = (status: AIAnalysis['status']) => {
  switch (status) {
    case 'verified':
      return theme.colors.success;
    case 'processing':
      return theme.colors.info;
    case 'needs_review':
      return theme.colors.warning;
    case 'rejected':
      return theme.colors.error;
    default:
      return theme.colors.textLight;
  }
};

const getStatusIcon = (status: AIAnalysis['status']) => {
  switch (status) {
    case 'verified':
      return 'check-circle';
    case 'processing':
      return 'clock-outline';
    case 'needs_review':
      return 'alert-circle';
    case 'rejected':
      return 'close-circle';
    default:
      return 'help-circle';
  }
};

const AiVerifyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AIAnalysis['status']>('all');

  const analyses: AIAnalysis[] = React.useMemo(() => {
    return mockAiResults.map((a) => {
      const profile = mockFarmProfiles.find((p) => p.profile_id === a.profile_id)!;
      const user = mockUsers.find((u) => u.user_id === profile.user_id)!;
      const image = mockImages.find((img) => img.profile_id === profile.profile_id);
      return {
        id: String(a.profile_id),
        cropType: profile.crop_type,
        imageUrl: image?.image_url || '',
        confidence: a.credit_score || a.image_score,
        status: a.yield_risk < 30 ? 'verified' : a.yield_risk < 60 ? 'needs_review' : 'processing',
        analysisDate: a.processed_at,
        location: user.org_name,
        findings: {
          cropHealth: Math.min(100, Math.round(a.image_score)),
          authenticity: Math.min(100, Math.round(80 + a.image_score / 5)),
          maturity: Math.min(100, Math.round(70 + a.credit_score / 4)),
          quality: Math.min(100, Math.round(75 + a.credit_score / 5)),
        },
        insights: [
          'AI detected strong crop health signals',
          'No signs of pest damage in images',
          'Harvest timing appears optimal',
        ],
        recommendations: [
          'Maintain current irrigation schedule',
          'Consider premium market channels',
        ],
        creditImpact: Math.max(5, Math.round(a.credit_score / 6)),
      } as AIAnalysis;
    });
  }, []);

  if (loading) return <LoadingOverlay visible={true} message="Loading AI verification..." />;

  const verified = analyses.filter(a => a.status === 'verified').length;
  const needsReview = analyses.filter(a => a.status === 'needs_review').length;
  const processing = analyses.filter(a => a.status === 'processing').length;
  const avgConfidence = Math.round(analyses.reduce((s, a) => s + a.confidence, 0) / Math.max(1, analyses.length));
  
  const filtered = analyses.filter(a => {
    const matchStatus = statusFilter === 'all' ? true : a.status === statusFilter;
    const matchQuery = query ? (
      a.cropType.toLowerCase().includes(query.toLowerCase()) ||
      a.location.toLowerCase().includes(query.toLowerCase())
    ) : true;
    return matchStatus && matchQuery;
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary + '08', theme.colors.white]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Stats Overview */}
          <Animated.View entering={FadeInDown.duration(500).springify()}>
            <Card style={[styles.overviewCard, styles.elevation]}>
              <View style={styles.overviewHeader}>
                <View style={styles.overviewTitleSection}>
                  <View style={styles.overviewIconContainer}>
                    <LinearGradient
                      colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
                      style={styles.overviewIcon}
                    >
                      <Icon name="robot" size={28} color={theme.colors.primary} />
                    </LinearGradient>
                  </View>
                  <View style={styles.overviewInfo}>
                    <Text style={styles.overviewTitle}>Analysis Overview</Text>
                    <Text style={styles.overviewSubtitle}>AI-powered crop verification results</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.refreshButton}>
                  <Icon name="refresh" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={[theme.colors.success + '15', theme.colors.success + '05']}
                    style={styles.statIconBg}
                  >
                    <Icon name="check-circle" size={24} color={theme.colors.success} />
                  </LinearGradient>
                  <Text style={styles.statValue}>{verified}</Text>
                  <Text style={styles.statLabel}>Verified</Text>
                </View>

                <View style={styles.statCard}>
                  <LinearGradient
                    colors={[theme.colors.warning + '15', theme.colors.warning + '05']}
                    style={styles.statIconBg}
                  >
                    <Icon name="alert-circle" size={24} color={theme.colors.warning} />
                  </LinearGradient>
                  <Text style={styles.statValue}>{needsReview}</Text>
                  <Text style={styles.statLabel}>Needs Review</Text>
                </View>

                <View style={styles.statCard}>
                  <LinearGradient
                    colors={[theme.colors.info + '15', theme.colors.info + '05']}
                    style={styles.statIconBg}
                  >
                    <Icon name="clock-outline" size={24} color={theme.colors.info} />
                  </LinearGradient>
                  <Text style={styles.statValue}>{processing}</Text>
                  <Text style={styles.statLabel}>Processing</Text>
                </View>
              </View>

              <View style={styles.confidenceSection}>
                <View style={styles.confidenceHeader}>
                  <Text style={styles.confidenceLabel}>Average Confidence</Text>
                  <Text style={styles.confidenceValue}>{avgConfidence}%</Text>
                </View>
                <ProgressBar 
                  value={avgConfidence} 
                  color={avgConfidence >= 85 ? theme.colors.success : avgConfidence >= 70 ? theme.colors.warning : theme.colors.error}
                />
              </View>
            </Card>
          </Animated.View>

          {/* Enhanced Search and Filters */}
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <View style={styles.searchSection}>
              <View style={styles.searchContainer}>
                <Icon name="magnify" size={20} color={theme.colors.textLight} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search crop type or location..."
                  placeholderTextColor={theme.colors.textLight}
                  value={query}
                  onChangeText={setQuery}
                />
                {query.length > 0 && (
                  <TouchableOpacity onPress={() => setQuery('')}>
                    <Icon name="close-circle" size={20} color={theme.colors.textLight} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Enhanced Analysis List */}
          <Animated.View entering={FadeInRight.duration(300).springify()}>
            <View style={styles.listSection}>
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Analysis Results</Text>
                <Text style={styles.listSubtitle}>{filtered.length} items found</Text>
              </View>

              <View style={styles.analysisList}>
                {filtered.map((analysis, index) => (
                  <Animated.View 
                    key={analysis.id}
                    entering={FadeInDown.duration(300).delay(index * 100).springify()}
                  >
                    <Card style={[styles.analysisCard, styles.elevation]}>
                      <TouchableOpacity 
                        style={styles.analysisContent}
                        onPress={() => navigation.navigate('AiAnalysisDetail', { analysisId: analysis.id })}
                        activeOpacity={0.7}
                      >
                        {/* Header Row */}
                        <View style={styles.analysisHeader}>
                          <View style={styles.analysisLeft}>
                            <View style={styles.analysisImageContainer}>
                              {analysis.imageUrl ? (
                                <Image source={{ uri: analysis.imageUrl }} style={styles.analysisImage} />
                              ) : (
                                <View style={styles.placeholderImage}>
                                  <Icon name="image-outline" size={20} color={theme.colors.textLight} />
                                </View>
                              )}
                              <View style={[
                                styles.statusIndicator,
                                { backgroundColor: getStatusColor(analysis.status) }
                              ]}>
                                <Icon 
                                  name={getStatusIcon(analysis.status)} 
                                  size={10} 
                                  color={theme.colors.white} 
                                />
                              </View>
                            </View>

                            <View style={styles.analysisBasicInfo}>
                              <Text style={styles.cropType} numberOfLines={1} ellipsizeMode="tail">
                                {analysis.cropType}
                              </Text>
                              <View style={styles.locationRow}>
                                <Icon name="map-marker" size={12} color={theme.colors.textLight} />
                                <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                                  {analysis.location}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View style={styles.analysisRight}>
                            <View style={[
                              styles.statusBadge,
                              { backgroundColor: getStatusColor(analysis.status) + '15' }
                            ]}>
                              <Text style={[
                                styles.statusText,
                                { color: getStatusColor(analysis.status) }
                              ]}>
                                {analysis.status.replace('_', ' ').toUpperCase()}
                              </Text>
                            </View>
                            <Icon name="chevron-right" size={16} color={theme.colors.textLight} />
                          </View>
                        </View>

                        {/* Confidence Row */}
                        <View style={styles.confidenceRow}>
                          <View style={styles.confidenceSection}>
                            <Text style={styles.confidenceLabel}>Confidence</Text>
                            <View style={styles.confidenceDisplay}>
                              <Text style={styles.confidencePercent}>{analysis.confidence}%</Text>
                              <View style={styles.confidenceBarContainer}>
                                <ProgressBar 
                                  value={analysis.confidence}
                                  color={
                                    analysis.confidence >= 85 ? theme.colors.success : 
                                    analysis.confidence >= 70 ? theme.colors.warning : theme.colors.error
                                  }
                                />
                              </View>
                            </View>
                          </View>
                        </View>

                        {/* Metrics Row */}
                        <View style={styles.metricsRow}>
                          <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Health</Text>
                            <Text style={styles.metricValue}>{analysis.findings.cropHealth}%</Text>
                          </View>
                          <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Quality</Text>
                            <Text style={styles.metricValue}>{analysis.findings.quality}%</Text>
                          </View>
                          <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Maturity</Text>
                            <Text style={styles.metricValue}>{analysis.findings.maturity}%</Text>
                          </View>
                          <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Auth</Text>
                            <Text style={styles.metricValue}>{analysis.findings.authenticity}%</Text>
                          </View>
                        </View>

                        {/* Footer Row */}
                        <View style={styles.analysisFooter}>
                          <View style={styles.impactInfo}>
                            <Icon name="trending-up" size={12} color={theme.colors.primary} />
                            <Text style={styles.impactText}>
                              Impact: <Text style={styles.impactValue}>+{analysis.creditImpact} pts</Text>
                            </Text>
                          </View>
                          <Text style={styles.analysisDate}>
                            {new Date(analysis.analysisDate).toLocaleDateString()}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Card>
                  </Animated.View>
                ))}
              </View>

              {filtered.length === 0 && (
                <Card style={styles.emptyCard}>
                  <View style={styles.emptyContent}>
                    <Icon name="robot-confused" size={48} color={theme.colors.textLight} />
                    <Text style={styles.emptyTitle}>No Results Found</Text>
                    <Text style={styles.emptyText}>
                      {query ? 'Try adjusting your search terms' : 'No analyses match the selected filter'}
                    </Text>
                  </View>
                </Card>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
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
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  elevation: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // Overview Card Styles
  overviewCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  overviewTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  overviewIconContainer: {},
  overviewIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  overviewInfo: {
    flex: 1,
  },
  overviewTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: 4,
  },
  overviewSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 100,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  confidenceSection: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: theme.spacing.md,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  confidenceLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
  },
  confidenceValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },

  // Search Styles
  searchSection: {
    marginBottom: theme.spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
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
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    paddingVertical: theme.spacing.sm,
  },

  // List Styles
  listSection: {},
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  listTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  listSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  analysisList: {
    gap: theme.spacing.md,
  },

  // Enhanced Analysis Card Styles
  analysisCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  analysisContent: {
    padding: theme.spacing.md,
  },

  // Header Row - Simplified
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  analysisLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  analysisImageContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  analysisImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: theme.colors.border,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  analysisBasicInfo: {
    flex: 1,
    minWidth: 0, // Important for text truncation
  },
  cropType: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    flex: 1,
  },
  analysisRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },

  // Confidence Row - Simplified
  confidenceRow: {
    marginBottom: theme.spacing.md,
  },
  confidenceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  confidencePercent: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    minWidth: 40,
  },
  confidenceBarContainer: {
    flex: 1,
  },

  // Metrics Row - Compact
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },

  // Footer Row - Simplified
  analysisFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  impactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  impactText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },
  impactValue: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary,
  },
  analysisDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },

  // Progress Bar Styles
  progressTrack: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Empty State Styles
  emptyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});

export default AiVerifyScreen;
