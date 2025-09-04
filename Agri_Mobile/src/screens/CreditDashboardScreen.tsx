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
  Alert,
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
import api from '../utils/Api';

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
  carbonReduction?: number; // tCO₂e
  area?: number; // hectares
}

interface MRVData {
  riceArea: number;
  agroforestryArea: number;
  treeCount: number;
  awdCycle: string;
  strawManagement: string;
  evidencePhotos: number;
  gpsVerified: boolean;
  diaryCompleted: boolean;
}

interface CreditProfile {
  creditScore: number;
  carbonPerformance: number;
  mrvReliability: number;
  carbonReduction: number;
  monthlyChange: number;
  grade: string;
  eligibleAmount: number;
}

interface ScoreHistory {
  date: string;
  score: number;
  change: number;
}

// Avoid animating custom components directly to prevent nativeTag errors.
// Wrap cards in Animated.View instead.

const CreditDashboardScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'how' | 'improve'>('breakdown');

  const [mrvData, setMrvData] = useState<MRVData>({
    riceArea: 0,
    agroforestryArea: 0,
    treeCount: 0,
    awdCycle: "",
    strawManagement: "",
    evidencePhotos: 0,
    gpsVerified: false,
    diaryCompleted: false,
  });

  const [creditProfile, setCreditProfile] = useState<CreditProfile>({
    creditScore: 0,
    carbonPerformance: 0,
    mrvReliability: 0,
    carbonReduction: 0,
    monthlyChange: 0,
    grade: 'F',
    eligibleAmount: 0,
  });

  const [breakdown, setBreakdown] = useState<ScoreBreakdown[]>([]);
  const [historicalScores, setHistoricalScores] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [overallTrend, setOverallTrend] = useState<string>('excellent');

  // Fetch credit profile data
  const fetchCreditProfile = async () => {
    try {
      const response = await api.get('/credit/profile');
      console.log('response', response.data);
      const data = response.data.data;
      
      setCreditProfile({
        creditScore: data.credit_score || 0,
        carbonPerformance: data.carbon_performance || 0,
        mrvReliability: data.mrv_reliability || 0,
        carbonReduction: data.carbon_reduction || 0,
        monthlyChange: 0, // Will be fetched separately
        grade: getCreditGrade(data.credit_score || 0),
        eligibleAmount: getEligibleAmount(data.credit_score || 0),
      });

      // Update MRV data from farm profile
      if (data.farm_profile) {
        setMrvData(prev => ({
          ...prev,
          riceArea: data.farm_profile.rice_area || 0,
          agroforestryArea: data.farm_profile.agroforestry_area || 0,
        }));
      }
    } catch (error: any) {
      console.error('Error fetching credit profile:', error.response?.data || error);
    }
  };

  // Fetch MRV data
  const fetchMRVData = async () => {
    try {
      const response = await api.get('/credit/mrv-data');
      console.log('response', response.data);
      const data = response.data.data;
      
      setMrvData(prev => ({
        ...prev,
        riceArea: data.rice_area || 0,
        agroforestryArea: data.agroforestry_area || 0,
        treeCount: data.tree_count || 0,
        awdCycle: `${data.awd_cycles || 0} cycles`,
        strawManagement: `${data.straw_management || 0}/5 rating`,
        evidencePhotos: data.evidence_photos || 0,
        gpsVerified: data.gps_verification >= 4, // Consider verified if >= 4
        diaryCompleted: data.diary_completion >= 80, // Consider completed if >= 80%
      }));
    } catch (error: any) {
      console.error('Error fetching MRV data:', error.response?.data || error);
    }
  };

  // Fetch score breakdown
  const fetchScoreBreakdown = async () => {
    try {
      const response = await api.get('/credit/score-breakdown');
      console.log('response', response.data);
      const data = response.data.data;
      
      const breakdownData = Object.entries(data.categories).map(([key, item]: [string, any]) => {
        // Map backend category keys to frontend display names and icons
        const categoryMapping: { [key: string]: { name: string; icon: string; color: string } } = {
          rice_farming: { name: 'Rice AWD Practices', icon: 'rice', color: theme.colors.success },
          agroforestry: { name: 'Agroforestry System', icon: 'tree', color: theme.colors.warning },
          evidence_quality: { name: 'Evidence Collection', icon: 'camera', color: theme.colors.info },
          gps_verification: { name: 'GPS Verification', icon: 'map-marker', color: theme.colors.primary },
          declaration_completion: { name: 'Declaration Completion', icon: 'file-document', color: theme.colors.secondary },
        };

        const mapping = categoryMapping[key] || { name: key, icon: 'help-circle', color: theme.colors.primary };
        
        return {
          category: mapping.name,
          score: item.score || 0,
          maxScore: 100,
          icon: mapping.icon,
          color: mapping.color,
          impact: (item.impact >= 25 ? 'high' : item.impact >= 15 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
          trend: (item.trend === 'excellent' ? 'up' : item.trend === 'good' ? 'stable' : 'down') as 'up' | 'down' | 'stable',
          description: `${mapping.name} with ${item.impact}% impact on overall score`,
          carbonReduction: item.carbon_reduction || 0,
          area: item.area || 0,
        };
      });
      
      setBreakdown(breakdownData);
    } catch (error: any) {
      console.error('Error fetching score breakdown:', error.response?.data || error);
    }
  };

  // Fetch score history
  const fetchScoreHistory = async () => {
    try {
      const response = await api.get('/credit/score-history?period=6months');
      console.log('response', response.data);
      const data = response.data.data;
      
      const labels = data.history.map((item: ScoreHistory) => {
        const date = new Date(item.date + '-01'); // Add day to make valid date
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      });
      
      const scores = data.history.map((item: ScoreHistory) => item.score);
      
      setHistoricalScores({
        labels,
        datasets: [{ data: scores }],
      });
      
      // Set overall trend from API
      setOverallTrend(data.trend || 'excellent');
    } catch (error: any) {
      console.error('Error fetching score history:', error.response?.data || error);
    }
  };

  // Fetch monthly change
  const fetchMonthlyChange = async () => {
    try {
      const response = await api.get('/credit/monthly-change');
      console.log('response', response.data);
      const data = response.data.data;
      
      setCreditProfile(prev => ({
        ...prev,
        monthlyChange: data.change || 0,
      }));
    } catch (error: any) {
      console.error('Error fetching monthly change:', error.response?.data || error);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchCreditProfile(),
          fetchMRVData(),
          fetchScoreBreakdown(),
          fetchScoreHistory(),
          fetchMonthlyChange(),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load credit dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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




  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return theme.colors?.error || '#ff0000';
      case 'medium':
        return theme.colors?.warning || '#ffa500';
      default:
        return theme.colors?.success || '#00ff00';
    }
  };

  const handleShare = () => {
    navigation.navigate('ShareProfile');
  };



  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient  colors={[theme.colors.primary + '08', theme.colors.white]}  style={styles.backgroundContainer}>
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
                      fill={creditProfile.creditScore}
                      tintColor={theme.colors.primary}
                      backgroundColor={theme.colors.border}
                      rotation={0}>
                      <View style={styles.scoreCenter}>
                        <Text style={styles.scoreGrade}>
                          {getCreditGrade(creditProfile.creditScore || 0)}
                        </Text>
                        <Text style={styles.scoreValue}>
                          {Math.round(creditProfile.creditScore || 0)}
                        </Text>
                      </View>
                    </CircularProgress>
                  )}
                  <View style={styles.scoreInfo}>
                    <Text style={styles.scoreTitle}>Credit Score</Text>
                                          <Text style={styles.scoreSubtitle}>
                        Eligible for loan up to ${getEligibleAmount(creditProfile.creditScore || 0)}
                      </Text>
                    <View style={styles.deltaRow}>
                      <Icon name={(creditProfile.monthlyChange || 0) >= 0 ? 'trending-up' : 'trending-down'} size={16} color={(creditProfile.monthlyChange || 0) >= 0 ? (theme.colors?.success || '#00ff00') : (theme.colors?.error || '#ff0000')} />
                      <Text style={[styles.deltaText, { color: (creditProfile.monthlyChange || 0) >= 0 ? (theme.colors?.success || '#00ff00') : (theme.colors?.error || '#ff0000') }]}> {(creditProfile.monthlyChange || 0) > 0 ? '+' : ''}{creditProfile.monthlyChange || 0} this month</Text>
                    </View>
                  </View>
                </View>

                                  <View style={styles.indicators}>
                    <View style={styles.indicator}>
                      <LinearGradient
                        colors={[(theme.colors?.success || '#00ff00') + '20', (theme.colors?.success || '#00ff00') + '10']}
                        style={styles.indicatorIcon}>
                        <Icon name="leaf" size={24} color={theme.colors?.success || '#00ff00'} />
                      </LinearGradient>
                      <Text style={styles.indicatorLabel}>Carbon Performance</Text>
                      <Text style={styles.indicatorValue}>{creditProfile.carbonPerformance || 0}/100</Text>
                    </View>
                    <View style={styles.indicator}>
                      <LinearGradient
                        colors={[(theme.colors?.warning || '#ffa500') + '20', (theme.colors?.warning || '#ffa500') + '10']}
                        style={styles.indicatorIcon}>
                        <Icon name="shield-check" size={24} color={theme.colors?.warning || '#ffa500'} />
                      </LinearGradient>
                      <Text style={styles.indicatorLabel}>MRV Reliability</Text>
                      <Text style={styles.indicatorValue}>{creditProfile.mrvReliability || 0}/100</Text>
                    </View>
                  
                  </View>
                <ButtonCustom
                    title="Share Credit Profile"
                    onPress={handleShare}
                    style={styles.anchorButton}
                    icon="share-variant"
                  />
              </Card>
            </Animated.View>
            <View style={styles.chartSection}>
              <Card style={styles.chartCard}>
                <View style={styles.chartHeaderRow}>
                  <Icon name="calendar-month" size={18} color={theme.colors.primary} />
                  <Text style={styles.chartTitle}>Score History</Text>
                  <TouchableOpacity onPress={fetchScoreHistory} style={styles.refreshButton}>
                    <Icon name="refresh" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.chartSubtitle}>Your credit score progression over time</Text>
                <View style={styles.trendIndicator}>
                  <Icon 
                    name="trending-up" 
                    size={16} 
                    color={theme.colors.success} 
                  />
                  <Text style={[styles.trendText, { color: theme.colors.success }]}>
                    Overall trend: {overallTrend.charAt(0).toUpperCase() + overallTrend.slice(1)}
                  </Text>
                </View>
                {historicalScores.labels.length > 0 ? (
                  <LineChart
                    data={historicalScores}
                    width={Dimensions.get('window').width - 40}
                    height={190}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: () => theme.colors?.primary || '#007AFF',
                      labelColor: () => theme.colors?.textLight || '#666666',
                      fillShadowGradient: theme.colors?.primary || '#007AFF',
                      fillShadowGradientOpacity: 0.2,
                      propsForDots: {
                        r: '4',
                        stroke: theme.colors?.primary || '#007AFF',
                      },
                      propsForBackgroundLines: {
                        stroke: theme.colors?.border || '#E5E5E5',
                      },
                    }}
                    withOuterLines={false}
                    bezier
                    style={styles.chart}
                  />
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No score history available</Text>
                  </View>
                )}
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
                            colors={[(item.color || theme.colors.primary) + '20', (item.color || theme.colors.primary) + '10']}
                            style={styles.breakdownIcon}>
                            <Icon name={item.icon || 'help-circle'} size={24} color={item.color || theme.colors.primary} />
                          </LinearGradient>
                          <Text style={styles.breakdownCategory}>
                            {item.category || 'Unknown Category'}
                          </Text>
                        </View>
                        <Text style={styles.breakdownScore}>
                          {item.score || 0}/{item.maxScore || 100}
                        </Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              backgroundColor: item.color || theme.colors.primary,
                              width: `${(item.score / item.maxScore) * 100}%`,
                            },
                          ]}
                        />
                      </View>
                      <View style={styles.factorMetaRow}>
                        <Text style={[styles.impactLabel, { color: getImpactColor(item.impact || 'low') }]}>{(item.impact || 'low').toUpperCase()} IMPACT</Text>
                        <View style={styles.trendRow}>
                          <Icon name={(item.trend || 'stable') === 'up' ? 'trending-up' : (item.trend || 'stable') === 'down' ? 'trending-down' : 'minus'} size={14} color={(item.trend || 'stable') === 'up' ? theme.colors.success : (item.trend || 'stable') === 'down' ? theme.colors.error : theme.colors.textLight} />
                          <Text style={[styles.trendText, { color: theme.colors.textLight }]}>{item.trend || 'stable'}</Text>
                        </View>
                      </View>
                      <Text style={styles.factorDesc}>{item.description || 'No description available'}</Text>
                      {item.carbonReduction !== undefined && (
                        <View style={styles.carbonInfo}>
                          <Text style={styles.carbonLabel}>
                            Carbon Impact: <Text style={[styles.carbonValue, { color: item.color }]}>
                              {item.carbonReduction || 0} {index < 2 ? 'tCO₂e' : index === 2 ? 'photos' : index === 3 ? 'score' : 'tCO₂e'}
                            </Text>
                          </Text>
                          {item.area !== undefined && index < 2 && (
                            <Text style={styles.areaInfo}>Area: {item.area || 0} ha</Text>
                          )}
                        </View>
                      )}
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
                    Your AgriMRV score is calculated using the official carbon calculation methodology, including AWD rice practices, 
                    agroforestry sequestration, and MRV evidence quality.
                  </Text>
                  <View style={styles.rangeGrid}>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeLabel}>75-100</Text>
                      <Text style={[styles.rangeTag, { color: theme.colors.success }]}>Grade A</Text>
                    </View>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeLabel}>60-74</Text>
                      <Text style={[styles.rangeTag, { color: theme.colors.info }]}>Grade B</Text>
                    </View>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeLabel}>45-59</Text>
                      <Text style={[styles.rangeTag, { color: theme.colors.warning }]}>Grade C</Text>
                    </View>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeLabel}>0-44</Text>
                      <Text style={[styles.rangeTag, { color: theme.colors.error }]}>Grade D</Text>
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
                    onPress={() => (navigation as any).navigate('LoanApproval', { profileId: 'default', score: creditProfile.creditScore })}
                    style={styles.loanBtn}
                  />
                </View>
              </Animated.View>
            )}

          
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
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    flexGrow: 1,
    marginTop: theme.spacing.xxl,
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
  refreshButton: {
    padding: 8,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  noDataText: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.md,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  trendText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
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
    justifyContent: 'space-between',
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

  factorDesc: { marginTop: 6, color: theme.colors.textLight, fontSize: theme.typography.fontSize.sm },
  anchorButton: {
    marginTop: theme.spacing.lg,
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
  carbonInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 6,
  },
  carbonLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },
  carbonValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontWeight: 'bold',
  },
  areaInfo: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: 2,
  },
});

export default CreditDashboardScreen;