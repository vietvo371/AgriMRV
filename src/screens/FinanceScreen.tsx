import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import ButtonCustom from '../component/ButtonCustom';
import Card from '../component/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CircularProgress from '../component/CircularProgress';
import LinearGradient from 'react-native-linear-gradient';
import { Shadow } from 'react-native-shadow-2';
import { LineChart } from 'react-native-chart-kit';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList, TabScreenProps } from '../navigation/types';

const { width } = Dimensions.get('window');
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

type Props = CompositeScreenProps<
  TabScreenProps<'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type FinanceScreenProps = Props;

interface VerificationStage {
  stage: string;
  status: 'completed' | 'in_progress' | 'pending';
  date: string | null;
}

interface PaymentRecord {
  date: string;
  amount: number;
  credits: number;
  status: 'paid' | 'pending' | 'failed';
}

interface FinanceData {
  carbonCredits: {
    verified: number;
    pending: number;
    totalValue: number;
    pricePerCredit: number;
  };
  verificationPipeline: VerificationStage[];
  paymentHistory: PaymentRecord[];
  projectedEarnings: {
    nextQuarter: number;
    nextYear: number;
  };
}

const FinanceScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'earnings'>('overview');

  const [financeData, setFinanceData] = useState<FinanceData>({
    carbonCredits: {
      verified: 45,
      pending: 23,
      totalValue: 1580, // USD
      pricePerCredit: 35
    },
    verificationPipeline: [
      { stage: "MRV Declaration", status: "completed", date: "2024-02-01" },
      { stage: "Field Verification", status: "in_progress", date: "2024-02-15" },
      { stage: "Third-party Audit", status: "pending", date: null },
      { stage: "Credit Issuance", status: "pending", date: null },
      { stage: "Market Trading", status: "pending", date: null }
    ],
    paymentHistory: [
      { date: "2024-01-15", amount: 875, credits: 25, status: "paid" },
      { date: "2023-12-15", amount: 700, credits: 20, status: "paid" }
    ],
    projectedEarnings: {
      nextQuarter: 1200,
      nextYear: 4800
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'in_progress':
        return theme.colors.warning;
      case 'pending':
        return theme.colors.textLight;
      default:
        return theme.colors.textLight;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'check-circle';
      case 'in_progress':
        return 'clock-outline';
      case 'pending':
        return 'clock-outline';
      default:
        return 'clock-outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return 'Pending';
    }
  };

  const handleViewCredits = () => {
    console.log('View Carbon Credits');
  };

  const handleConnectBank = () => {
    console.log('Connect with Bank');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient 
        colors={[theme.colors.primary + '08', theme.colors.white]} 
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Header */}
          <Animated.View entering={FadeInDown.duration(400).springify()}>
            <View style={styles.headerSection}>
              <Text style={styles.headerTitle}>Carbon Finance</Text>
              <Text style={styles.headerSubtitle}>Track your carbon credits and earnings</Text>
            </View>
          </Animated.View>

          {/* Enhanced Portfolio Overview */}
          <Animated.View entering={FadeInDown.duration(500).springify()}>
            <Card style={[styles.portfolioCard, styles.elevation]}>
              <View style={styles.portfolioHeader}>
                <View style={styles.portfolioTitleSection}>
                  <View style={styles.portfolioIconContainer}>
                    <LinearGradient
                      colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
                      style={styles.portfolioIcon}
                    >
                      <Icon name="leaf" size={28} color={theme.colors.primary} />
                    </LinearGradient>
                  </View>
                  <View style={styles.portfolioInfo}>
                    <Text style={styles.portfolioTitle}>Portfolio Value</Text>
                    <View style={styles.trendContainer}>
                      <Icon name="trending-up" size={16} color={theme.colors.success} />
                      <Text style={styles.trendText}>+12.5% this month</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <Icon name="dots-horizontal" size={20} color={theme.colors.textLight} />
                </TouchableOpacity>
              </View>

              <View style={styles.portfolioValueSection}>
                <Text style={styles.portfolioValue}>$1,847.50</Text>
                <Text style={styles.portfolioDetails}>@ $52.5/tCO₂e • 20.8 credits</Text>
              </View>

              <View style={styles.portfolioStats}>
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={[theme.colors.success + '15', theme.colors.success + '05']}
                    style={styles.statIconBg}
                  >
                    <Icon name="check-circle" size={20} color={theme.colors.success} />
                  </LinearGradient>
                  <Text style={styles.statValue}>12.5</Text>
                  <Text style={styles.statLabel}>Verified Credits</Text>
                  <Text style={styles.statSubtitle}>tCO₂e</Text>
                </View>

                <View style={styles.statCard}>
                  <LinearGradient
                    colors={[theme.colors.warning + '15', theme.colors.warning + '05']}
                    style={styles.statIconBg}
                  >
                    <Icon name="clock-outline" size={20} color={theme.colors.warning} />
                  </LinearGradient>
                  <Text style={styles.statValue}>8.3</Text>
                  <Text style={styles.statLabel}>Pending Credits</Text>
                  <Text style={styles.statSubtitle}>Under review</Text>
                </View>

                <View style={styles.statCard}>
                  <LinearGradient
                    colors={[theme.colors.info + '15', theme.colors.info + '05']}
                    style={styles.statIconBg}
                  >
                    <Icon name="chart-line" size={20} color={theme.colors.info} />
                  </LinearGradient>
                  <Text style={styles.statValue}>95%</Text>
                  <Text style={styles.statLabel}>Success Rate</Text>
                  <Text style={styles.statSubtitle}>Verification</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Enhanced Verification Pipeline */}
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <Card style={[styles.pipelineCard, styles.elevation]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleSection}>
                  <View style={styles.cardIconContainer}>
                    <Icon name="timeline" size={24} color={theme.colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>Verification Pipeline</Text>
                    <Text style={styles.cardSubtitle}>Track your credit verification progress</Text>
                  </View>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Overall Progress</Text>
                  <Text style={styles.progressValue}>
                    {Math.round((financeData.verificationPipeline.filter(s => s.status === 'completed').length / financeData.verificationPipeline.length) * 100)}%
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={[theme.colors.primary, theme.colors.primary + '80']}
                      style={[
                        styles.progressFill,
                        {
                          width: `${(financeData.verificationPipeline.filter(s => s.status === 'completed').length / financeData.verificationPipeline.length) * 100}%`,
                        }
                      ]}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.pipelineStages}>
                {financeData.verificationPipeline.map((stage, index) => (
                  <View key={stage.stage} style={styles.stageItem}>
                    <View style={styles.stageLeft}>
                      <View style={[
                        styles.stageIconContainer,
                        { backgroundColor: getStatusColor(stage.status) + '20' }
                      ]}>
                        <Icon
                          name={getStatusIcon(stage.status)}
                          size={18}
                          color={getStatusColor(stage.status)}
                        />
                      </View>
                      <View style={styles.stageInfo}>
                        <Text style={styles.stageName}>{stage.stage}</Text>
                        {stage.date && (
                          <Text style={styles.stageDate}>{stage.date}</Text>
                        )}
                      </View>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(stage.status) + '15' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(stage.status) }
                      ]}>
                        {getStatusText(stage.status)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Enhanced Tabs */}
          <View style={styles.tabsContainer}>
            {[
              { key: 'overview', label: 'Overview', icon: 'view-dashboard' },
              { key: 'pipeline', label: 'Pipeline', icon: 'timeline' },
              { key: 'earnings', label: 'Earnings', icon: 'cash-multiple' },
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

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <Animated.View entering={FadeInRight.duration(300).springify()}>
              {/* Financial Summary */}
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleSection}>
                    <View style={styles.cardIconContainer}>
                      <Icon name="chart-pie" size={24} color={theme.colors.success} />
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>Financial Summary</Text>
                      <Text style={styles.cardSubtitle}>Your earnings overview</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.summaryGrid}>
                  <View style={styles.summaryCard}>
                    <LinearGradient
                      colors={[theme.colors.success + '20', theme.colors.success + '10']}
                      style={styles.summaryIcon}
                    >
                      <Icon name="cash" size={24} color={theme.colors.success} />
                    </LinearGradient>
                    <Text style={styles.summaryLabel}>Total Earned</Text>
                    <Text style={styles.summaryValue}>
                      ${financeData.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
                    </Text>
                    <Text style={styles.summarySubtitle}>From credit sales</Text>
                  </View>

                  <View style={styles.summaryCard}>
                    <LinearGradient
                      colors={[theme.colors.info + '20', theme.colors.info + '10']}
                      style={styles.summaryIcon}
                    >
                      <Icon name="calendar-clock" size={24} color={theme.colors.info} />
                    </LinearGradient>
                    <Text style={styles.summaryLabel}>Next Quarter</Text>
                    <Text style={styles.summaryValue}>
                      ${financeData.projectedEarnings.nextQuarter.toLocaleString()}
                    </Text>
                    <Text style={styles.summarySubtitle}>Projected earnings</Text>
                  </View>
                </View>
              </Card>

              {/* Performance Metrics */}
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleSection}>
                    <View style={styles.cardIconContainer}>
                      <Icon name="trending-up" size={24} color={theme.colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>Performance Metrics</Text>
                      <Text style={styles.cardSubtitle}>Credit trading statistics</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.metricsGrid}>
                  <View style={styles.metricItem}>
                    <View style={styles.metricIcon}>
                      <Icon name="leaf" size={18} color={theme.colors.success} />
                    </View>
                    <View style={styles.metricInfo}>
                      <Text style={styles.metricLabel}>Credits Sold</Text>
                      <Text style={styles.metricValue}>
                        {financeData.paymentHistory.reduce((sum, payment) => sum + payment.credits, 0)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.metricItem}>
                    <View style={styles.metricIcon}>
                      <Icon name="currency-usd" size={18} color={theme.colors.info} />
                    </View>
                    <View style={styles.metricInfo}>
                      <Text style={styles.metricLabel}>Average Price</Text>
                      <Text style={styles.metricValue}>
                        ${Math.round(financeData.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0) / financeData.paymentHistory.reduce((sum, payment) => sum + payment.credits, 0))}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.metricItem}>
                    <View style={styles.metricIcon}>
                      <Icon name="target" size={18} color={theme.colors.warning} />
                    </View>
                    <View style={styles.metricInfo}>
                      <Text style={styles.metricLabel}>Next Year Target</Text>
                      <Text style={styles.metricValue}>
                        ${financeData.projectedEarnings.nextYear.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            </Animated.View>
          )}

          {activeTab === 'pipeline' && (
            <Animated.View entering={FadeInRight.duration(300).springify()}>
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleSection}>
                    <View style={styles.cardIconContainer}>
                      <Icon name="timeline" size={24} color={theme.colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>Detailed Pipeline</Text>
                      <Text style={styles.cardSubtitle}>Step-by-step verification process</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.timelineContainer}>
                  {financeData.verificationPipeline.map((stage, index) => (
                    <View key={stage.stage} style={styles.timelineItem}>
                      <View style={styles.timelineConnector}>
                        <View style={[
                          styles.timelineDot,
                          { backgroundColor: getStatusColor(stage.status) }
                        ]}>
                          <Icon
                            name={getStatusIcon(stage.status)}
                            size={14}
                            color={theme.colors.white}
                          />
                        </View>
                        {index < financeData.verificationPipeline.length - 1 && (
                          <View style={[
                            styles.timelineLine,
                            { backgroundColor: index < financeData.verificationPipeline.filter(s => s.status === 'completed').length ? theme.colors.success : theme.colors.border }
                          ]} />
                        )}
                      </View>
                      <View style={styles.timelineContent}>
                        <View style={styles.timelineCard}>
                          <Text style={styles.timelineTitle}>{stage.stage}</Text>
                          <View style={styles.timelineStatus}>
                            <View style={[
                              styles.timelineStatusBadge,
                              { backgroundColor: getStatusColor(stage.status) + '15' }
                            ]}>
                              <Text style={[
                                styles.timelineStatusText,
                                { color: getStatusColor(stage.status) }
                              ]}>
                                {getStatusText(stage.status)}
                              </Text>
                            </View>
                            {stage.date && (
                              <Text style={styles.timelineDate}>{stage.date}</Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            </Animated.View>
          )}

          {activeTab === 'earnings' && (
            <Animated.View entering={FadeInRight.duration(300).springify()}>
              {/* Payment History */}
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleSection}>
                    <View style={styles.cardIconContainer}>
                      <Icon name="cash-multiple" size={24} color={theme.colors.success} />
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>Payment History</Text>
                      <Text style={styles.cardSubtitle}>Your recent transactions</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.paymentList}>
                  {financeData.paymentHistory.map((payment, index) => (
                    <View key={index} style={styles.paymentCard}>
                      <View style={styles.paymentLeft}>
                        <View style={styles.paymentIconContainer}>
                          <Icon name="check-circle" size={20} color={theme.colors.success} />
                        </View>
                        <View style={styles.paymentInfo}>
                          <Text style={styles.paymentDate}>{payment.date}</Text>
                          <Text style={styles.paymentCredits}>{payment.credits} credits sold</Text>
                        </View>
                      </View>
                      <View style={styles.paymentRight}>
                        <Text style={styles.paymentAmount}>${payment.amount.toLocaleString()}</Text>
                        <View style={[
                          styles.paymentStatusBadge,
                          { backgroundColor: theme.colors.success + '15' }
                        ]}>
                          <Text style={[
                            styles.paymentStatusText,
                            { color: theme.colors.success }
                          ]}>
                            {payment.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>

              {/* Projected Earnings */}
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleSection}>
                    <View style={styles.cardIconContainer}>
                      <Icon name="chart-line" size={24} color={theme.colors.info} />
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>Projected Earnings</Text>
                      <Text style={styles.cardSubtitle}>Future income estimates</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.projectionGrid}>
                  <View style={styles.projectionCard}>
                    <LinearGradient
                      colors={[theme.colors.warning + '20', theme.colors.warning + '10']}
                      style={styles.projectionIcon}
                    >
                      <Icon name="calendar-month" size={24} color={theme.colors.warning} />
                    </LinearGradient>
                    <Text style={styles.projectionLabel}>Next Quarter</Text>
                    <Text style={styles.projectionValue}>
                      ${financeData.projectedEarnings.nextQuarter.toLocaleString()}
                    </Text>
                    <Text style={styles.projectionSubtitle}>Q2 2024</Text>
                  </View>

                  <View style={styles.projectionCard}>
                    <LinearGradient
                      colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
                      style={styles.projectionIcon}
                    >
                      <Icon name="calendar-year" size={24} color={theme.colors.primary} />
                    </LinearGradient>
                    <Text style={styles.projectionLabel}>Next Year</Text>
                    <Text style={styles.projectionValue}>
                      ${financeData.projectedEarnings.nextYear.toLocaleString()}
                    </Text>
                    <Text style={styles.projectionSubtitle}>2025 Target</Text>
                  </View>
                </View>
              </Card>

              {/* Bank Connection CTA */}
              <Card style={[styles.ctaCard, styles.elevation]}>
                <LinearGradient
                  colors={[theme.colors.primary + '10', theme.colors.primary + '05']}
                  style={styles.ctaBackground}
                >
                  <View style={styles.ctaContent}>
                    <View style={styles.ctaIcon}>
                      <Icon name="bank" size={32} color={theme.colors.primary} />
                    </View>
                    <View style={styles.ctaInfo}>
                      <Text style={styles.ctaTitle}>Connect with Banks</Text>
                      <Text style={styles.ctaDescription}>
                        Share your carbon credit portfolio with partner banks to unlock green financing opportunities and better loan rates.
                      </Text>
                    </View>
                  </View>
                  <ButtonCustom
                    title="Connect Now"
                    icon="arrow-right"
                    onPress={handleConnectBank}
                    style={styles.ctaButton}
                  />
                </LinearGradient>
              </Card>
            </Animated.View>
          )}
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

  // Header Styles
  headerSection: {
    marginBottom: theme.spacing.xl,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.md,
  },

  // Portfolio Card Styles
  portfolioCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  portfolioTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  portfolioIconContainer: {},
  portfolioIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  portfolioInfo: {
    flex: 1,
  },
  portfolioTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.success,
    fontFamily: theme.typography.fontFamily.medium,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portfolioValueSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  portfolioValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 36,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  portfolioDetails: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 120,
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
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
  },

  // Pipeline Card Styles
  pipelineCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  cardHeader: {
    marginBottom: theme.spacing.lg,
  },
  cardTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
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
  progressSection: {
    marginBottom: theme.spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
  progressValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
  },
  progressBarContainer: {
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  pipelineStages: {
    gap: theme.spacing.md,
  },
  stageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  stageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  stageIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageInfo: {
    flex: 1,
  },
  stageName: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: 2,
  },
  stageDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },

  // Tabs Styles
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

  // Content Card Styles
  contentCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },

  // Summary Grid Styles
  summaryGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 140,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  summarySubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
  },

  // Metrics Grid Styles
  metricsGrid: {
    gap: theme.spacing.md,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },

  // Timeline Styles
  timelineContainer: {
    gap: theme.spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  timelineConnector: {
    alignItems: 'center',
    width: 32,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
  },
  timelineContent: {
    flex: 1,
  },
  timelineCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  timelineTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  timelineStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timelineStatusText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  timelineDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },

  // Payment List Styles
  paymentList: {
    gap: theme.spacing.md,
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDate: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: 2,
  },
  paymentCredits: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  paymentRight: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  paymentAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  paymentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paymentStatusText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },

  // Projection Grid Styles
  projectionGrid: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  projectionCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 160,
  },
  projectionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  projectionLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  projectionValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  projectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },

  // CTA Card Styles
  ctaCard: {
    marginBottom: theme.spacing.lg,
  },
  ctaBackground: {
    borderRadius: 20,
    padding: theme.spacing.xl,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  ctaIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaInfo: {
    flex: 1,
  },
  ctaTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  ctaDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    lineHeight: 22,
  },
  ctaButton: {
    alignSelf: 'flex-start',
  },
});

export default FinanceScreen;
