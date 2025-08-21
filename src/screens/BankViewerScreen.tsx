import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import ButtonCustom from '../component/ButtonCustom';
import Card from '../component/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import InputCustom from '../component/InputCustom';
import CircularProgress from '../component/CircularProgress';

interface BankViewerScreenProps {
  navigation: any;
}

interface ProfileData {
  farmer: {
    name: string;
    location: string;
    phone: string;
  };
  season: {
    cropType: string;
    area: number;
    sowingDate: string;
    expectedYield: number;
  };
  scores: {
    imageScore: number;
    yieldRisk: number;
    creditScore: number;
    eligibleAmount: number;
  };
  history: {
    quantity: number;
    price: number;
    date: string;
  }[];
  blockchain: {
    txHash: string;
    chain: string;
    verified: boolean;
    timestamp: string;
  };
}

const BankViewerScreen: React.FC<BankViewerScreenProps> = ({ navigation }) => {
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [approved, setApproved] = useState<boolean | null>(null);

  const handleLookup = async () => {
    if (!txHash) {
      Alert.alert('Error', 'Please enter a transaction hash');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProfileData({
        farmer: {
          name: 'John Doe',
          location: 'Hanoi, Vietnam',
          phone: '+84 123 456 789',
        },
        season: {
          cropType: 'Rice',
          area: 2.5,
          sowingDate: '2024-01-15',
          expectedYield: 12.5,
        },
        scores: {
          imageScore: 85,
          yieldRisk: 75,
          creditScore: 72,
          eligibleAmount: 500,
        },
        history: [
          {
            quantity: 10,
            price: 450,
            date: '2023-12-01',
          },
          {
            quantity: 11.2,
            price: 420,
            date: '2023-08-15',
          },
          {
            quantity: 9.8,
            price: 480,
            date: '2023-04-20',
          },
        ],
        blockchain: {
          txHash: txHash,
          chain: 'Polygon',
          verified: true,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error looking up profile:', error);
      Alert.alert('Error', 'Failed to lookup profile');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    Alert.alert(
      'Confirm Approval',
      'Are you sure you want to approve this loan application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => setApproved(true),
        },
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Confirm Rejection',
      'Are you sure you want to reject this loan application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => setApproved(false),
        },
      ]
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile Viewer" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.searchCard}>
            <InputCustom
              label="Transaction Hash"
              placeholder="Enter TX hash or profile ID"
              value={txHash}
              onChangeText={setTxHash}
              error={undefined}
              required
              leftIcon="key-chain"
              containerStyle={styles.input}
            />
            <ButtonCustom
              title="Lookup Profile"
              onPress={handleLookup}
              loading={loading}
            />
          </Card>

          {profileData && (
            <>
              <Card style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <Icon
                    name="account-circle"
                    size={48}
                    color={theme.colors.primary}
                  />
                  <View style={styles.profileInfo}>
                    <Text style={styles.farmerName}>{profileData.farmer.name}</Text>
                    <Text style={styles.farmerLocation}>
                      {profileData.farmer.location}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.scoreGrid}>
                  <View style={styles.scoreItem}>
                    <CircularProgress
                      size={80}
                      strokeWidth={8}
                      progress={profileData.scores.creditScore}
                      color={theme.colors.primary}>
                      <Text style={styles.scoreValue}>
                        {profileData.scores.creditScore}
                      </Text>
                    </CircularProgress>
                    <Text style={styles.scoreLabel}>Credit Score</Text>
                  </View>

                  <View style={styles.scoreItem}>
                    <CircularProgress
                      size={80}
                      strokeWidth={8}
                      progress={profileData.scores.imageScore}
                      color={theme.colors.success}>
                      <Text style={styles.scoreValue}>
                        {profileData.scores.imageScore}
                      </Text>
                    </CircularProgress>
                    <Text style={styles.scoreLabel}>Image Score</Text>
                  </View>

                  <View style={styles.scoreItem}>
                    <CircularProgress
                      size={80}
                      strokeWidth={8}
                      progress={profileData.scores.yieldRisk}
                      color={theme.colors.warning}>
                      <Text style={styles.scoreValue}>
                        {profileData.scores.yieldRisk}
                      </Text>
                    </CircularProgress>
                    <Text style={styles.scoreLabel}>Yield Risk</Text>
                  </View>
                </View>

                <View style={styles.eligibilityContainer}>
                  <Text style={styles.eligibilityLabel}>Eligible Loan Amount</Text>
                  <Text style={styles.eligibilityAmount}>
                    ${profileData.scores.eligibleAmount}
                  </Text>
                </View>
              </Card>

              <Card style={styles.detailsCard}>
                <Text style={styles.sectionTitle}>Season Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Crop Type</Text>
                  <Text style={styles.detailValue}>
                    {profileData.season.cropType}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Area</Text>
                  <Text style={styles.detailValue}>
                    {profileData.season.area} ha
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sowing Date</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(profileData.season.sowingDate)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Expected Yield</Text>
                  <Text style={styles.detailValue}>
                    {profileData.season.expectedYield} tons
                  </Text>
                </View>
              </Card>

              <Card style={styles.historyCard}>
                <Text style={styles.sectionTitle}>Harvest History</Text>
                {profileData.history.map((harvest, index) => (
                  <View
                    key={index}
                    style={[
                      styles.historyItem,
                      index < profileData.history.length - 1 &&
                        styles.historyDivider,
                    ]}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyDate}>
                        {formatDate(harvest.date)}
                      </Text>
                      <Text style={styles.historyAmount}>
                        ${(harvest.quantity * harvest.price).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.historyDetails}>
                      <Text style={styles.historyDetail}>
                        {harvest.quantity} tons @ ${harvest.price}/ton
                      </Text>
                    </View>
                  </View>
                ))}
              </Card>

              {approved === null ? (
                <View style={styles.actionButtons}>
                  <ButtonCustom
                    title="Approve"
                    onPress={handleApprove}
                    style={styles.approveButton}
                  />
                  <ButtonCustom
                    title="Reject"
                    onPress={handleReject}
                    variant="outline"
                    style={styles.rejectButton}
                  />
                </View>
              ) : (
                <Card style={styles.statusCard}>
                  <View style={styles.statusHeader}>
                    <Icon
                      name={approved ? 'check-circle' : 'close-circle'}
                      size={32}
                      color={
                        approved ? theme.colors.success : theme.colors.error
                      }
                    />
                    <View style={styles.statusInfo}>
                      <Text style={styles.statusTitle}>
                        {approved ? 'Approved' : 'Rejected'}
                      </Text>
                      <Text style={styles.statusTime}>
                        {formatDate(new Date().toISOString())}
                      </Text>
                    </View>
                  </View>
                </Card>
              )}
            </>
          )}
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
  searchCard: {
    marginBottom: theme.spacing.xl,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  profileCard: {
    marginBottom: theme.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  farmerName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  farmerLocation: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  scoreGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.xl,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  scoreLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
  },
  eligibilityContainer: {
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  eligibilityLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  eligibilityAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.success,
  },
  detailsCard: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  detailLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
  detailValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  historyCard: {
    marginBottom: theme.spacing.xl,
  },
  historyItem: {
    paddingVertical: theme.spacing.md,
  },
  historyDivider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  historyDate: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  historyAmount: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.success,
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyDetail: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  approveButton: {
    flex: 1,
  },
  rejectButton: {
    flex: 1,
  },
  statusCard: {
    marginBottom: theme.spacing.xl,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  statusTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statusTime: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
});

export default BankViewerScreen;
