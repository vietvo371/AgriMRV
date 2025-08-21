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
import DatePicker from '../component/DatePicker';
import SelectCustom from '../component/SelectCustom';

interface CoopManagementScreenProps {
  navigation: any;
}

interface Cooperative {
  id: string;
  name: string;
  location: string;
  memberCount: number;
  joinedAt?: string;
}

const CoopManagementScreen: React.FC<CoopManagementScreenProps> = ({
  navigation,
}) => {
  const [selectedCoop, setSelectedCoop] = useState<string>('');
  const [joinDate, setJoinDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const cooperatives: Cooperative[] = [
    {
      id: '1',
      name: 'Green Valley Cooperative',
      location: 'Hanoi, Vietnam',
      memberCount: 150,
    },
    {
      id: '2',
      name: 'Rice Farmers Association',
      location: 'Ho Chi Minh City, Vietnam',
      memberCount: 230,
    },
    {
      id: '3',
      name: 'Sustainable Agriculture Group',
      location: 'Da Nang, Vietnam',
      memberCount: 85,
    },
  ];

  const handleJoin = async () => {
    if (!selectedCoop) {
      Alert.alert('Error', 'Please select a cooperative');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert(
        'Success',
        'Your membership request has been submitted successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error joining cooperative:', error);
      Alert.alert('Error', 'Failed to submit membership request');
    } finally {
      setLoading(false);
    }
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
      <Header
        title="Cooperative Membership"
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>Why Join a Cooperative?</Text>
            <View style={styles.benefitItem}>
              <Icon name="trending-up" size={24} color={theme.colors.success} />
              <Text style={styles.benefitText}>
                Boost your credit score through cooperative membership
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="handshake" size={24} color={theme.colors.primary} />
              <Text style={styles.benefitText}>
                Access shared resources and support from other farmers
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="bank" size={24} color={theme.colors.info} />
              <Text style={styles.benefitText}>
                Better loan terms and financial opportunities
              </Text>
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Available Cooperatives</Text>
          {cooperatives.map((coop) => (
            <TouchableOpacity
              key={coop.id}
              onPress={() => setSelectedCoop(coop.id)}
              activeOpacity={0.8}>
              <Card
                style={[
                  styles.coopCard,
                  selectedCoop === coop.id && styles.selectedCoopCard,
                ]}>
                <View style={styles.coopHeader}>
                  <View style={styles.coopInfo}>
                    <Text style={styles.coopName}>{coop.name}</Text>
                    <Text style={styles.coopLocation}>{coop.location}</Text>
                  </View>
                  {selectedCoop === coop.id && (
                    <Icon
                      name="check-circle"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                </View>
                <View style={styles.coopStats}>
                  <View style={styles.statItem}>
                    <Icon name="account-group" size={20} color={theme.colors.text} />
                    <Text style={styles.statText}>
                      {coop.memberCount} Members
                    </Text>
                  </View>
                  {coop.joinedAt && (
                    <View style={styles.statItem}>
                      <Icon name="calendar" size={20} color={theme.colors.text} />
                      <Text style={styles.statText}>
                        Joined {formatDate(coop.joinedAt)}
                      </Text>
                    </View>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))}

          {selectedCoop && (
            <Card style={styles.joinCard}>
              <Text style={styles.joinTitle}>Membership Details</Text>
              <DatePicker
                label="Join Date"
                value={joinDate}
                onChange={setJoinDate}
                minimumDate={new Date()}
                required
                containerStyle={styles.datePicker}
              />
              <ButtonCustom
                title="Submit Membership Request"
                onPress={handleJoin}
                loading={loading}
                style={styles.joinButton}
              />
            </Card>
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
  infoCard: {
    marginBottom: theme.spacing.xl,
  },
  infoTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  benefitText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  coopCard: {
    marginBottom: theme.spacing.md,
  },
  selectedCoopCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  coopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  coopInfo: {
    flex: 1,
  },
  coopName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  coopLocation: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  coopStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.xl,
  },
  statText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  joinCard: {
    marginTop: theme.spacing.xl,
  },
  joinTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  datePicker: {
    marginBottom: theme.spacing.lg,
  },
  joinButton: {
    marginTop: theme.spacing.md,
  },
});

export default CoopManagementScreen;
