import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, Image, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import Card from '../component/Card';
import Badge from '../component/Badge';
import { mockAiResults, mockFarmProfiles, mockImages, mockUsers } from '../utils/mockData';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'AiAnalysisDetail'>;

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <View style={styles.progressTrack}>
    <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, value))}%` }]} />
  </View>
);

const AiAnalysisDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { analysisId } = route.params;
  const a = mockAiResults.find(x => String(x.profile_id) === analysisId)!;
  const profile = mockFarmProfiles.find(p => p.profile_id === a.profile_id)!;
  const user = mockUsers.find(u => u.user_id === profile.user_id)!;
  const image = mockImages.find(img => img.profile_id === profile.profile_id);

  const confidence = a.credit_score || a.image_score;
  const status = a.yield_risk < 30 ? 'verified' : a.yield_risk < 60 ? 'needs_review' : 'processing';
  const findings = {
    cropHealth: Math.min(100, Math.round(a.image_score)),
    authenticity: Math.min(100, Math.round(80 + a.image_score / 5)),
    maturity: Math.min(100, Math.round(70 + a.credit_score / 4)),
    quality: Math.min(100, Math.round(75 + a.credit_score / 5)),
  };
  const insights = [
    'AI detected strong crop health signals',
    'No signs of pest damage in images',
    'Harvest timing appears optimal',
  ];
  const recommendations = [
    'Maintain current irrigation schedule',
    'Consider premium market channels',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="AI Analysis Details" onBack={() => navigation.goBack()} />
      <LinearGradient colors={[theme.colors.secondary + '30', theme.colors.white]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header card */}
          <View style={[styles.headerCard, styles.elevation]}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{profile.crop_type}</Text>
                <View style={styles.rowStart}>
                  <Icon name="map-marker" size={16} color={theme.colors.textLight} />
                  <Text style={[styles.subtitle, { marginLeft: 6 }]}>{user.org_name}</Text>
                </View>
              </View>
              <Badge text={status.replace('_',' ')} variant={status === 'verified' ? 'success' : status === 'needs_review' ? 'warning' : 'info'} size="small" />
            </View>
            {!!image?.image_url && <Image source={{ uri: image.image_url }} style={styles.heroImage} />}
          </View>

          {/* Confidence */}
          <View style={[styles.section, styles.elevation]}>
            <View style={styles.sectionHeader}>
              <Icon name="brain" size={22} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>AI Confidence Score</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.mutedText}>Overall Confidence</Text>
              <Text style={styles.confidence}>{confidence}%</Text>
            </View>
            <ProgressBar value={confidence} />
          </View>

          {/* Image analysis */}
          <View style={[styles.section, styles.elevation]}>
            <View style={styles.sectionHeader}>
              <Icon name="camera" size={22} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Image Analysis</Text>
            </View>
            {([['Crop Health', findings.cropHealth], ['Authenticity', findings.authenticity], ['Maturity', findings.maturity], ['Quality', findings.quality]] as const).map(([label,val]) => (
              <View key={label} style={{ marginTop: 8 }}>
                <View style={styles.rowBetween}><Text style={styles.mutedText}>{label}</Text><Text style={styles.metricValue}>{val}%</Text></View>
                <ProgressBar value={val} />
              </View>
            ))}
          </View>

          {/* Insights */}
          <View style={[styles.section, styles.elevation]}>
            <View style={styles.sectionHeader}>
              <Icon name="eye-outline" size={22} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>AI Insights</Text>
            </View>
            <View style={{ gap: 8 }}>
              {insights.map((text, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <View style={styles.dot} />
                  <Text style={styles.body}>{text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recommendations */}
          <View style={[styles.section, styles.elevation]}>
            <View style={styles.sectionHeader}>
              <Icon name="trending-up" size={22} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Recommendations</Text>
            </View>
            <View style={{ gap: 8 }}>
              {recommendations.map((text, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
                  <Text style={styles.body}>{text}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: theme.spacing.lg },
  headerCard: { backgroundColor: theme.colors.white, borderRadius: 16, padding: theme.spacing.lg, marginBottom: theme.spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: theme.typography.fontFamily.bold, fontSize: theme.typography.fontSize.xl, color: theme.colors.text },
  subtitle: { color: theme.colors.textLight },
  card: { },
  cardTitle: { fontFamily: theme.typography.fontFamily.medium, marginBottom: theme.spacing.md, color: theme.colors.text },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowStart: { flexDirection: 'row', alignItems: 'center' },
  mutedText: { color: theme.colors.textLight },
  confidence: { fontFamily: theme.typography.fontFamily.bold, fontSize: 22 },
  progressTrack: { height: 8, backgroundColor: theme.colors.border, borderRadius: 6, overflow: 'hidden', marginTop: 6 },
  progressFill: { height: '100%', backgroundColor: theme.colors.primary },
  metricValue: { fontFamily: theme.typography.fontFamily.medium },
  heroImage: { width: '100%', height: 180, borderRadius: 12, marginTop: theme.spacing.md, backgroundColor: theme.colors.border },
  section: { backgroundColor: theme.colors.white, borderRadius: 16, padding: theme.spacing.lg, marginBottom: theme.spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.text },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.primary, marginTop: 6 },
  body: { color: theme.colors.text },
  elevation: { ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 3 } }) },
});

export default AiAnalysisDetailScreen;


