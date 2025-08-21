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
import Badge from '../component/Badge';
import RecordCard from '../component/RecordCard';
import { dashboardApi, UserProfile, DashboardStats, Batch } from '../utils/Api';
import LoadingOverlay from '../component/LoadingOverlay';
import { LinearGradient } from 'react-native-linear-gradient';
import BatchCard from '../component/BatchCard';

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
  const handleCreateRecord = () => {
    navigation.navigate('CreateRecord');
  };

  const handleViewAllRecords = () => {
    navigation.navigate('RecordList');
  };


  const handleRecordPress = (batchId: string) => {
    navigation.navigate('RecordDetail', { recordId: batchId });
  };

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading dashboard..." />;
  }

  // Derived counts for the Crop Records header stats
  const totalRecords = recentBatches.length;
  const verifiedCount = recentBatches.filter(b => b.status === 'completed').length;
  const pendingCount = totalRecords - verifiedCount;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary + '20', theme.colors.white]}
        style={styles.gradient}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Title + Add Record */}
        <View style={styles.recordsHeaderRow}>
          <View style={styles.recordsHeaderLeft}>
            <Text style={styles.recordsTitle}>Crop Records</Text>
            <Text style={styles.recordsSubtitle}>Track and verify your harvests</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleCreateRecord}>
            <Icon name="plus" size={18} color={theme.colors.white} />
            <Text style={styles.addButtonText}>Add Record</Text>
          </TouchableOpacity>
        </View>

        {/* Compact stats */}
        <View style={styles.miniStatsRow}>
          <View style={styles.miniStatCard}>
            <View style={styles.miniStatInner}>
              <View style={styles.miniStatText}>
                <Text style={[styles.miniStatValue, { color: theme.colors.primary }]} numberOfLines={1}>
                  {totalRecords}
                </Text>
                <Text style={styles.miniStatLabel} numberOfLines={2}>Total Records</Text>
              </View>
            </View>
          </View>
          <View style={styles.miniStatCard}>
            <View style={styles.miniStatInner}>
              <View style={styles.miniStatText}>
                <Text style={[styles.miniStatValue, { color: theme.colors.success }]} numberOfLines={1}>
                  {verifiedCount}
                </Text>
                <Text style={styles.miniStatLabel} numberOfLines={2}>Verified</Text>
              </View>
            </View>
          </View>
          <View style={styles.miniStatCard}>
            <View style={styles.miniStatInner}>
              <View style={styles.miniStatText}>
                <Text style={[styles.miniStatValue, { color: theme.colors.info }]} numberOfLines={1}>
                  {pendingCount}
                </Text>
                <Text style={styles.miniStatLabel} numberOfLines={2}>Pending</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Records list */}
        <View style={styles.recentBatchesSection}>
          <View style={styles.sectionHeaderContainer}>
            <View>
              <Text style={styles.sectionTitle}>Recent Records</Text>
            </View>
            <TouchableOpacity 
              onPress={handleViewAllRecords} 
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.recordsList}>
          {recentBatches.map((batch) => (
            <RecordCard key={batch.id} batch={batch as any} onPress={() => handleRecordPress(batch.id)} />
          ))}
          {recentBatches.length === 0 && (
            <Text style={styles.emptyText}>No crop records found</Text>
          )}
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
    backgroundColor: '#F8FAFC',
  },
  viewAllText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginRight: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: 4,
  },
  gradient: {
    flex: 1,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  recordsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  recordsHeaderLeft: {
    flex: 1,
  },
  recordsTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
  },
  recordsSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 6,
  },
  addButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.medium,
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    minHeight: 88,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  miniStatInner: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    // height: '100%',
  },
  miniIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniStatText: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  miniStatValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 22,
    textAlign: 'center',
  },
  miniStatLabel: {
    marginTop: 6,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  recordsList: {
    gap: theme.spacing.md,
  },
  recordCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  recordLeftIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.secondary + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  recordHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  recordTitle: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  recordMeta: {
    color: theme.colors.text,
  },
  recordSubmeta: {
    marginTop: 2,
    color: theme.colors.textLight,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
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
});

export default DashboardScreen; 