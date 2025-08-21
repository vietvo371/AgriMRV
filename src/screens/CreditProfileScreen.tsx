import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList, TabScreenProps, TabScreenComponent } from '../navigation/types';
import { theme } from '../theme/colors';
import { ThemedText } from '../component/ThemedText';
import Card from '../component/Card';
import StatsCard from '../component/StatsCard';
import { Shadow } from 'react-native-shadow-2';

type Props = CompositeScreenProps<
  TabScreenProps<'Analytics'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type CreditProfileScreenProps = Props;

const CreditProfileScreen: React.FC<Props> = ({ route }) => {
  const profileId = (route.params as any)?.profileId || 'default';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Shadow startColor={'#00000010'} offset={[0, 2]} style={styles.fullWidth}>
            <Card style={styles.headerCard}>
              <ThemedText style={styles.title}>Credit Profile Analysis</ThemedText>
              <ThemedText style={styles.subtitle}>Profile ID: {profileId}</ThemedText>
            </Card>
          </Shadow>

          <View style={styles.statsRow}>
            <StatsCard title="Image Score" value={85} subtitle="Field Verification" icon="image-check" />
            <StatsCard title="Yield Risk" value={75} subtitle="Low Risk" icon="sprout" />
            <StatsCard title="Credit Score" value={72} subtitle="Grade B" icon="credit-card-check" />
          </View>

          <Shadow startColor={'#00000010'} offset={[0, 2]} style={styles.fullWidth}>
            <Card style={styles.sectionCard}>
              <ThemedText style={styles.sectionTitle}>Score Breakdown</ThemedText>
              <View style={styles.breakdownItem}>
                <ThemedText>Image Verification (30%)</ThemedText>
                <ThemedText>25.5 points</ThemedText>
              </View>
              <View style={styles.breakdownItem}>
                <ThemedText>Delivery Consistency (25%)</ThemedText>
                <ThemedText>18.75 points</ThemedText>
              </View>
              <View style={styles.breakdownItem}>
                <ThemedText>Yield Risk Score (20%)</ThemedText>
                <ThemedText>15.0 points</ThemedText>
              </View>
              <View style={styles.breakdownItem}>
                <ThemedText>Repayment History (10%)</ThemedText>
                <ThemedText>7.0 points</ThemedText>
              </View>
              <View style={styles.breakdownItem}>
                <ThemedText>Coop Membership (10%)</ThemedText>
                <ThemedText>5.0 points</ThemedText>
              </View>
              <View style={styles.breakdownItem}>
                <ThemedText>Training Completion (5%)</ThemedText>
                <ThemedText>0.75 points</ThemedText>
              </View>
            </Card>
          </Shadow>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  headerCard: {
    borderRadius: 20,
    padding: theme.spacing.lg,
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  sectionCard: {
    borderRadius: 20,
    padding: theme.spacing.lg,
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: theme.colors.text,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  fullWidth: {
    width: '100%',
  },
});

export default CreditProfileScreen;