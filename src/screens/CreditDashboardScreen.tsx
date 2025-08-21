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

export type CreditDashboardScreenProps = Props;

interface ScoreBreakdown {
  category: string;
  score: number;
  maxScore: number;
  icon: string;
  color: string;
  impact: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

// Avoid animating custom components directly to prevent nativeTag errors.
// Wrap cards in Animated.View instead.

const CreditDashboardScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'how' | 'improve'>('breakdown');

  const [scores, setScores] = useState({
    imageScore: 85,
    yieldRisk: 75,
    creditScore: 72,
  });

  const [breakdown, setBreakdown] = useState<ScoreBreakdown[]>([
    {
      category: 'Image Authenticity',
      score: 85,
      maxScore: 100,
      icon: 'image',
      color: theme.colors.success,
      impact: 'high',
      trend: 'up',
      description: 'AI verification of crop images and authenticity signals',
    },
    {
      category: 'Yield Risk',
      score: 75,
      maxScore: 100,
      icon: 'sprout',
      color: theme.colors.warning,
      impact: 'high',
      trend: 'stable',
      description: 'Estimated risk based on historical yields and season factors',
    },
    {
      category: 'Historical Performance',
      score: 65,
      maxScore: 100,
      icon: 'chart-line',
      color: theme.colors.info,
      impact: 'medium',
      trend: 'up',
      description: 'Consistency and delivery reliability over time',
    },
    {
      category: 'Training Score',
      score: 90,
      maxScore: 100,
      icon: 'school',
      color: theme.colors.primary,
      impact: 'medium',
      trend: 'up',
      description: 'Completion of training modules and quizzes',
    },
    {
      category: 'Coop Membership',
      score: 45,
      maxScore: 100,
      icon: 'account-group',
      color: theme.colors.secondary,
      impact: 'low',
      trend: 'stable',
      description: 'Participation and standing within cooperatives',
    },
  ]);

  const [historicalScores] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [65, 68, 70, 72, 75, 72],
    }],
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const getCreditGrade = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getEligibleAmount = (score: number): number => {
    if (score >= 90) return 1000;
    if (score >= 80) return 750;
    if (score >= 70) return 500;
    if (score >= 60) return 250;
    return 0;
  };

  const handleAnchor = () => {
    (navigation as any).navigate('BlockchainAnchor', {
      profileId: 'default',
      score: scores.creditScore
    });
  };

  // Tabs: 'breakdown' | 'how' | 'improve'

  const monthlyChange = +6; // mock monthly change
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      default:
        return theme.colors.success;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[theme.colors.secondary + '20', theme.colors.white]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.fullWidth}>
              <Card style={styles.scoreCard}>
                <View style={styles.scoreHeader}>
                  {loading ? (
                    <ShimmerPlaceholder style={styles.shimmer} />
                  ) : (
                    <CircularProgress
                      size={120}
                      width={12}
                      fill={scores.creditScore}
                      tintColor={theme.colors.primary}
                      backgroundColor={theme.colors.border}
                      rotation={0}>
                      <View style={styles.scoreCenter}>
                        <Text style={styles.scoreGrade}>
                          {getCreditGrade(scores.creditScore)}
                        </Text>
                        <Text style={styles.scoreValue}>
                          {Math.round(scores.creditScore)}
                        </Text>
                      </View>
                    </CircularProgress>
                  )}
                  <View style={styles.scoreInfo}>
                    <Text style={styles.scoreTitle}>Credit Score</Text>
                    <Text style={styles.scoreSubtitle}>
                      Eligible for loan up to ${getEligibleAmount(scores.creditScore)}
                    </Text>
                    <View style={styles.deltaRow}>
                      <Icon name={monthlyChange >= 0 ? 'trending-up' : 'trending-down'} size={16} color={monthlyChange >= 0 ? theme.colors.success : theme.colors.error} />
                      <Text style={[styles.deltaText, { color: monthlyChange >= 0 ? theme.colors.success : theme.colors.error }]}> {monthlyChange > 0 ? '+' : ''}{monthlyChange} this month</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.indicators}>
                  <View style={styles.indicator}>
                    <LinearGradient
                      colors={[theme.colors.success + '20', theme.colors.success + '10']}
                      style={styles.indicatorIcon}>
                      <Icon name="image-check" size={24} color={theme.colors.success} />
                    </LinearGradient>
                    <Text style={styles.indicatorLabel}>Image Score</Text>
                    <Text style={styles.indicatorValue}>{scores.imageScore}/100</Text>
                  </View>
                  <View style={styles.indicator}>
                    <LinearGradient
                      colors={[theme.colors.warning + '20', theme.colors.warning + '10']}
                      style={styles.indicatorIcon}>
                      <Icon name="trending-down" size={24} color={theme.colors.warning} />
                    </LinearGradient>
                    <Text style={styles.indicatorLabel}>Yield Risk</Text>
                    <Text style={styles.indicatorValue}>{scores.yieldRisk}/100</Text>
                  </View>
                </View>
              </Card>
            </Animated.View>
            <View style={styles.chartSection}>
              <Card style={styles.chartCard}>
                <View style={styles.chartHeaderRow}>
                  <Icon name="calendar-month" size={18} color={theme.colors.primary} />
                  <Text style={styles.chartTitle}>Score History</Text>
                </View>
                <Text style={styles.chartSubtitle}>Your credit score progression over time</Text>
                <LineChart
                  data={historicalScores}
                  width={width - 40}
                  height={190}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: () => theme.colors.primary,
                    labelColor: () => theme.colors.textLight,
                    fillShadowGradient: theme.colors.primary,
                    fillShadowGradientOpacity: 0.2,
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: theme.colors.primary,
                    },
                    propsForBackgroundLines: {
                      stroke: theme.colors.border,
                    },
                  }}
                  withOuterLines={false}
                  bezier
                  style={styles.chart}
                />
              </Card>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              {[
                { key: 'breakdown', label: 'Score' },
                { key: 'how', label: 'How' },
                { key: 'improve', label: 'Improve' },
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
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.key && styles.tabTextActive,
                    ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tab Content */}
            {activeTab === 'breakdown' && (
              <Animated.View entering={FadeInRight.duration(250).springify()}>
                <Card style={styles.breakdownCard}>
                  {breakdown.map((item, index) => (
                    <View
                      key={item.category}
                      style={[
                        styles.breakdownItem,
                        index < breakdown.length - 1 && styles.breakdownDivider,
                      ]}>
                      <View style={styles.breakdownHeader}>
                        <View style={styles.breakdownLeft}>
                          <LinearGradient
                            colors={[item.color + '20', item.color + '10']}
                            style={styles.breakdownIcon}>
                            <Icon name={item.icon} size={24} color={item.color} />
                          </LinearGradient>
                          <Text style={styles.breakdownCategory}>
                            {item.category}
                          </Text>
                        </View>
                        <Text style={styles.breakdownScore}>
                          {item.score}/{item.maxScore}
                        </Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              backgroundColor: item.color,
                              width: `${(item.score / item.maxScore) * 100}%`,
                            },
                          ]}
                        />
                      </View>
                      <View style={styles.factorMetaRow}>
                        <Text style={[styles.impactLabel, { color: getImpactColor(item.impact) }]}>{item.impact.toUpperCase()} IMPACT</Text>
                        <View style={styles.trendRow}>
                          <Icon name={item.trend === 'up' ? 'trending-up' : item.trend === 'down' ? 'trending-down' : 'minus'} size={14} color={item.trend === 'up' ? theme.colors.success : item.trend === 'down' ? theme.colors.error : theme.colors.textLight} />
                          <Text style={styles.trendText}>{item.trend}</Text>
                        </View>
                      </View>
                      <Text style={styles.factorDesc}>{item.description}</Text>
                    </View>
                  ))}
                </Card>
              </Animated.View>
            )}

            {activeTab === 'how' && (
              <Animated.View entering={FadeInRight.duration(250).springify()}>
                <Card style={styles.howCard}>
                  <View style={styles.howHeader}>
                    <Icon name="shield" size={18} color={theme.colors.primary} />
                    <Text style={styles.howTitle}>How Your Score Works</Text>
                  </View>
                  <Text style={styles.howText}>
                    Your AgriCred score is calculated using AI analysis of your farming data, including crop quality, harvest
                    consistency, and farm management practices.
                  </Text>
                  <View style={styles.rangeGrid}>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeLabel}>750-850</Text>
                      <Text style={[styles.rangeTag, { color: theme.colors.success }]}>Excellent</Text>
                    </View>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeLabel}>650-749</Text>
                      <Text style={[styles.rangeTag, { color: theme.colors.info }]}>Good</Text>
                    </View>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeLabel}>550-649</Text>
                      <Text style={[styles.rangeTag, { color: theme.colors.warning }]}>Fair</Text>
                    </View>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeLabel}>300-549</Text>
                      <Text style={[styles.rangeTag, { color: theme.colors.error }]}>Poor</Text>
                    </View>
                  </View>
                </Card>
              </Animated.View>
            )}

            {activeTab === 'improve' && (
              <Animated.View entering={FadeInRight.duration(250).springify()}>
                <Card style={styles.improveCard}>
                  <View style={styles.improveHeader}>
                    <Icon name="target" size={18} color={theme.colors.primary} />
                    <Text style={styles.improveTitle}>Improvement Recommendations</Text>
                  </View>
                  <Text style={styles.improveSubtitle}>Actions to boost your credit score</Text>
                  <View style={styles.improveList}>
                    {[{
                      title: 'Upload More Crop Photos',
                      desc: 'Increase your AI verification score by uploading high-quality crop photos regularly.',
                      impact: 'Potential impact: +15–25 points',
                      color: theme.colors.primary,
                    }, {
                      title: 'Complete Farm Records',
                      desc: 'Fill in missing harvest data and farm management details to improve data completeness.',
                      impact: 'Potential impact: +10–20 points',
                      color: theme.colors.success,
                    }, {
                      title: 'Maintain Consistency',
                      desc: 'Keep documenting harvests regularly to build a strong consistency track record.',
                      impact: 'Potential impact: +5–15 points',
                      color: theme.colors.warning,
                    }, {
                      title: 'Connect with Banks',
                      desc: 'Share your profile with partner banks to unlock better loan opportunities.',
                      impact: 'Unlock lending opportunities',
                      color: theme.colors.secondary,
                    }].map((it, idx) => (
                      <View key={idx} style={[styles.improveItem, { backgroundColor: (it.color as string) + '10', borderColor: (it.color as string) + '40' }] }>
                        <View style={[styles.bullet, { backgroundColor: it.color }]} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.improveItemTitle}>{it.title}</Text>
                          <Text style={styles.improveItemDesc}>{it.desc}</Text>
                          <Text style={[styles.improveImpact, { color: it.color }]}>{it.impact}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </Card>

                {/* CTA: Ready for Lending inside Improve */}
                <View style={styles.lendingCard}>
                  <View style={styles.lendingHeaderRow}>
                    <Icon name="shield-check" size={18} color={theme.colors.primary} />
                    <Text style={styles.lendingTitle}>Ready for Lending?</Text>
                  </View>
                  <Text style={styles.lendingDesc}>
                    Your score qualifies you for agricultural loans with competitive rates. Connect with our partner banks to
                    explore your options.
                  </Text>
                  <ButtonCustom
                    title="View Loan Options"
                    icon="chevron-right"
                    onPress={() => (navigation as any).navigate('LoanApproval', { profileId: 'default', score: scores.creditScore })}
                    style={styles.loanBtn}
                  />
                </View>
              </Animated.View>
            )}

            <ButtonCustom
              title="Anchor to Blockchain"
              onPress={handleAnchor}
              style={styles.anchorButton}
              icon="link-variant"
            />
          </View>
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
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  scoreCard: {
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: theme.spacing.lg,
    width: '100%',
    shadowColor: theme.colors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  scoreCenter: {
    alignItems: 'center',
  },
  scoreGrade: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 32,
    color: theme.colors.primary,
  },
  scoreValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  scoreInfo: {
    flex: 1,
    marginLeft: theme.spacing.lg,
  },
  scoreTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  scoreSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
  deltaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  deltaText: { fontFamily: theme.typography.fontFamily.medium, fontSize: theme.typography.fontSize.sm },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  indicator: {
    alignItems: 'center',
  },
  indicatorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  indicatorLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginVertical: theme.spacing.xs,
  },
  indicatorValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  chartSection: {
    marginBottom: theme.spacing.xl,
  },
  chartTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  chartSubtitle: {
    color: theme.colors.textLight,
    marginLeft: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  chart: {
    marginVertical: theme.spacing.md,
    borderRadius: 16,
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: theme.colors.white,
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabText: {
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
  },
  tabTextActive: {
    color: theme.colors.text,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  breakdownTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  breakdownCard: {
    marginBottom: theme.spacing.xl,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: theme.spacing.lg,
  },
  breakdownItem: {
    paddingVertical: theme.spacing.md,
  },
  breakdownDivider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breakdownCategory: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  breakdownScore: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  factorMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  impactLabel: { fontFamily: theme.typography.fontFamily.medium, fontSize: theme.typography.fontSize.xs },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trendText: { color: theme.colors.textLight, fontSize: theme.typography.fontSize.xs },
  factorDesc: { marginTop: 6, color: theme.colors.textLight, fontSize: theme.typography.fontSize.sm },
  anchorButton: {
    marginTop: theme.spacing.md,
  },
  shimmer: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  fullWidth: {
    width: '100%',
  },
  lendingCard: {
    backgroundColor: theme.colors.primary + '10',
    borderColor: theme.colors.primary + '20',
    borderWidth: 1,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  lendingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  lendingTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  lendingDesc: {
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  loanBtn: {
    alignSelf: 'flex-start',
  },
  howCard: {
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
  },
  howHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  howTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  howText: {
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  rangeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  rangeCol: {
    width: '48%',
  },
  rangeLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  },
  rangeTag: {
    fontSize: theme.typography.fontSize.sm,
  },
  improveCard: {
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: 'white',
  },
  improveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  improveTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  improveSubtitle: {
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  improveList: {
    gap: 12,
  },
  improveItem: {
    borderWidth: 1,
    borderRadius: 14,
    padding: theme.spacing.md,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 8,
  },
  improveItemTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    marginBottom: 4,
  },
  improveItemDesc: {
    color: theme.colors.text,
    opacity: 0.8,
  },
  improveImpact: {
    marginTop: 6,
    fontSize: theme.typography.fontSize.xs,
  },
});

export default CreditDashboardScreen;