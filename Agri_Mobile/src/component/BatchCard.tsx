import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Badge from './Badge';

interface BatchCardProps {
  batch: {
    // Simplified model aligned with mock/database derivation
    id: string;
    product_name: string; // crop_type
    category: string;     // location/field
    weight: number;       // quantity
    harvest_date: string; // delivery_date
    cultivation_method: string;
    image?: string;
    status: 'completed' | 'submitted' | 'pending';
  };
  onPress?: () => void;
  style?: ViewStyle;
}

const BatchCard: React.FC<BatchCardProps> = ({
  batch,
  onPress,
  style,
}) => {
  const convertDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const getStatusMeta = () => {
    switch (batch.status) {
      case 'completed':
        return { text: 'Verified', variant: 'success' as const, icon: 'check' };
      case 'submitted':
        return { text: 'Submitted', variant: 'info' as const, icon: 'upload' };
      default:
        return { text: 'Pending', variant: 'warning' as const, icon: 'clock-outline' };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      {batch.image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: batch.image }} style={styles.image} resizeMode="cover" />
        </View>
      ) : (
        <View style={[styles.imageContainer, styles.imagePlaceholder]}>
          <Icon name="image" size={32} color={theme.colors.textLight} />
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.productName} numberOfLines={1}>{batch.product_name}</Text>
            <View style={styles.categoryContainer}>
              <Icon name="tag-outline" size={14} color={theme.colors.textLight} />
              <Text style={styles.category}>{batch.category}</Text>
            </View>
          </View>
          <Badge text={getStatusMeta().text} variant={getStatusMeta().variant} size="small" />
        </View>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Icon name="weight-kilogram" size={16} color={theme.colors.primary} />
            <Text style={styles.detailText}>{batch.weight} kg</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar-outline" size={16} color={theme.colors.secondary} />
            <Text style={styles.detailText}>{convertDate(batch.harvest_date)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="leaf" size={16} color={theme.colors.accent} />
            <Text style={styles.detailText}>{batch.cultivation_method}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actionContainer}>
        <Icon
          name="chevron-right"
          size={24}
          color={theme.colors.primary}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    padding: theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  productName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  detailText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginLeft: 6,
  },
  actionContainer: {
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
});

export default BatchCard; 