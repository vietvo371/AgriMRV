import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import ImagePicker from '../component/ImagePicker';
import ButtonCustom from '../component/ButtonCustom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../component/Card';
import LinearGradient from 'react-native-linear-gradient';
import ModalCustom from '../component/ModalCustom';
import Clipboard from '@react-native-clipboard/clipboard';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [isEditing] = useState(false);
  const [loading] = useState(false);
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'farm' | 'achievements'>('personal');
  
  const [profileData, setProfileData] = useState<any>({
    farmer: {
      name: 'Nguyễn Văn An',
      avatar: 'https://via.placeholder.com/150',
      carbonGrade: 'B',
      joinDate: '2023-06-15',
      phone: '+84 901 234 567',
      email: 'nguyenvanan@email.com',
      location: 'An Giang Province',
    },
    farmStats: {
      totalArea: 2.5,
      carbonCreditsEarned: 68,
      verificationRate: 95,
      monthlyIncome: 450,
    },
    yieldHistory: [
      { season: 'Winter 2023', crop: 'Rice', yield: 6.2, price: 8500 },
      { season: 'Summer 2023', crop: 'Rice', yield: 5.8, price: 8200 },
    ],
    memberships: {
      cooperative: 'An Giang Farmers Cooperative',
      trainingCompleted: ['Basic AWD', 'Carbon Farming', 'Digital Literacy'],
      loanHistory: [
        { date: '2023-08-01', amount: 15000000, status: 'repaid', purpose: 'Seeds & Fertilizer' },
      ],
    },
  });
  
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [errors] = useState<Record<string, string>>({});

  const shareCode = useMemo(() => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return `AGC-${code}`;
  }, []);

  const copyShareCode = () => {
    Clipboard.setString(shareCode);
    Alert.alert('Copied', 'Share code copied to clipboard');
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            signOut();
            navigation.replace('Login');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient 
        colors={[theme.colors.primary + '10', theme.colors.white]} 
        style={styles.backgroundContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Profile Header */}
          <Animated.View entering={FadeInDown.duration(500).springify()}>
            <Card style={[styles.profileHeader, styles.elevation]}>
              <View style={styles.headerRow}>
                <View style={styles.profileInfo}>
                  <ImagePicker
                    imageUri={profileData.farmer.avatar}
                    onImageSelected={uri =>
                      setProfileData((prev: any) => ({ ...prev, farmer: { ...prev.farmer, avatar: uri } }))
                    }
                    error={errors.profile_image}
                    isCircle
                    size={80}
                    containerStyle={styles.avatarContainer}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{profileData.farmer.name}</Text>
                    <View style={styles.userBadgeRow}>
                      <View style={styles.verifiedBadge}>
                        <Icon name="shield-check" size={14} color={theme.colors.success} />
                        <Text style={styles.verifiedText}>MRV Verified</Text>
                      </View>
                      <View style={styles.gradeBadge}>
                        <Icon name="star" size={14} color={theme.colors.primary} />
                        <Text style={styles.gradeText}>Grade {profileData.farmer.carbonGrade}</Text>
                      </View>
                    </View>
                    <View style={styles.locationRow}>
                      <Icon name="map-marker" size={16} color={theme.colors.textLight} />
                      <Text style={styles.locationText}>{profileData.farmer.location}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.shareButton}
                  onPress={() => navigation.navigate('ShareProfile')}
                >
                  <Icon name="share-variant" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Enhanced Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={[theme.colors.success + '20', theme.colors.success + '10']}
                    style={styles.statIcon}
                  >
                    <Icon name="leaf" size={20} color={theme.colors.success} />
                  </LinearGradient>
                  <Text style={styles.statValue}>1.9</Text>
                  <Text style={styles.statLabel}>tCO₂e reduced</Text>
                </View>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={[theme.colors.warning + '20', theme.colors.warning + '10']}
                    style={styles.statIcon}
                  >
                    <Icon name="chart-line" size={20} color={theme.colors.warning} />
                  </LinearGradient>
                  <Text style={styles.statValue}>75%</Text>
                  <Text style={styles.statLabel}>MRV reliability</Text>
                </View>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
                    style={styles.statIcon}
                  >
                    <Icon name="map" size={20} color={theme.colors.primary} />
                  </LinearGradient>
                  <Text style={styles.statValue}>{profileData.farmStats.totalArea}</Text>
                  <Text style={styles.statLabel}>Total hectares</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Enhanced Tabs */}
          <View style={styles.tabsContainer}>
            {[
              { key: 'personal', label: 'Personal' },
              { key: 'farm', label: 'Farm' },
              { key: 'achievements', label: 'Achievements' },
            ].map((tab: any) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  activeTab === tab.key && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'personal' && (
            <Animated.View entering={FadeInRight.duration(300).springify()}>
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeader}>
                  <Icon name="account-circle" size={24} color={theme.colors.primary} />
                  <Text style={styles.cardTitle}>Personal Information</Text>
                </View>
                
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                      <Icon name="phone" size={18} color={theme.colors.info} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Phone</Text>
                      <Text style={styles.infoValue}>{profileData.farmer.phone}</Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                      <Icon name="email" size={18} color={theme.colors.warning} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Email</Text>
                      <Text style={styles.infoValue}>{profileData.farmer.email}</Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                      <Icon name="calendar" size={18} color={theme.colors.success} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Date of birth</Text>
                      <Text style={styles.infoValue}>Jan 15, 1985</Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                      <Icon name="map-marker" size={18} color={theme.colors.error} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Location</Text>
                      <Text style={styles.infoValue}>{profileData.farmer.location}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            </Animated.View>
          )}

          {activeTab === 'farm' && (
            <Animated.View entering={FadeInRight.duration(300).springify()}>
              {/* Farm Profile Card */}
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeader}>
                  <Icon name="leaf" size={24} color={theme.colors.success} />
                  <Text style={styles.cardTitle}>Farm Profile</Text>
                </View>
                
                <View style={styles.farmStatsGrid}>
                  <View style={styles.farmStatItem}>
                    <Text style={styles.farmStatLabel}>Primary crop</Text>
                    <View style={styles.cropInfo}>
                      <View style={[styles.cropDot, { backgroundColor: theme.colors.success }]} />
                      <Text style={styles.farmStatValue}>Rice</Text>
                    </View>
                  </View>
                  <View style={styles.farmStatItem}>
                    <Text style={styles.farmStatLabel}>Farm area</Text>
                    <Text style={styles.farmStatValue}>{profileData.farmStats.totalArea} ha</Text>
                  </View>
                  <View style={styles.farmStatItem}>
                    <Text style={styles.farmStatLabel}>Last sowing</Text>
                    <Text style={styles.farmStatValue}>Mar 2024</Text>
                  </View>
                  <View style={styles.farmStatItem}>
                    <Text style={styles.farmStatLabel}>Expected yield</Text>
                    <Text style={styles.farmStatValue}>5.2 tons</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.yieldSection}>
                  <View style={styles.yieldHeader}>
                    <Text style={styles.yieldTitle}>Recent Yields</Text>
                    <View style={styles.yieldBadge}>
                      <Text style={styles.yieldBadgeText}>Last 3 seasons</Text>
                    </View>
                  </View>
                  
                  {[
                    { season: 'Spring 2024', yield: '5.8 tons', isHighlight: true },
                    { season: 'Winter 2023', yield: '4.9 tons', isHighlight: false },
                    { season: 'Spring 2023', yield: '5.2 tons', isHighlight: false },
                  ].map((item, index) => (
                    <View key={index} style={styles.yieldItem}>
                      <Text style={styles.yieldSeason}>{item.season}</Text>
                      <Text style={[
                        styles.yieldValue, 
                        item.isHighlight && { color: theme.colors.success }
                      ]}>
                        {item.yield}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>

              {/* My Land Card */}
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeaderWithAction}>
                  <View style={styles.cardHeader}>
                    <Icon name="map" size={24} color={theme.colors.primary} />
                    <Text style={styles.cardTitle}>My Land</Text>
                  </View>
                  <ButtonCustom 
                    title="Add" 
                    icon="plus" 
                    onPress={() => {}} 
                    variant="primary" 
                    style={styles.addButton} 
                  />
                </View>

                <View style={styles.landList}>
                  {[
                    { id: '1', name: 'Plot 01', location: 'An Giang', status: 'verified', area: 1.2, cropType: 'Rice', carbonScore: 'B+' },
                    { id: '2', name: 'Plot 02', location: 'Dong Thap', status: 'pending', area: 0.8, cropType: 'Rice', carbonScore: 'B' },
                  ].map((land) => (
                    <View key={land.id} style={styles.landCard}>
                      <View style={styles.landHeader}>
                        <View style={styles.landInfo}>
                          <Text style={styles.landName}>{land.name}</Text>
                          <Text style={styles.landLocation}>{land.location}</Text>
                        </View>
                        <View style={styles.landActions}>
                          <View style={[
                            styles.statusBadge,
                            { backgroundColor: land.status === 'verified' ? theme.colors.success + '20' : theme.colors.warning + '20' }
                          ]}>
                            <Text style={[
                              styles.statusText,
                              { color: land.status === 'verified' ? theme.colors.success : theme.colors.warning }
                            ]}>
                              {land.status === 'verified' ? 'Verified' : 'Pending'}
                            </Text>
                          </View>
                          <TouchableOpacity style={styles.editButton}>
                            <Icon name="pencil" size={16} color={theme.colors.textLight} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      
                      <View style={styles.landStats}>
                        <View style={styles.landStatItem}>
                          <Text style={styles.landStatLabel}>Area</Text>
                          <Text style={styles.landStatValue}>{land.area} ha</Text>
                        </View>
                        <View style={styles.landStatItem}>
                          <Text style={styles.landStatLabel}>Crop</Text>
                          <Text style={styles.landStatValue}>{land.cropType}</Text>
                        </View>
                        <View style={styles.landStatItem}>
                          <Text style={styles.landStatLabel}>Score</Text>
                          <Text style={[styles.landStatValue, { color: theme.colors.success }]}>
                            {land.carbonScore}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            </Animated.View>
          )}

          {activeTab === 'achievements' && (
            <Animated.View entering={FadeInRight.duration(300).springify()}>
              {/* Memberships Card */}
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeader}>
                  <Icon name="trophy" size={24} color={theme.colors.warning} />
                  <Text style={styles.cardTitle}>Memberships & Achievements</Text>
                </View>

                <View style={styles.achievementsList}>
                  <View style={styles.achievementItem}>
                    <View style={styles.achievementIcon}>
                      <LinearGradient
                        colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
                        style={styles.achievementIconBg}
                      >
                        <Icon name="account-group" size={24} color={theme.colors.primary} />
                      </LinearGradient>
                    </View>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementTitle}>Cooperative Member</Text>
                      <Text style={styles.achievementSubtitle}>{profileData.memberships.cooperative}</Text>
                    </View>
                    <View style={styles.achievementBadge}>
                      <Text style={styles.achievementBadgeText}>Active</Text>
                    </View>
                  </View>

                  <View style={styles.achievementItem}>
                    <View style={styles.achievementIcon}>
                      <LinearGradient
                        colors={[theme.colors.success + '20', theme.colors.success + '10']}
                        style={styles.achievementIconBg}
                      >
                        <Icon name="school" size={24} color={theme.colors.success} />
                      </LinearGradient>
                    </View>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementTitle}>Training Completed</Text>
                      <Text style={styles.achievementSubtitle}>Agricultural Best Practices</Text>
                    </View>
                    <View style={[styles.achievementBadge, { backgroundColor: theme.colors.success + '20' }]}>
                      <Icon name="trophy" size={12} color={theme.colors.success} />
                      <Text style={[styles.achievementBadgeText, { color: theme.colors.success }]}>85%</Text>
                    </View>
                  </View>

                  <View style={[styles.achievementItem, styles.loanHistoryItem]}>
                    <View style={styles.achievementIcon}>
                      <LinearGradient
                        colors={[theme.colors.info + '20', theme.colors.info + '10']}
                        style={styles.achievementIconBg}
                      >
                        <Icon name="currency-usd" size={24} color={theme.colors.info} />
                      </LinearGradient>
                    </View>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementTitle}>Loan History</Text>
                      <Text style={styles.achievementSubtitle}>2 loans, 100% repaid on time</Text>
                    </View>
                    <View style={[styles.achievementBadge, { backgroundColor: theme.colors.success + '20' }]}>
                      <Text style={[styles.achievementBadgeText, { color: theme.colors.success }]}>Excellent</Text>
                    </View>
                  </View>
                </View>
              </Card>

              {/* Loan History Details */}
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeader}>
                  <Icon name="credit-card-check" size={24} color={theme.colors.info} />
                  <Text style={styles.cardTitle}>Loan History Details</Text>
                </View>

                <View style={styles.loanList}>
                  {profileData.memberships.loanHistory.map((loan: any, index: number) => (
                    <View key={index} style={styles.loanItem}>
                      <View style={styles.loanIcon}>
                        <Icon name="check-circle" size={20} color={theme.colors.success} />
                      </View>
                      <View style={styles.loanContent}>
                        <Text style={styles.loanPurpose}>{loan.purpose}</Text>
                        <Text style={styles.loanDate}>{loan.date}</Text>
                      </View>
                      <View style={styles.loanAmount}>
                        <Text style={styles.loanValue}>{loan.amount.toLocaleString()} ₫</Text>
                        <Text style={[styles.loanStatus, { color: theme.colors.success }]}>
                          {loan.status}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            </Animated.View>
          )}

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <ButtonCustom
              title="Logout"
              variant="primary"
              icon="logout-variant"
              onPress={handleLogout}
              style={styles.logoutButton}
            />
          </View>
        </ScrollView>

        {/* Share Screen replaces modal */}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
    marginTop: theme.spacing.xxl,
  },
  elevation: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  
  // Profile Header Styles
  profileHeader: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userBadgeRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.success,
    fontFamily: theme.typography.fontFamily.medium,
  },
  gradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
  },

  // Tabs Styles
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: theme.colors.white,
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabText: {
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },

  // Content Card Styles
  contentCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  cardHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  addButton: {
    height: 36,
    paddingHorizontal: theme.spacing.md,
  },

  // Info Grid Styles
  infoGrid: {
    gap: theme.spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },

  // Farm Stats Styles
  farmStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  farmStatItem: {
    width: '48%',
  },
  farmStatLabel: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: 4,
  },
  farmStatValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  cropDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },

  // Yield Section Styles
  yieldSection: {
    gap: theme.spacing.md,
  },
  yieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  yieldTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  yieldBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  yieldBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
  },
  yieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  yieldSeason: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
  },
  yieldValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },

  // Land List Styles
  landList: {
    gap: theme.spacing.md,
  },
  landCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: theme.spacing.md,
  },
  landHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  landInfo: {
    flex: 1,
  },
  landName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: 2,
  },
  landLocation: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
  },
  landActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  editButton: {
    padding: 6,
  },
  landStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  landStatItem: {
    flex: 1,
  },
  landStatLabel: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.xs,
    marginBottom: 2,
  },
  landStatValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },

  // Achievements Styles
  achievementsList: {
    gap: theme.spacing.lg,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
  },
  loanHistoryItem: {
    backgroundColor: theme.colors.background,
  },
  achievementIcon: {},
  achievementIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: 2,
  },
  achievementSubtitle: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  achievementBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },

  // Loan List Styles
  loanList: {
    gap: theme.spacing.md,
  },
  loanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  loanIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loanContent: {
    flex: 1,
  },
  loanPurpose: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: 2,
  },
  loanDate: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
  },
  loanAmount: {
    alignItems: 'flex-end',
  },
  loanValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: 2,
  },
  loanStatus: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },

  // Modal Styles
  modalDescription: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.md,
    marginBottom: theme.spacing.lg,
  },
  shareCodeSection: {
    marginBottom: theme.spacing.lg,
  },
  shareCodeLabel: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing.xs,
  },
  shareCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  shareCodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  shareCodeText: {
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
  },
  copyButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
  },
  shareCodeNote: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
  },
  bankInfoSection: {
    marginBottom: theme.spacing.lg,
  },
  bankInfoTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  bankInfoList: {
    gap: 6,
  },
  bankInfoItem: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
  },

  // Logout Styles
  logoutContainer: {
    marginTop: theme.spacing.xl,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
});

export default ProfileScreen;
