import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { theme } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import Header from '../component/Header';
import ButtonCustom from '../component/ButtonCustom';
import Card from '../component/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Shadow } from 'react-native-shadow-2';

interface FarmerProfileScreenProps {
  navigation: any;
}

const FarmerProfileScreen: React.FC<FarmerProfileScreenProps> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const [seasons, setSeasons] = useState([
    {
      id: '1',
      cropType: 'Rice',
      area: 2.5,
      sowingDate: '2024-01-15',
      status: 'active',
    },
    {
      id: '2',
      cropType: 'Corn',
      area: 1.8,
      sowingDate: '2023-12-01',
      status: 'completed',
    },
  ]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Header */}
          <Shadow startColor={'#00000010'} offset={[0, 2]} style={styles.fullWidth}>
            <Card style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={require('../assets/images/avatar.jpeg')}
                    style={styles.avatar}
                  />
                  <TouchableOpacity style={styles.editAvatarButton}>
                    <Icon name="camera" size={20} color={theme.colors.white} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.name}>{user?.name || 'John Doe'}</Text>
                <Text style={styles.role}>Farmer</Text>
              </View>
            </Card>
          </Shadow>

          {/* Personal Information */}
          <Shadow startColor={'#00000010'} offset={[0, 2]} style={styles.fullWidth}>
            <Card style={styles.infoCard}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <View style={styles.infoRow}>
                <Icon name="phone" size={20} color={theme.colors.primary} />
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{user?.phone || '0777777777'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="email" size={20} color={theme.colors.primary} />
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{user?.email || 'john.doe@example.com'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="calendar" size={20} color={theme.colors.primary} />
                <Text style={styles.infoLabel}>Date of Birth:</Text>
                <Text style={styles.infoValue}>{formatDate(user?.dob || '2000-01-01')}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="map-marker" size={20} color={theme.colors.primary} />
                <Text style={styles.infoLabel}>Location:</Text>
                <Text style={styles.infoValue}>{user?.gps_location || '12.3456, 78.9012'}</Text>
              </View>
            </Card>
          </Shadow>

          {/* Seasons List */}
          <View style={styles.seasonsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Seasons</Text>
              <ButtonCustom
                title="New Season"
                onPress={() => navigation.navigate('SeasonProfile')}
                variant="outline"
                style={styles.newButton}
              />
            </View>

            {seasons.map((season) => (
              <Shadow key={season.id} startColor={'#00000010'} offset={[0, 2]} style={styles.fullWidth}>
                <Card
                  style={styles.seasonCard}
                  onPress={() =>
                    navigation.navigate('CreditDashboard', { seasonId: season.id })
                  }>
                  <View style={styles.seasonHeader}>
                    <Icon
                      name={season.cropType === 'Rice' ? 'grain' : 'corn'}
                      size={24}
                      color={theme.colors.primary}
                    />
                    <View style={styles.seasonInfo}>
                      <Text style={styles.cropType}>{season.cropType}</Text>
                      <Text style={styles.seasonDate}>
                        Sowed on {formatDate(season.sowingDate)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            season.status === 'active'
                              ? theme.colors.success + '20'
                              : theme.colors.border + '40',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              season.status === 'active'
                                ? theme.colors.success
                                : theme.colors.textLight,
                          },
                        ]}>
                        {season.status.charAt(0).toUpperCase() +
                          season.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.seasonDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Area</Text>
                      <Text style={styles.detailValue}>{season.area} ha</Text>
                    </View>
                    <Icon
                      name="chevron-right"
                      size={24}
                      color={theme.colors.textLight}
                    />
                  </View>
                </Card>
              </Shadow>
            ))}
          </View>
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
  profileCard: {
    borderRadius: 20,
    padding: theme.spacing.lg,
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  name: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  role: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
  infoCard: {
    marginBottom: theme.spacing.xl,
    borderRadius: 20,
    padding: theme.spacing.lg,
    width: '100%',
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  seasonsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  newButton: {
    height: 36,
    paddingHorizontal: theme.spacing.md,
  },
  seasonCard: {
    marginBottom: theme.spacing.md,
    borderRadius: 16,
    padding: theme.spacing.md,
    width: '100%',
  },
  seasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  seasonInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  cropType: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  seasonDate: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
  },
  seasonDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  fullWidth: {
    width: '100%',
  },
});

export default FarmerProfileScreen;
