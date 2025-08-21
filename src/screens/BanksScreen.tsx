import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Card from '../component/Card';

interface Bank {
  id: string;
  name: string;
  rating: number;
  description: string;
  interestRange: string; // e.g., 4.5%–7.2%
  maxLoan: string; // e.g., $500K
  processing: string; // e.g., 5–7 business days
  tags: string[];
  eligible: boolean;
}

const BANKS: Bank[] = [
  {
    id: 'agri',
    name: 'AgriBank Plus',
    rating: 4.8,
    description:
      'Leading agricultural lender with competitive rates and fast processing for verified farmers.',
    interestRange: '4.5%-7.2%',
    maxLoan: '$500K',
    processing: '5-7 business days',
    tags: ['Crop Loans', 'Equipment Financing', '+1 more'],
    eligible: true,
  },
  {
    id: 'farmfirst',
    name: 'FarmFirst Credit Union',
    rating: 4.6,
    description:
      'Community-focused credit union supporting small to medium-sized farming operations.',
    interestRange: '5%-8.5%',
    maxLoan: '$300K',
    processing: '7-10 business days',
    tags: ['Working Capital', 'Seasonal Loans'],
    eligible: true,
  },
  {
    id: 'green',
    name: 'GreenFields Finance',
    rating: 4.4,
    description:
      'Sustainable lending partner for modern agriculture and agri-tech adoption.',
    interestRange: '6%-9%',
    maxLoan: '$250K',
    processing: '6-9 business days',
    tags: ['Sustainability', 'AgriTech'],
    eligible: false,
  },
];

const BanksScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tab, setTab] = React.useState<'eligible' | 'all'>('eligible');
  const creditScore = 742;
  const eligibleCount = BANKS.filter((b) => b.eligible).length;

  const list = React.useMemo(
    () => (tab === 'eligible' ? BANKS.filter((b) => b.eligible) : BANKS),
    [tab],
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.secondary + '30', theme.colors.white]}
        style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header summary */}
          <Card style={styles.summaryCard}>
            <View style={styles.rowBetween}>
              <View style={styles.rowStart}>
                <View style={styles.iconWrap}>
                  <Icon name="shield-check" size={18} color={theme.colors.primary} />
                </View>
                <View>
                  <Text style={styles.summaryTitle}>Your Credit Score: {creditScore}</Text>
                  <Text style={styles.muted}>You qualify for {eligibleCount} of {BANKS.length} lenders</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {([
              { key: 'eligible', label: `Eligible (${eligibleCount})` },
              { key: 'all', label: `All Banks (${BANKS.length})` },
            ] as const).map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
                onPress={() => setTab(t.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bank list */}
          <View style={{ gap: 14 }}>
            {list.map((b) => (
              <Card key={b.id} style={styles.bankCard}>
                {/* Header row */}
                <View style={styles.rowStart}>
                  <View style={styles.logoBox}>
                    <Icon name="bank" size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.bankRight}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.bankName} numberOfLines={1} ellipsizeMode="tail">{b.name}</Text>
                      <View style={styles.ratingWrap}>
                        <Icon name="star" size={14} color={theme.colors.warning} />
                        <Text style={[styles.muted, { marginLeft: 4 }]}>{b.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.bankDesc} numberOfLines={2} ellipsizeMode="tail">{b.description}</Text>
                  </View>
                </View>

                {/* Metrics */}
                <View style={styles.metricsRow}>
                  <View style={styles.metricCol}>
                    <Text style={[styles.metricValue, { color: theme.colors.success }]} numberOfLines={1}>{b.interestRange}</Text>
                    <Text style={styles.muted}>Interest Rate</Text>
                  </View>
                  <View style={styles.metricCol}>
                    <Text style={[styles.metricValue, { color: theme.colors.primary }]} numberOfLines={1}>{b.maxLoan}</Text>
                    <Text style={styles.muted}>Max Loan</Text>
                  </View>
                  <View style={[styles.metricCol, { flex: 1.2 }]}>
                    <Text style={[styles.metricValue, { color: theme.colors.warning }]} numberOfLines={1}>{b.processing}</Text>
                    <Text style={styles.muted}>Processing</Text>
                  </View>
                </View>

                {/* Tags */}
                <View style={styles.tagsRow}>
                  {b.tags.map((t, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={styles.chipText}>{t}</Text>
                    </View>
                  ))}
                </View>

                {/* CTA */}
                <TouchableOpacity style={styles.applyBtn} activeOpacity={0.9} onPress={() => navigation?.navigate?.('LoanApproval') }>
                  <Text style={styles.applyText}>Apply Now</Text>
                  <Icon name="chevron-right" size={18} color={theme.colors.white} />
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  gradient: { flex: 1 },
  scrollContent: { padding: theme.spacing.lg },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowStart: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  summaryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary + '15',
    marginRight: 10,
  },
  summaryTitle: { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.text },
  muted: { color: theme.colors.textLight, fontSize: theme.typography.fontSize.sm },

  smallBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 1 } }),
  },
  smallBtnText: { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: theme.spacing.md,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabBtnActive: {
    backgroundColor: theme.colors.white,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 1 } }),
  },
  tabText: { color: theme.colors.textLight },
  tabTextActive: { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },

  bankCard: { padding: theme.spacing.md, backgroundColor: theme.colors.white, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border },
  bankRight: { flex: 1, minWidth: 0 },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.border,
    marginRight: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  bankName: { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.text },
  bankDesc: { color: theme.colors.textLight, marginTop: 2, lineHeight: 18 },
  ratingWrap: { flexShrink: 0, alignItems: 'center', flexDirection: 'row' },

  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  metricCol: { flex: 1, alignItems: 'center', minWidth: 0 },
  metricValue: { fontFamily: theme.typography.fontFamily.bold, fontSize: 16 },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: theme.spacing.md },
  chip: { backgroundColor: theme.colors.background, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  chipText: { color: theme.colors.text },

  applyBtn: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  applyText: { color: theme.colors.white, fontFamily: theme.typography.fontFamily.medium },
});

export default BanksScreen;