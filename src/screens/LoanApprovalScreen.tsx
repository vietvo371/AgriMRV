import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList, TabScreenProps, TabScreenComponent } from '../navigation/types';
import { theme } from '../theme/colors';
import { ThemedText } from '../component/ThemedText';
import ButtonCustom from '../component/ButtonCustom';
import Card from '../component/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = CompositeScreenProps<
  TabScreenProps<'Applications'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type LoanApprovalScreenProps = Props;

interface LoanApplication {
  id: string;
  farmerName: string;
  creditScore: number;
  requestedAmount: number;
  status: 'pending' | 'approved' | 'rejected';
}

const LoanApprovalScreen: React.FC<Props> = ({ navigation }) => {
  const [applications] = useState<LoanApplication[]>([
    {
      id: 'APP001',
      farmerName: 'Nguyen Van A',
      creditScore: 72,
      requestedAmount: 500,
      status: 'pending',
    },
    {
      id: 'APP002',
      farmerName: 'Tran Thi B',
      creditScore: 85,
      requestedAmount: 1000,
      status: 'pending',
    },
  ]);

  const handleViewProfile = (id: string) => {
    (navigation as any).navigate('CreditProfile', { profileId: id });
  };

  const renderApplication = (app: LoanApplication) => (
    <Card key={app.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <ThemedText style={styles.farmerName}>{app.farmerName}</ThemedText>
          <ThemedText style={styles.appId}>Application ID: {app.id}</ThemedText>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
          <ThemedText style={styles.badgeText}>Pending</ThemedText>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <ThemedText>Credit Score:</ThemedText>
          <ThemedText style={styles.scoreText}>{app.creditScore}/100</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText>Requested Amount:</ThemedText>
          <ThemedText>${app.requestedAmount}</ThemedText>
        </View>
      </View>

      <View style={styles.cardActions}>
        <ButtonCustom
          title="View Profile"
          onPress={() => handleViewProfile(app.id)}
          variant="outline"
          style={styles.actionButton}
        />
        <View style={styles.approvalButtons}>
          <ButtonCustom
            title="Reject"
            onPress={() => {}}
            variant="outline"
            icon="close"
            style={{ ...styles.iconButton, ...styles.rejectButton }}
          />
          <ButtonCustom
            title="Approve"
            onPress={() => {}}
            variant="primary"
            icon="check"
            style={{ ...styles.iconButton, ...styles.approveButton }}
          />
        </View>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Loan Applications</ThemedText>
        <ThemedText style={styles.subtitle}>
          {applications.length} pending applications
        </ThemedText>
      </View>

      <View style={styles.content}>
        {applications.map(renderApplication)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
  content: {
    padding: 15,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  appId: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  cardBody: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    marginRight: 10,
  },
  approvalButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    marginLeft: 10,
  },
  approveButton: {
    backgroundColor: theme.colors.success,
  },
  rejectButton: {
    borderColor: theme.colors.error,
  },
});

export default LoanApprovalScreen;