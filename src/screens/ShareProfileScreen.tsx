import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import QRCode from '../component/QRCode';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
const ShareProfileScreen: React.FC<any> = ({ navigation }) => {
  const shareCode = useMemo(() => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return `AGC-${code}`;
  }, []);

  const handleShareLink = () => {
    Alert.alert('Share', 'Share link copied.');
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <LinearGradient
          colors={[theme.colors.primary + '10', theme.colors.white]} 
          style={styles.gradient}>
      <Header title="Share Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Share your credit profile</Text>
          <Text style={styles.subtitle}>Banks can scan QR or use code below</Text>

          <View style={styles.qrSection}>
            <QRCode value={shareCode} label="Scan to view profile" />
          </View>

          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>Share Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{shareCode}</Text>
              <TouchableOpacity style={styles.iconBtn}>
                <Icon name="content-copy" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.note}>Code expires in 24 hours</Text>
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
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  codeRow: {
    marginBottom: theme.spacing.lg,
  },
  codeLabel: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing.xs,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
  },
  codeText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  note: {
    marginTop: theme.spacing.xs,
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.xs,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    backgroundColor: theme.colors.primary + '10',
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  actionText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
});

export default ShareProfileScreen;


