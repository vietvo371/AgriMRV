import React, { useEffect, useState } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import ImagePicker from '../component/ImagePicker';
import InputCustom from '../component/InputCustom';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/Api';
import Card from '../component/Card';
import LinearGradient from 'react-native-linear-gradient';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    profile_image: '',
  });
  const [profileData, setProfileData] = useState({
    'id': "1",
    'full_name': "Nguyen Van A",
    'email': "nguyenvana@gmail.com",
    'phone_number': "0909090909",
    'address': "123 Nguyen Van Linh, Q9, TP.HCM",
    'role': "farmer",
    'profile_image': "https://via.placeholder.com/150",
    'stats': {
      'total_batches': "10",
      'active_batches': "5",
      'total_scans': "100",
      'average_rating': "4.5"
    }

  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fetchUser = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfileData(response.data.data);
      setFormData({
        full_name: response.data.data.full_name,
        email: response.data.data.email,
        phone_number: response.data.data.phone_number,
        address: response.data.data.address,
        profile_image: response.data.data.profile_image,
      });
    } catch (error: any) {
      console.error('Error fetching user:', error.response);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      full_name: profileData.full_name,
      email: profileData.email,
      phone_number: profileData.phone_number,
      address: profileData.address,
      profile_image: profileData.profile_image,
    });
    setErrors({});
    setIsEditing(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log('Updating profile with:', formData);
      const delay = new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      const [response] = await Promise.all([
        api.put('/user/profile', formData),
        delay,
      ]);
      console.log('Updating profile with:', response.data.data);
      // Optional: đồng bộ lại dữ liệu hiển thị
      setProfileData(prev => ({
        ...prev,
        ...response.data.data,
        stats: prev.stats,
      }));
      setIsEditing(false);
    } catch (error: any) {
      console.log('Profile update error:', error.response);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
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
            // TODO: Implement actual logout logic
            signOut();
            navigation.replace('Login');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <LinearGradient colors={[theme.colors.secondary + '30', theme.colors.white]} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={[styles.profileHeader, styles.elevation]}>
          <View style={styles.imageContainer}>
            <ImagePicker
              imageUri={profileData.profile_image}
              onImageSelected={uri =>
                setFormData(prev => ({ ...prev, profile_image: uri }))
              }
              error={errors.profile_image}
              isCircle
              size={120}
              containerStyle={styles.imagePicker}
            />
            <Text style={styles.roleText}>{profileData.full_name}</Text>
            {!isEditing && (
              <View style={styles.roleContainer}>
                <Icon name="shield-account-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.roleText}>
                  {profileData.role?.charAt(0).toUpperCase() +
                    profileData.role?.slice(1)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Icon name="package-variant-closed" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.statValue}>{profileData.stats.total_batches}</Text>
                <Text style={styles.statLabel}>Total Batches</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '15' }]}>
                  <Icon name="package-variant" size={24} color={theme.colors.success} />
                </View>
                <Text style={styles.statValue}>{profileData.stats.active_batches}</Text>
                <Text style={styles.statLabel}>Active Batches</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.secondary + '15' }]}>
                  <Icon name="qrcode-scan" size={24} color={theme.colors.secondary} />
                </View>
                <Text style={styles.statValue}>{profileData.stats.total_scans}</Text>
                <Text style={styles.statLabel}>Total Scans</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '15' }]}>
                  <Icon name="star-outline" size={24} color={theme.colors.warning} />
                </View>
                <Text style={styles.statValue}>{profileData.stats.average_rating}</Text>
                <Text style={styles.statLabel}>Avg Rating</Text>
              </View>
            </View>
          </View>
        </Card>
        {/* Profile Overview */}
        <Card style={[styles.infoCard, styles.elevation]}>
          <View style={styles.infoHeader}>
            <View style={styles.headerIcon}><Icon name="account-outline" size={16} color={theme.colors.primary} /></View>
            <Text style={styles.infoTitle}>Profile Overview</Text>
          </View>
          <View style={styles.twoCol}>
            <View style={styles.colItem}>
              <Text style={styles.muted}>Name</Text>
              <Text style={styles.value}>{profileData.full_name || '—'}</Text>
            </View>
            <View style={styles.colItem}>
              <Text style={styles.muted}>Role</Text>
              <View style={[styles.badgePill, { backgroundColor: theme.colors.background }]}><Text style={styles.badgeText}>{profileData.role || '—'}</Text></View>
            </View>
          </View>
          <View style={styles.twoCol}>
            <View style={styles.colItem}><Text style={styles.muted}>Phone</Text><Text style={styles.value}>{profileData.phone_number || '—'}</Text></View>
            <View style={styles.colItem}><Text style={styles.muted}>Email</Text><Text style={styles.value}>{profileData.email || '—'}</Text></View>
          </View>
        </Card>

        {/* Farm Details */}
        <Card style={[styles.infoCard, styles.elevation]}>
          <View style={styles.infoHeader}>
            <View style={styles.headerIcon}><Icon name="map-marker-radius-outline" size={16} color={theme.colors.primary} /></View>
            <Text style={styles.infoTitle}>Farm Details</Text>
          </View>
          <View style={styles.twoCol}>
            <View style={styles.colItem}><Text style={styles.muted}>Crop Type</Text><Text style={styles.value}>{'rice'}</Text></View>
            <View style={styles.colItem}><Text style={styles.muted}>Area (Ha)</Text><Text style={styles.value}>{'99 ha'}</Text></View>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.twoCol}>
            <View style={styles.colItem}><Text style={styles.muted}>Expected Yield</Text><Text style={styles.value}>{'99 tons'}</Text></View>
            <View style={styles.colItem}><Text style={styles.muted}>Sowing Date</Text><Text style={styles.value}>{'2025-07-31'}</Text></View>
          </View>
        </Card>

        {/* Memberships & Training */}
        <Card style={[styles.infoCard, styles.elevation]}>
          <View style={styles.infoHeader}>
            <View style={styles.headerIcon}><Icon name="badge-account-horizontal-outline" size={16} color={theme.colors.primary} /></View>
            <Text style={styles.infoTitle}>Memberships & Training</Text>
          </View>
          <View style={{ gap: 16 }}>
            <View>
              <View style={styles.rowBetween}>
                <Text style={styles.value}>Cooperative Member</Text>
                <View style={[styles.badgePill, { backgroundColor: theme.colors.success + '20' }]}><Text style={[styles.badgeText, { color: theme.colors.success }]}>Active</Text></View>
              </View>
              <Text style={[styles.muted, { marginTop: 4 }]}>green-valley</Text>
            </View>
            <View>
              <View style={styles.rowBetween}>
                <Text style={styles.value}>Training Completed</Text>
                <View style={[styles.badgePill, { backgroundColor: theme.colors.warning + '20' }]}><Text style={[styles.badgeText, { color: theme.colors.warning }]}>85% Score</Text></View>
              </View>
              <Text style={[styles.muted, { marginTop: 4 }]}>Agricultural Best Practices</Text>
            </View>
          </View>
        </Card>
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
        {/* Logout button */}
       
        <LoadingOverlay visible={loading} message="Updating profile..." />
      </LinearGradient>
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
  profileHeader: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  elevation: { ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }) },
  imageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
  },
  roleText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  statsSection: {
    marginTop: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
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
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  formSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  form: {
    gap: 16,
  },
  editButton: {
    padding: 8,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
  },
  saveButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  logoutButton: { borderColor: theme.colors.error },
  imagePicker: {
    marginBottom: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: theme.spacing.md },
  headerIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.secondary + '25' },
  infoTitle: { fontFamily: theme.typography.fontFamily.bold, color: theme.colors.text },
  twoCol: { flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.spacing.sm },
  colItem: { flex: 1, paddingRight: theme.spacing.lg },
  muted: { color: theme.colors.textLight },
  value: { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
  badgePill: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: theme.colors.background, borderRadius: 12, alignSelf: 'flex-start' },
  badgeText: { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium, fontSize: theme.typography.fontSize.sm },
  inlineRow: { flexDirection: 'row', alignItems: 'center' },
  infoDivider: { height: 1, backgroundColor: theme.colors.border, marginVertical: theme.spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoutContainer: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.lg, marginTop: theme.spacing.lg },
});

export default ProfileScreen; 