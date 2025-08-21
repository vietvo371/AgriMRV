import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import StatsCard from '../component/StatsCard';
import BatchCard from '../component/BatchCard';
import { dashboardApi, UserProfile, DashboardStats, Batch } from '../utils/Api';
import LoadingOverlay from '../component/LoadingOverlay';

interface DashboardScreenProps {
  navigation: any;
}

const defaultProfileImage = require('../assets/images/avt.png');

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentBatches, setRecentBatches] = useState<Batch[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const loadDashboardData = async () => {
    try {
      const [profile, stats, batches] = await Promise.all([
        dashboardApi.getUserProfile(),
        dashboardApi.getDashboardStats(),
        dashboardApi.getRecentBatches(),
        // dashboardApi.getUnreadNotificationCount(),
      ]);

      setUserProfile(profile);
      setDashboardStats(stats);
      setRecentBatches(batches);
      console.log(batches);
      console.log(stats);
      console.log(profile);
      // setUnreadNotifications(notifications);
    } catch (error) {
      console.log('Error loading dashboard data:', error);
      // Thêm xử lý lỗi ở đây (ví dụ: hiển thị thông báo lỗi)
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  useEffect(() => {
    loadDashboardData();
  }, []);
  const handleCreateBatch = () => {
    navigation.navigate('CreateBatch');
  };

  const handleViewAllBatches = () => {
    navigation.navigate('BatchList');
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile');
  };

  const handleBatchPress = (batchId: string) => {
    navigation.navigate('BatchDetail', { batchId });
  };

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading dashboard..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleViewProfile} style={styles.userSection}>
            <Image 
              source={userProfile?.profile_image ? { uri: userProfile.profile_image } : defaultProfileImage} 
              style={styles.avatar} 
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userProfile?.full_name || 'Loading...'}</Text>
              <View style={styles.farmInfo}>
                <Icon name="home-variant" size={16} color={theme.colors.primary} />
                <Text style={styles.farmName}>{userProfile?.farm_name || 'farm...'}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notificationButton}>
            <Icon name="bell-outline" size={24} color={theme.colors.text} />
            {unreadNotifications > 0 && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            onPress={handleCreateBatch}>
            <Icon name="plus-circle-outline" size={28} color={theme.colors.white} />
            <Text style={styles.actionText}>New Batch</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]} 
            onPress={handleViewAllBatches}>
            <Icon name="format-list-bulleted" size={28} color={theme.colors.white} />
            <Text style={styles.actionText}>View All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.accentButton]} 
            onPress={() => navigation.navigate('QRGenerate', { batchId: '1' })}>
            <Icon name="qrcode" size={28} color={theme.colors.white} />
            <Text style={styles.actionText}>Generate QR</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeaderContainer}>
            <View>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.sectionSubtitle}>Track your performance</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            {dashboardStats && (
              <>
                <StatsCard
                  title="Total Batches"
                  subtitle="Active batches"
                  value={dashboardStats.batches.total.toString()}
                  icon="cube-outline"
                  iconColor={theme.colors.primary}
                  trend={dashboardStats.batches.trend}
                  style={styles.statsCard}
                />
                <StatsCard
                  title="QR Scans"
                  subtitle="Last 30 days"
                  value={dashboardStats.qr_scans.total.toString()}
                  icon="qrcode-scan"
                  iconColor={theme.colors.secondary}
                  trend={dashboardStats.qr_scans.trend}
                  style={styles.statsCard}
                />
                <StatsCard
                  title="Products"
                  subtitle="Types registered"
                  value={dashboardStats.products.total.toString()}
                  icon="sprout-outline"
                  iconColor={theme.colors.accent}
                  trend={dashboardStats.products.trend}
                  style={styles.statsCard}
                />
              </>
            )}
          </View>
        </View>

        {/* Recent Batches */}
        <View style={styles.recentBatchesSection}>
          <View style={styles.sectionHeaderContainer}>
            <View>
              <Text style={styles.sectionTitle}>Recent Batches</Text>
            </View>
            <TouchableOpacity 
              onPress={handleViewAllBatches} 
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.batchesContainer}>
            {recentBatches.map(batch => (
              <BatchCard
                key={batch.id}
                batch={batch}
                onPress={() => handleBatchPress(batch.id)}
              />
            ))}
            {recentBatches.length === 0 && (
              <Text style={styles.emptyText}>No recent batches found</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  userInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  userName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: 2,
  },
  farmInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmName: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  accentButton: {
    backgroundColor: theme.colors.accent,
  },
  actionText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
    marginTop: 8,
  },
  statsSection: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 6,
  },
  periodText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statsCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: theme.colors.background,
  },
  recentBatches: {
    marginBottom: theme.spacing.xl,
  },
  recentBatchesSection: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  batchesContainer: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  viewAllText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginRight: 4,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
  },
});

export default DashboardScreen; 