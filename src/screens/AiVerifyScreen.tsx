import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, Platform, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Badge from '../component/Badge';
import Card from '../component/Card';
import LoadingOverlay from '../component/LoadingOverlay';
import { mockAiResults, mockFarmProfiles, mockImages, mockUsers } from '../utils/mockData';
import LinearGradient from 'react-native-linear-gradient';
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

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <View style={styles.progressTrack}>
    <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, value))}%` }]} />
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

  const selected = selectedId ? analyses.find((a) => a.id === selectedId) || null : null;

  if (loading) return <LoadingOverlay visible={true} message="Loading AI verification..." />;

  // On card click, go to detail screen

  // List view
  const verified = analyses.filter(a => a.status === 'verified').length;
  const needsReview = analyses.filter(a => a.status === 'needs_review').length;
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
        colors={[theme.colors.secondary + '30', theme.colors.white]}
        style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerRowBetween}>
            <View>
              <Text style={styles.title}>AI Verification</Text>
              <Text style={styles.subtitle}>AI analysis results for your crop submissions</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.grid3}>
            <Card style={styles.centerCard}>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>{verified}</Text>
              <Text style={styles.mutedText}>Verified</Text>
            </Card>
            <Card style={styles.centerCard}>
              <Text style={[styles.statValue, { color: theme.colors.warning }]}>{needsReview}</Text>
              <Text style={styles.mutedText}>Needs Review</Text>
            </Card>
            <Card style={styles.centerCard}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>{avgConfidence}%</Text>
              <Text style={styles.mutedText}>Avg Confidence</Text>
            </Card>
          </View>

          {/* Search + Filters */}
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={20} color={theme.colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search crop or location..."
              placeholderTextColor={theme.colors.textLight}
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <View style={styles.filterRow}>
            {(['all', 'verified', 'needs_review', 'processing'] as const).map(key => (
              <TouchableOpacity
                key={key}
                style={[styles.chip, statusFilter === key && styles.chipActive]}
                onPress={() => setStatusFilter(key)}
              >
                <Text style={[styles.chipText, statusFilter === key && styles.chipTextActive]}>{key.replace('_', ' ').toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* List */}
          <View style={{ gap: 12 }}>
            {filtered.map(a => (
              <Card key={a.id} style={styles.listCard}>
                <TouchableOpacity style={styles.listRow} onPress={() => navigation.navigate('AiAnalysisDetail', { analysisId: a.id })}>
                  {!!a.imageUrl && <Image source={{ uri: a.imageUrl }} style={styles.thumb} />}
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.bold}>{a.cropType}</Text>
                      <Badge text={a.status.replace('_', ' ')} variant={statusToVariant(a.status)} size="small" />
                    </View>
                    <View style={styles.rowStart}>
                      <Icon name="map-marker" size={14} color={theme.colors.textLight} />
                      <Text style={[styles.body, { color: theme.colors.textLight, marginLeft: 4 }]}>{a.location}</Text>
                    </View>
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1, marginRight: 12 }}>
                        <View style={styles.rowBetween}>
                          <Text style={styles.body}>Confidence</Text>
                          <Text style={styles.bold}>{a.confidence}%</Text>
                        </View>
                        <View style={styles.progressTrackThin}><View style={[styles.progressFill, { width: `${a.confidence}%`, backgroundColor: a.confidence >= 85 ? theme.colors.success : a.confidence >= 70 ? theme.colors.warning : theme.colors.error }]} /></View>
                      </View>
                      <Text style={styles.body}>Impact: <Text style={[styles.bold, { color: theme.colors.primary }]}>+{a.creditImpact} pts</Text></Text>
                    </View>
                    <Text style={[styles.mutedText, { marginTop: 2 }]}>Analyzed {new Date(a.analysisDate).toLocaleDateString()}</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
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
  scrollContent: { padding: theme.spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: theme.spacing.lg },
  headerRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  backBtn: { paddingVertical: 4, paddingRight: 8 },
  backText: { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.medium },
  title: { fontFamily: theme.typography.fontFamily.bold, fontSize: theme.typography.fontSize.xl, color: theme.colors.text },
  subtitle: { color: theme.colors.textLight },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary + '10', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  card: { marginBottom: theme.spacing.lg },
  cardTitle: { fontFamily: theme.typography.fontFamily.medium, marginBottom: theme.spacing.md, color: theme.colors.text },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowStart: { flexDirection: 'row', alignItems: 'center' },
  confidence: { fontFamily: theme.typography.fontFamily.bold, fontSize: 22 },
  splitRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: theme.spacing.md },
  centerCol: { alignItems: 'center' },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricBlock: { flexBasis: '48%' },
  metricValue: { fontFamily: theme.typography.fontFamily.medium },
  progressTrack: { height: 8, backgroundColor: theme.colors.border, borderRadius: 6, overflow: 'hidden', marginTop: 6 },
  progressFill: { height: '100%', backgroundColor: theme.colors.primary },
  tabsRow: { flexDirection: 'row', gap: 12, marginTop: theme.spacing.md },
  tab: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, backgroundColor: theme.colors.background, color: theme.colors.text },
  tabActive: { backgroundColor: theme.colors.primary + '15', color: theme.colors.primary },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.primary, marginTop: 6 },
  body: { fontFamily: theme.typography.fontFamily.regular, color: theme.colors.text },
  mutedText: { color: theme.colors.textLight, fontSize: theme.typography.fontSize.sm },
  bold: { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.text },
  grid3: { flexDirection: 'row', gap: 12, marginBottom: theme.spacing.lg },
  centerCard: { alignItems: 'center', padding: theme.spacing.lg, flex: 1, backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.lg },
  statValue: { fontFamily: theme.typography.fontFamily.bold, fontSize: 22 },
  listCard: { padding: theme.spacing.md },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 64, height: 64, borderRadius: 12, backgroundColor: theme.colors.border },
  heroImage: { width: '100%', height: 180, borderRadius: 12, marginBottom: theme.spacing.md, backgroundColor: theme.colors.border },
  ctaBtn: { marginTop: theme.spacing.md, paddingVertical: 10, alignItems: 'center', borderRadius: 8, backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.warning },
  ctaText: { color: theme.colors.warning, fontFamily: theme.typography.fontFamily.medium },
  gradient: { flex: 1 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.colors.white, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginBottom: theme.spacing.md, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 } }) },
  searchInput: { flex: 1, color: theme.colors.text },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: theme.spacing.lg },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: theme.colors.background },
  chipActive: { backgroundColor: theme.colors.primary + '15' },
  chipText: { color: theme.colors.text },
  chipTextActive: { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.medium },
  progressTrackThin: { height: 6, backgroundColor: theme.colors.border, borderRadius: 6, overflow: 'hidden', marginTop: 4 },
});

export default AiVerifyScreen;