import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import Card from '../component/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectCustom from '../component/SelectCustom';
import DatePicker from '../component/DatePicker';

interface AdminAuditScreenProps {
  navigation: any;
}

interface AuditLog {
  id: string;
  type: 'profile' | 'season' | 'image' | 'blockchain' | 'credit';
  action: string;
  userId: string;
  userName: string;
  details: string;
  timestamp: string;
  status: 'success' | 'error' | 'warning';
}

const AdminAuditScreen: React.FC<AdminAuditScreenProps> = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  const typeOptions = [
    { label: 'All Types', value: '' },
    { label: 'Profile Updates', value: 'profile' },
    { label: 'Season Records', value: 'season' },
    { label: 'Image Processing', value: 'image' },
    { label: 'Blockchain Anchors', value: 'blockchain' },
    { label: 'Credit Scoring', value: 'credit' },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: '1',
      type: 'profile',
      action: 'Profile Update',
      userId: 'U123',
      userName: 'John Doe',
      details: 'Updated contact information',
      timestamp: '2024-03-15T10:30:00Z',
      status: 'success',
    },
    {
      id: '2',
      type: 'image',
      action: 'Image Upload',
      userId: 'U124',
      userName: 'Jane Smith',
      details: 'Uploaded 3 field photos',
      timestamp: '2024-03-15T09:45:00Z',
      status: 'success',
    },
    {
      id: '3',
      type: 'blockchain',
      action: 'Anchor Profile',
      userId: 'U125',
      userName: 'Mike Johnson',
      details: 'TX Hash: 0x1234...5678',
      timestamp: '2024-03-15T09:30:00Z',
      status: 'error',
    },
    {
      id: '4',
      type: 'credit',
      action: 'Score Update',
      userId: 'U126',
      userName: 'Sarah Wilson',
      details: 'Credit score updated to 85',
      timestamp: '2024-03-15T09:15:00Z',
      status: 'success',
    },
    {
      id: '5',
      type: 'season',
      action: 'Season Created',
      userId: 'U127',
      userName: 'Tom Brown',
      details: 'New rice season recorded',
      timestamp: '2024-03-15T09:00:00Z',
      status: 'warning',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      default:
        return theme.colors.text;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'profile':
        return 'account';
      case 'season':
        return 'sprout';
      case 'image':
        return 'image';
      case 'blockchain':
        return 'link-variant';
      case 'credit':
        return 'chart-line';
      default:
        return 'information';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredLogs = auditLogs.filter((log) => {
    const logDate = new Date(log.timestamp);
    const isInDateRange =
      logDate >= startDate && logDate <= new Date(endDate.setHours(23, 59, 59));
    return (
      isInDateRange && (!selectedType || log.type === selectedType)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Audit Logs" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.filtersCard}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <SelectCustom
              label="Log Type"
              value={selectedType}
              onChange={setSelectedType}
              options={typeOptions}
              placeholder="Select log type"
              containerStyle={styles.filterItem}
            />
            <View style={styles.dateFilters}>
              <View style={styles.dateFilter}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  maximumDate={endDate}
                />
              </View>
              <View style={styles.dateFilter}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  minimumDate={startDate}
                  maximumDate={new Date()}
                />
              </View>
            </View>
          </Card>

          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Icon name="check-circle" size={24} color={theme.colors.success} />
              <Text style={styles.statValue}>
                {filteredLogs.filter((log) => log.status === 'success').length}
              </Text>
              <Text style={styles.statLabel}>Success</Text>
            </Card>
            <Card style={styles.statCard}>
              <Icon name="alert-circle" size={24} color={theme.colors.warning} />
              <Text style={styles.statValue}>
                {filteredLogs.filter((log) => log.status === 'warning').length}
              </Text>
              <Text style={styles.statLabel}>Warnings</Text>
            </Card>
            <Card style={styles.statCard}>
              <Icon name="close-circle" size={24} color={theme.colors.error} />
              <Text style={styles.statValue}>
                {filteredLogs.filter((log) => log.status === 'error').length}
              </Text>
              <Text style={styles.statLabel}>Errors</Text>
            </Card>
          </View>

          <Text style={styles.sectionTitle}>Audit Logs</Text>
          {filteredLogs.map((log) => (
            <TouchableOpacity
              key={log.id}
              onPress={() => {
                // Handle log item press
              }}
              activeOpacity={0.8}>
              <Card style={styles.logCard}>
                <View style={styles.logHeader}>
                  <View style={styles.logType}>
                    <Icon
                      name={getTypeIcon(log.type)}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.logAction}>{log.action}</Text>
                  </View>
                  <Icon
                    name={
                      log.status === 'success'
                        ? 'check-circle'
                        : log.status === 'warning'
                        ? 'alert-circle'
                        : 'close-circle'
                    }
                    size={20}
                    color={getStatusColor(log.status)}
                  />
                </View>

                <View style={styles.logContent}>
                  <Text style={styles.logUser}>{log.userName}</Text>
                  <Text style={styles.logDetails}>{log.details}</Text>
                  <Text style={styles.logTime}>
                    {formatDate(log.timestamp)}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
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
  filtersCard: {
    marginBottom: theme.spacing.xl,
  },
  filtersTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  filterItem: {
    marginBottom: theme.spacing.md,
  },
  dateFilters: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  dateFilter: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginVertical: theme.spacing.xs,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  logCard: {
    marginBottom: theme.spacing.md,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  logType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logAction: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  logContent: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  logUser: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  logDetails: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  logTime: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
});

export default AdminAuditScreen;
