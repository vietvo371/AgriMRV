import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  Dimensions,
  Linking,
  Share,
  Modal
} from 'react-native';
import { WebView } from 'react-native-webview';
import { getToken } from '../utils/TokenManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import Card from '../component/Card';
import Badge from '../component/Badge';
import api, { aiApi } from '../utils/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'AiAnalysisDetail'>;

const ProgressBar: React.FC<{ value: number; color?: string; showPercentage?: boolean }> = ({
  value,
  color = theme.colors.primary,
  showPercentage = false
}) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressTrack}>
      <LinearGradient
        colors={[color, color + '80']}
        style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, value))}%` }]}
      />
    </View>
    {showPercentage && (
      <Text style={[styles.progressText, { color }]}>{Math.round(value)}%</Text>
    )}
  </View>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'verified':
      return theme.colors.success;
    case 'needs_review':
      return theme.colors.warning;
    case 'processing':
      return theme.colors.info;
    case 'rejected':
      return theme.colors.error;
    default:
      return theme.colors.textLight;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'verified':
      return 'check-circle';
    case 'needs_review':
      return 'alert-circle';
    case 'processing':
      return 'clock-outline';
    case 'rejected':
      return 'close-circle';
    default:
      return 'help-circle';
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 85) return theme.colors.success;
  if (confidence >= 70) return theme.colors.warning;
  return theme.colors.error;
};

const getMetricColor = (value: number) => {
  if (value >= 80) return theme.colors.success;
  if (value >= 60) return theme.colors.warning;
  return theme.colors.error;
};

const AiAnalysisDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { analysisId } = route.params;
  const [detail, setDetail] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'insights'>('overview');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportToken, setReportToken] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await aiApi.getDetail(analysisId);
        setDetail(res?.data || null);
      } catch (e) {
        setDetail(null);
      }
    })();
  }, [analysisId]);

  const confidence = detail?.confidence ?? 0;
  const status = detail?.status ?? 'processing';
  const findings = {
    cropHealth: detail?.findings?.crop_health ?? 0,
    authenticity: detail?.findings?.authenticity ?? 0,
    maturity: detail?.findings?.maturity ?? 0,
    quality: detail?.findings?.quality ?? 0,
  };
  const insights = detail?.insights || [];
  const recommendations = detail?.recommendations || [];
  const creditImpact = detail?.credit_impact ?? 0;

  const handleDownloadReport = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      
      // 1. Lấy PDF URL
      const response = await api.get(`/ai/analyses/${analysisId}/report`);
      const { pdf_url } = response.data.data;
      
      if (pdf_url) {
        setPdfUrl(pdf_url);
        setReportVisible(true);
      }
    } catch (e) {
      console.error('Error fetching report:', e);
    }
  };

  const handleShare = async () => {
    try {
      const res = await aiApi.createShare(analysisId, 72);
      const url = res?.share_url || null;
      setShareUrl(url);
      if (url) {
        await Share.share({ message: url, url });
      }
    } catch (e) {
      setShareUrl(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="AI Analysis Details" onBack={() => navigation.goBack()} />
      <LinearGradient
        colors={[theme.colors.primary + '08', theme.colors.white]}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Header Card */}
          <Animated.View entering={FadeInDown.duration(400).springify()}>
            <Card style={[styles.headerCard, styles.elevation]}>
              <View style={styles.headerContent}>
                <View style={styles.headerInfo}>
                  <View style={styles.titleSection}>
                    <Text style={styles.cropTitle}>{detail?.crop_type || '—'}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(status) + '15' }
                    ]}>
                      <Icon
                        name={getStatusIcon(status)}
                        size={14}
                        color={getStatusColor(status)}
                      />
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(status) }
                      ]}>
                        {status.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.locationRow}>
                    <Icon name="map-marker" size={16} color={theme.colors.textLight} />
                    <Text style={styles.locationText}>{detail?.location || '—'}</Text>
                  </View>

                  <View style={styles.analysisMetaRow}>
                    <View style={styles.metaItem}>
                      <Icon name="calendar" size={14} color={theme.colors.textLight} />
                      <Text style={styles.metaText}>
                        {new Date(detail?.analysis_date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Icon name="trending-up" size={14} color={theme.colors.primary} />
                      <Text style={styles.metaText}>
                        Credit Impact: +{creditImpact} pts
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.shareButton}>
                  <Icon name="share-variant" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>

              {detail?.image_url && (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: detail.image_url }} style={styles.heroImage} />
                  <View style={styles.imageOverlay}>
                    <View style={styles.imageInfo}>
                      <Icon name="camera" size={16} color={theme.colors.white} />
                      <Text style={styles.imageText}>AI Analyzed</Text>
                    </View>
                  </View>
                </View>
              )}
            </Card>
          </Animated.View>

          {/* Tabs (aligned with FinanceScreen tabsContainer) */}
          <View style={styles.tabsContainer}>
            {[
              { key: 'overview', label: 'Overview', icon: 'view-dashboard' },
              { key: 'analysis', label: 'Analysis', icon: 'brain' },
              { key: 'insights', label: 'Insights', icon: 'lightbulb-on' },
            ].map((tab: any) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  activeTab === tab.key && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
              >
                <Icon 
                  name={tab.icon} 
                  size={18} 
                  color={activeTab === tab.key ? theme.colors.primary : theme.colors.textLight} 
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Overview Tab: Confidence + Actions */}
          {activeTab === 'overview' && (
          <Animated.View entering={FadeInDown.duration(500).springify()}>
            <Card style={[styles.confidenceCard, styles.elevation]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleSection}>
                  <LinearGradient
                    colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
                    style={styles.cardIcon}
                  >
                    <Icon name="brain" size={24} color={theme.colors.primary} />
                  </LinearGradient>
                  <View>
                    <Text style={styles.cardTitle}>AI Confidence Score</Text>
                    <Text style={styles.cardSubtitle}>Overall analysis reliability</Text>
                  </View>
                </View>
              </View>

              <View style={styles.confidenceDisplay}>
                <View style={styles.confidenceValue}>
                  <Text style={[
                    styles.confidenceNumber,
                    { color: getConfidenceColor(confidence) }
                  ]}>
                    {confidence}%
                  </Text>
                  <Text style={styles.confidenceLabel}>Confidence</Text>
                </View>
                <View style={styles.confidenceBar}>
                  <ProgressBar
                    value={confidence}
                    color={getConfidenceColor(confidence)}
                  />
                </View>
              </View>

              <View style={styles.confidenceDetails}>
                <Text style={styles.confidenceDescription}>
                  {confidence >= 85 ? 'High confidence - Analysis results are highly reliable' :
                    confidence >= 70 ? 'Medium confidence - Analysis results are moderately reliable' :
                      'Low confidence - Analysis results may need manual review'}
                </Text>
              </View>
            </Card>
          </Animated.View>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <View style={[styles.section, styles.elevation]}>
              <View style={styles.sectionHeader}>
              <LinearGradient
                    colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
                    style={styles.cardIcon}
                  >
                    <Icon name="brain" size={24} color={theme.colors.primary} />
                  </LinearGradient>
                  <View>
                    <Text style={styles.cardTitle}>Image Analysis</Text>
                    <Text style={styles.cardSubtitle}>AI analysis of the image</Text>
                  </View>
              </View>
              {([['Crop Health', findings.cropHealth], ['Authenticity', findings.authenticity], ['Maturity', findings.maturity], ['Quality', findings.quality]] as const).map(([label, val]) => (
                <View key={label} style={{ marginTop: 8 }}>
                  <View style={styles.rowBetween}><Text style={styles.mutedText}>{label}</Text><Text style={styles.metricValue}>{val}%</Text></View>
                  <ProgressBar value={val} />
                </View>
              ))}
            </View>
          </Animated.View>
          )}

          {/* Insights Tab: Insights + Recommendations */}
          {activeTab === 'insights' && (
          <Animated.View entering={FadeInDown.duration(700).springify()}>
            <Card style={[styles.insightsCard, styles.elevation]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleSection}>
                  <LinearGradient
                    colors={[theme.colors.success + '20', theme.colors.success + '10']}
                    style={styles.cardIcon}
                  >
                    <Icon name="eye-outline" size={24} color={theme.colors.success} />
                  </LinearGradient>
                  <View>
                    <Text style={styles.cardTitle}>AI Insights</Text>
                    <Text style={styles.cardSubtitle}>Key findings from analysis</Text>
                  </View>
                </View>
              </View>

              <View style={styles.insightsList}>
                {insights.map((text: string, idx: number) => (
                  <Animated.View
                    key={idx}
                    entering={FadeInRight.duration(300).delay(idx * 100).springify()}
                  >
                    <View style={styles.insightItem}>
                      <View style={styles.insightIcon}>
                        <Icon name="check-circle" size={16} color={theme.colors.success} />
                      </View>
                      <Text style={styles.insightText}>{text}</Text>
                    </View>
                  </Animated.View>
                ))}
                {insights.length === 0 && (
                  <Text style={[styles.mutedText, { textAlign: 'center' }]}>No insights found</Text>
                )}
              </View>

            </Card>
          </Animated.View>
          )}

          {activeTab === 'insights' && (
          <Animated.View entering={FadeInDown.duration(800).springify()}>
            <Card style={[styles.recommendationsCard, styles.elevation]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleSection}>
                  <LinearGradient
                    colors={[theme.colors.warning + '20', theme.colors.warning + '10']}
                    style={styles.cardIcon}
                  >
                    <Icon name="lightbulb-on" size={24} color={theme.colors.warning} />
                  </LinearGradient>
                  <View>
                    <Text style={styles.cardTitle}>Recommendations</Text>
                    <Text style={styles.cardSubtitle}>AI-powered suggestions for optimization</Text>
                  </View>
                </View>
              </View>

              <View style={styles.recommendationsList}>
                {recommendations.map((text: string, idx: number) => (
                  <Animated.View
                    key={idx}
                    entering={FadeInRight.duration(300).delay(idx * 100).springify()}
                  >
                    <View style={styles.recommendationItem}>
                      <View style={styles.recommendationNumber}>
                        <Text style={styles.recommendationNumberText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.recommendationText}>{text}</Text>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </Card>
          </Animated.View>
          )}

          {/* Overview Actions */}
          {activeTab === 'overview' && (
          <Animated.View entering={FadeInDown.duration(900).springify()}>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleDownloadReport}>
                <Icon name="download" size={20} color={theme.colors.primary} />
                <Text style={styles.actionButtonText}>Download Report</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleShare}>
                <Icon name="share" size={20} color={theme.colors.white} />
                <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>
                  Share Analysis
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          )}
        </ScrollView>
      </LinearGradient>
      <Modal
        visible={reportVisible}
        onRequestClose={() => setReportVisible(false)}
        animationType="slide"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setReportVisible(false)} style={styles.closeButton}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AI Analysis Report</Text>
            <View style={styles.placeholder} />
          </View>
          {pdfUrl ? (
            <WebView
              source={{ uri: pdfUrl || '' }}
              style={{ flex: 1, backgroundColor: theme.colors.white,}}
              
              startInLoadingState
            />
          ) : (
            <View style={styles.loadingContainer}>
              <Text>Loading report...</Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
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

  // Header Card Styles
  headerCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  headerInfo: {
    flex: 1,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cropTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  locationText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
  analysisMetaRow: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: theme.colors.border,
  },
  imageOverlay: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
  },
  imageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  imageText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },

  // Card Common Styles
  cardHeader: {
    marginBottom: theme.spacing.lg,
  },
  cardTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },

  // Confidence Card Styles
  confidenceCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  confidenceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  confidenceValue: {
    alignItems: 'center',
  },
  confidenceNumber: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 36,
    marginBottom: 4,
  },
  confidenceLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  confidenceBar: {
    flex: 1,
  },
  confidenceDetails: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  confidenceDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },

  // Analysis Card Styles
  analysisCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  metricCard: {
    width: '48%',
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: theme.spacing.md,
    minHeight: 120,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  metricIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  metricLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginBottom: 4,
  },
  metricDescription: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },

  // Progress Bar Styles
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    minWidth: 32,
    textAlign: 'right',
  },

  // Insights Card Styles
  insightsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  insightsList: {
    gap: theme.spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  insightIcon: {
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
  },

  // Recommendations Card Styles
  recommendationsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  recommendationsList: {
    gap: theme.spacing.md,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  recommendationNumberText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.bold,
  },
  recommendationText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
  },

  // Action Buttons Styles
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  actionButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
  },
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.text },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.primary, marginTop: 6 },
  body: { color: theme.colors.text },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mutedText: { color: theme.colors.textLight },
  // Tabs (reuse FinanceScreen style language)
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 6,
    marginBottom: theme.spacing.lg,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: theme.colors.white,
    shadowColor: '#00000015',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  placeholder: {
    width: 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
});

export default AiAnalysisDetailScreen;
