import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Badge from './Badge';

interface UserCardProps {
  user: {
    id: string;
    full_name: string;
    email: string;
    role: 'farmer' | 'cooperative' | 'admin';
    profile_image?: string;
    status: 'active' | 'inactive' | 'pending';
    total_batches?: number;
  };
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  style?: ViewStyle;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  onEdit,
  onDelete,
  style,
}) => {
  const getStatusVariant = () => {
    switch (user.status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'admin':
        return theme.colors.error;
      case 'cooperative':
        return theme.colors.info;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {user.profile_image ? (
            <Image
              source={{ uri: user.profile_image }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="account" size={24} color={theme.colors.textLight} />
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.name}>{user.full_name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>
        <Badge
          text={user.status.toUpperCase()}
          variant={getStatusVariant()}
          size="small"
        />
      </View>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Icon name="shield-account" size={16} color={getRoleColor()} />
          <Text style={[styles.detailText, { color: getRoleColor() }]}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Text>
        </View>
        {user.total_batches !== undefined && (
          <View style={styles.detailItem}>
            <Icon name="package-variant" size={16} color={theme.colors.textLight} />
            <Text style={styles.detailText}>
              {user.total_batches} {user.total_batches === 1 ? 'Batch' : 'Batches'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={onEdit}>
            <Icon name="pencil" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}>
            <Icon name="delete" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  name: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  email: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs / 2,
  },
  details: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  detailText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    marginLeft: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  editButton: {
    backgroundColor: theme.colors.primary + '10',
  },
  deleteButton: {
    backgroundColor: theme.colors.error + '10',
  },
});

export default UserCard; 