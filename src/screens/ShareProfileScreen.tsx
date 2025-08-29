import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import QRCode from '../component/QRCode';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import api from '../utils/Api';
import Clipboard from '@react-native-clipboard/clipboard';

interface ShareData {
  share_code: string;
  expires_at: string;
  profile_url: string;
}

interface ShareProfileData {
  farmer: {
    name: string;
    carbon_grade: string;
    location: string;
    mrv_verified: boolean;
  };
  farm_stats: {
    total_area: number;
    carbon_credits_earned: number;
    verification_rate: number;
  };
  credit_score: number;
  share_expires_at: string;
}

const ShareProfileScreen: React.FC<any> = ({ navigation }) => {
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [profileData, setProfileData] = useState<ShareProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate share code on component mount
  useEffect(() => {
    generateShareCode();
  }, []);

  // Generate share code from backend
  const generateShareCode = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/profile/share/generate');
      console.log('Generate share code response:', response.data);
      
      if (response.data.success) {
        const data = response.data.data;
        setShareData({
          share_code: data.share_code,
          expires_at: data.expires_at,
          profile_url: data.profile_url
        });
        
        // Fetch profile data for sharing
        await fetchShareProfileData(data.share_code);
      } else {
        setError('Failed to generate share code');
      }
    } catch (error: any) {
      console.error('Error generating share code:', error.response?.data || error);
      setError('Failed to generate share code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile data for sharing
  const fetchShareProfileData = async (shareCode: string) => {
    try {
      const response = await api.get(`/profile/share/${shareCode}`);
      console.log('Share profile data response:', response.data);
      
      if (response.data.success) {
        setProfileData(response.data.data);
      } else {
        setError('Failed to fetch profile data');
      }
    } catch (error: any) {
      console.error('Error fetching share profile data:', error.response?.data || error);
      setError('Failed to fetch profile data');
    }
  };

  // Handle copy share link
  const handleShareLink = async () => {
    if (!shareData) return;
    
    try {
      // Copy to clipboard
      Clipboard.setString(shareData.profile_url);
      
      // Notify backend about copy action
      await api.post(`/profile/share/${shareData.share_code}/copy`);
      
      Alert.alert('Success', 'Share link copied to clipboard!');
    } catch (error: any) {
      console.error('Error copying share link:', error);
      Alert.alert('Error', 'Failed to copy share link');
    }
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!shareData?.expires_at) return 'Unknown';
    
    const now = new Date();
    const expiresAt = new Date(shareData.expires_at);
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  // Format expiration date
  const formatExpirationDate = () => {
    if (!shareData?.expires_at) return 'Unknown';
    
    const expiresAt = new Date(shareData.expires_at);
    return expiresAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[theme.colors.primary + '10', theme.colors.white]} 
          style={styles.gradient}
        >
          <Header title="Share Profile" onBack={() => navigation.goBack()} />
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Generating share code...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[theme.colors.primary + '10', theme.colors.white]} 
          style={styles.gradient}
        >
          <Header title="Share Profile" onBack={() => navigation.goBack()} />
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={48} color={theme.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={generateShareCode}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary + '10', theme.colors.white]} 
        style={styles.gradient}
      >
        <Header title="Share Profile" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Summary Card */}
          {profileData && (
            <View style={styles.profileSummaryCard}>
              <View style={styles.profileHeader}>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{profileData.farmer.name}</Text>
                  <View style={styles.profileBadges}>
                    <View style={styles.gradeBadge}>
                      <Icon name="star" size={14} color={theme.colors.primary} />
                      <Text style={styles.gradeText}>Grade {profileData.farmer.carbon_grade}</Text>
                    </View>
                    {profileData.farmer.mrv_verified && (
                      <View style={styles.verifiedBadge}>
                        <Icon name="shield-check" size={14} color={theme.colors.success} />
                        <Text style={styles.verifiedText}>MRV Verified</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.profileLocation}>{profileData.farmer.location}</Text>
                </View>
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profileData.farm_stats.total_area}</Text>
                  <Text style={styles.statLabel}>Hectares</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profileData.farm_stats.carbon_credits_earned}</Text>
                  <Text style={styles.statLabel}>Credits</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profileData.credit_score}</Text>
                  <Text style={styles.statLabel}>Score</Text>
                </View>
              </View>
            </View>
          )}

          {/* Share Code Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Share your credit profile</Text>
            <Text style={styles.subtitle}>Banks can scan QR or use code below</Text>

            <View style={styles.qrSection}>
              <QRCode 
                value={shareData?.profile_url || ''} 
                label="Scan to view profile" 
              />
            </View>

            <View style={styles.codeRow}>
              <Text style={styles.codeLabel}>Share Code</Text>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>{shareData?.share_code || 'Loading...'}</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={handleShareLink}>
                  <Icon name="content-copy" size={20} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              <Text style={styles.note}>
                Expires: {formatExpirationDate()}
              </Text>
              <Text style={styles.timeRemaining}>
                {getTimeRemaining()}
              </Text>
            </View>

            {/* Share Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleShareLink}>
                <Icon name="share-variant" size={20} color={theme.colors.primary} />
                <Text style={styles.actionText}>Share Link</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionBtn} onPress={generateShareCode}>
                <Icon name="refresh" size={20} color={theme.colors.primary} />
                <Text style={styles.actionText}>New Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  codeRow: {
    marginBottom: theme.spacing.lg,
  },
  codeLabel: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing.xs,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
  },
  codeText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  note: {
    marginTop: theme.spacing.xs,
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.xs,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    backgroundColor: theme.colors.primary + '10',
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  actionText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.error,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 12,
    backgroundColor: theme.colors.primary + '20',
    borderWidth: 1,
    borderColor: theme.colors.primary + '50',
  },
  retryButtonText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
  },
  profileSummaryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  profileBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  gradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: theme.spacing.xs,
  },
  gradeText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success + '10',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: theme.spacing.xs,
  },
  verifiedText: {
    color: theme.colors.success,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
  },
  profileLocation: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
  },
  statLabel: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
  timeRemaining: {
    marginTop: theme.spacing.xs,
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.xs,
    textAlign: 'center',
  },
});

export default ShareProfileScreen;


