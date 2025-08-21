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
  withSpring,
  useAnimatedStyle,
  useSharedValue,
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
}

// Avoid animating custom components directly to prevent nativeTag errors.
// Wrap cards in Animated.View instead.

const CreditDashboardScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const rotateValue = useSharedValue(0);

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
      icon: 'image-check',
      color: theme.colors.success,
    },
    {
      category: 'Yield Risk',
      score: 75,
      maxScore: 100,
      icon: 'sprout',
      color: theme.colors.warning,
    },
    {
      category: 'Historical Performance',
      score: 65,
      maxScore: 100,
      icon: 'chart-line',
      color: theme.colors.info,
    },
    {
      category: 'Training Score',
      score: 90,
      maxScore: 100,
      icon: 'school',
      color: theme.colors.primary,
    },
    {
      category: 'Coop Membership',
      score: 45,
      maxScore: 100,
      icon: 'account-group',
      color: theme.colors.secondary,
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

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value}deg` }],
    };
  });

  const toggleBreakdown = () => {
    setShowBreakdown(!showBreakdown);
    rotateValue.value = withSpring(showBreakdown ? 0 : 180);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Shadow  startColor={'#00000010'} offset={[0, 2]} style={styles.fullWidth}>
            <Animated.View entering={FadeInDown.duration(500).springify()}>
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
          </Shadow>

          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Score History</Text>
            <LineChart
              data={historicalScores}
              width={width - 40}
              height={180}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => theme.colors.primary,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <TouchableOpacity
            style={styles.breakdownHeader}
            onPress={toggleBreakdown}>
            <Text style={styles.breakdownTitle}>Score Breakdown</Text>
            <Animated.View style={rotateStyle}>
              <Icon
                name="chevron-down"
                size={24}
                color={theme.colors.text}
              />
            </Animated.View>
          </TouchableOpacity>

          {showBreakdown && (
            <Animated.View entering={FadeInRight.duration(300).springify()}>
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
                </View>
              ))}
              </Card>
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
    marginBottom: theme.spacing.md,
  },
  chart: {
    marginVertical: theme.spacing.md,
    borderRadius: 16,
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
});

export default CreditDashboardScreen;