import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  Clipboard,
} from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import ButtonCustom from '../component/ButtonCustom';
import Card from '../component/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingOverlay from '../component/LoadingOverlay';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BlockchainAnchor'>;

interface AnchorData {
  txHash: string;
  chain: string;
  verified: boolean;
  timestamp: string;
  profileHash: string;
}

const BlockchainAnchorScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { profileId, score } = route.params;
  const [loading, setLoading] = useState(false);
  const [anchoring, setAnchoring] = useState(false);
  const [anchorData, setAnchorData] = useState<AnchorData | null>(null);

  useEffect(() => {
    checkAnchorStatus();
  }, []);

  const checkAnchorStatus = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
      setAnchorData({
        txHash: '0x1234...5678',
        chain: 'Polygon',
        verified: true,
        timestamp: new Date().toISOString(),
        profileHash: 'Qm1234...5678',
      });
    } catch (error) {
      console.error('Error checking anchor status:', error);
      Alert.alert('Error', 'Failed to check anchor status');
    } finally {
      setLoading(false);
    }
  };

  const handleAnchor = async () => {
    setAnchoring(true);
    try {
      // Simulate anchoring process
      await new Promise<void>((resolve) => setTimeout(resolve, 3000));
      setAnchorData({
        txHash: '0x9876...5432',
        chain: 'Polygon',
        verified: true,
        timestamp: new Date().toISOString(),
        profileHash: 'Qm9876...5432',
      });
    } catch (error) {
      console.error('Error anchoring data:', error);
      Alert.alert('Error', 'Failed to anchor data to blockchain');
    } finally {
      setAnchoring(false);
    }
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Success', 'Copied to clipboard');
  };

  const handleShare = async () => {
    if (!anchorData) return;

    try {
      const shareUrl = `https://agricred.com/verify/${anchorData.txHash}`;
      await Share.share({
        message: `View my agricultural credit profile: ${shareUrl}`,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share profile');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Blockchain Anchor"
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {!anchorData ? (
            <Card style={styles.notAnchoredCard}>
              <Icon
                name="link-variant-off"
                size={48}
                color={theme.colors.textLight}
              />
              <Text style={styles.notAnchoredTitle}>Not Anchored</Text>
              <Text style={styles.notAnchoredText}>
                Your profile is not yet anchored to the blockchain. Anchor it now
                to make it verifiable and shareable.
              </Text>
              <ButtonCustom
                title="Anchor to Blockchain"
                onPress={handleAnchor}
                loading={anchoring}
                style={styles.anchorButton}
              />
            </Card>
          ) : (
            <>
              <Card style={styles.statusCard}>
                <View style={styles.statusHeader}>
                  <View style={styles.statusIcon}>
                    <Icon
                      name={anchorData.verified ? 'check-circle' : 'alert-circle'}
                      size={32}
                      color={
                        anchorData.verified
                          ? theme.colors.success
                          : theme.colors.warning
                      }
                    />
                  </View>
                  <View style={styles.statusInfo}>
                    <Text style={styles.statusTitle}>
                      {anchorData.verified ? 'Verified' : 'Pending Verification'}
                    </Text>
                    <Text style={styles.statusTime}>
                      Anchored on {formatDate(anchorData.timestamp)}
                    </Text>
                  </View>
                </View>
              </Card>

              <Card style={styles.detailsCard}>
                <Text style={styles.detailsTitle}>Anchor Details</Text>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Chain</Text>
                  <View style={styles.chainBadge}>
                    <Icon name="ethereum" size={16} color={theme.colors.primary} />
                    <Text style={styles.chainText}>{anchorData.chain}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Transaction Hash</Text>
                  <TouchableOpacity
                    style={styles.hashContainer}
                    onPress={() => handleCopy(anchorData.txHash)}>
                    <Text style={styles.hashText}>{anchorData.txHash}</Text>
                    <Icon name="content-copy" size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Profile Hash</Text>
                  <TouchableOpacity
                    style={styles.hashContainer}
                    onPress={() => handleCopy(anchorData.profileHash)}>
                    <Text style={styles.hashText}>{anchorData.profileHash}</Text>
                    <Icon name="content-copy" size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
              </Card>

              <ButtonCustom
                title="Share Profile"
                onPress={handleShare}
                style={styles.shareButton}
                icon="share-variant"
              />
            </>
          )}
        </View>
      </ScrollView>
      <LoadingOverlay visible={loading} message="Checking anchor status..." />
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
  notAnchoredCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  notAnchoredTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  notAnchoredText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  anchorButton: {
    width: '100%',
  },
  statusCard: {
    marginBottom: theme.spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.success + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  statusInfo: {
    flex: 1,
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
  detailsCard: {
    marginBottom: theme.spacing.xl,
  },
  detailsTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  detailItem: {
    marginBottom: theme.spacing.lg,
  },
  detailLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  chainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  chainText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  hashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.border + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  hashText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  shareButton: {
    marginTop: theme.spacing.md,
  },
});

export default BlockchainAnchorScreen;
