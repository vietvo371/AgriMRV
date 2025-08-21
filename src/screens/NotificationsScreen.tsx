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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';

interface NotificationsScreenProps {
  navigation: any;
}

// Mock data - replace with actual API call
const mockNotifications = [
  {
    id: '1',
    type: 'batch_scanned',
    title: 'New QR Scan',
    message: 'Your batch "Cat Hoa Loc Mangoes" was scanned by a customer in Ho Chi Minh City',
    timestamp: '2024-03-15T10:30:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'new_review',
    title: 'New Review',
    message: 'You received a 5-star review for "Beef Tomatoes" batch',
    timestamp: '2024-03-14T15:45:00Z',
    read: false,
  },
  {
    id: '3',
    type: 'batch_expiring',
    title: 'Batch Expiring Soon',
    message: 'Your "Green Apples" batch will expire in 3 days',
    timestamp: '2024-03-13T08:20:00Z',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'Welcome to AgriTrace',
    message: 'Thank you for joining AgriTrace! Start by creating your first batch.',
    timestamp: '2024-03-10T09:00:00Z',
    read: true,
  },
];

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'batch_scanned':
        return { name: 'qrcode-scan', color: theme.colors.primary };
      case 'new_review':
        return { name: 'star', color: theme.colors.warning };
      case 'batch_expiring':
        return { name: 'alert-circle', color: theme.colors.error };
      default:
        return { name: 'bell-outline', color: theme.colors.secondary };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return diffInHours === 0 
        ? 'Just now'
        : `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleNotificationPress = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Notifications"
        onBack={() => navigation.goBack()}
        rightComponent={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllButton}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          ) : null
        }
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notification, index) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.read && styles.unreadCard,
              index === 0 && styles.firstCard,
            ]}
            onPress={() => handleNotificationPress(notification.id)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.iconContainer,
              { backgroundColor: getNotificationIcon(notification.type).color + '15' }
            ]}>
              <Icon
                name={getNotificationIcon(notification.type).name}
                size={24}
                color={getNotificationIcon(notification.type).color}
              />
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.title} numberOfLines={1}>
                  {notification.title}
                </Text>
                <Text style={styles.timestamp}>
                  {formatTimestamp(notification.timestamp)}
                </Text>
              </View>
              <Text style={styles.message} numberOfLines={2}>
                {notification.message}
              </Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
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
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  unreadCard: {
    backgroundColor: theme.colors.primary + '05',
  },
  firstCard: {
    borderWidth: 1,
    borderColor: theme.colors.primary + '20',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  timestamp: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  message: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    lineHeight: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
});

export default NotificationsScreen; 