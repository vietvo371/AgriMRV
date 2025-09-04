import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';

interface ButtonCustomProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

const ButtonCustom: React.FC<ButtonCustomProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const getButtonStyle = () => {
    const styles: ViewStyle[] = [{
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    }];

    // Add variant styles
    switch (variant) {
      case 'secondary':
        styles.push({
          backgroundColor: theme.colors.secondary,
        });
        break;
      case 'outline':
        styles.push({
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: theme.colors.primary,
        });
        break;
      default:
        styles.push({
          backgroundColor: theme.colors.primary,
        });
    }

    // Add size styles
    switch (size) {
      case 'small':
        styles.push({
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
        });
        break;
      case 'large':
        styles.push({
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        });
        break;
      default:
        styles.push({
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
        });
    }

    // Add disabled styles
    if (disabled) {
      styles.push({
        backgroundColor: theme.colors.disabled,
        borderColor: theme.colors.disabled,
      });
    }

    // Add custom styles
    if (style) {
      styles.push(style);
    }

    return styles;
  };

  const getTextStyle = () => {
    const styles: TextStyle[] = [{
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
    }];

    // Add variant text styles
    switch (variant) {
      case 'outline':
        styles.push({
          color: theme.colors.primary,
        });
        break;
      default:
        styles.push({
          color: theme.colors.white,
        });
    }

    // Add disabled text styles
    if (disabled) {
      styles.push({
        color: theme.colors.white,
      });
    }

    // Add custom text styles
    if (textStyle) {
      styles.push(textStyle);
    }

    return styles;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : theme.colors.white} />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <Icon
              name={icon}
              size={20}
              color={variant === 'outline' ? theme.colors.primary : theme.colors.white}
              style={styles.leftIcon}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Icon
              name={icon}
              size={20}
              color={variant === 'outline' ? theme.colors.primary : theme.colors.white}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.xs,
  },
  rightIcon: {
    marginLeft: theme.spacing.xs,
  },
  button: {
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  smallButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  mediumButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  largeButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.disabled,
  },
  text: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
  },
  primaryText: {
    color: theme.colors.white,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  disabledText: {
    color: theme.colors.white,
  },
});

export default ButtonCustom;
