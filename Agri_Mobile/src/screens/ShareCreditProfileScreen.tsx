import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Card from '../component/Card';
import ButtonCustom from '../component/ButtonCustom';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/types';
import sha256 from 'crypto-js/sha256';
import encHex from 'crypto-js/enc-hex';

type Props = NativeStackScreenProps<RootStackParamList, 'ShareCreditProfile'>;

const APP_HOST = 'https://app.agricred.local';

const ShareCreditProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const { profileId, score } = route.params;

  const txHash = useMemo(() => {
    const payload = `${profileId}:${score}:${new Date().toISOString()}`;
    return sha256(payload).toString(encHex);
  }, [profileId, score]);

  const shareUrl = `${APP_HOST}/credit/${profileId}?tx=${txHash}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `AgriCred Credit Profile\nProfile ID: ${profileId}\nScore: ${score}\nTX Hash: ${txHash}\nLink: ${shareUrl}`,
      });
    } catch (_) {}
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[theme.colors.secondary + '10', theme.colors.white]} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Card style={styles.card}>
            <View style={styles.headerRow}>
              <Icon name="share-variant" size={20} color={theme.colors.primary} />
              <Text style={styles.title}>Share Credit Profile</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Profile ID</Text>
              <Text style={styles.value}>{profileId}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Credit Score</Text>
              <Text style={styles.value}>{score}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>TX Hash</Text>
              <Text numberOfLines={1} style={styles.valueMono}>{txHash}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Share Link</Text>
              <Text numberOfLines={1} style={styles.valueMono}>{shareUrl}</Text>
            </View>

            <ButtonCustom title="Share" icon="share-variant" onPress={handleShare} style={{ marginTop: theme.spacing.lg }} />

            <TouchableOpacity
              onPress={() => navigation.navigate('CreditProfile', { profileId })}
              style={styles.previewLink}
              activeOpacity={0.8}
            >
              <Text style={styles.previewText}>Preview public credit profile →</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  content: { padding: theme.spacing.lg },
  card: { padding: theme.spacing.lg, borderRadius: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: theme.spacing.md },
  title: { fontFamily: theme.typography.fontFamily.bold, fontSize: theme.typography.fontSize.lg, color: theme.colors.text },
  row: { marginBottom: theme.spacing.sm },
  label: { color: theme.colors.textLight, marginBottom: 4 },
  value: { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
  valueMono: { color: theme.colors.text, fontFamily: theme.typography.fontFamily.mono, opacity: 0.9 },
  previewLink: { marginTop: theme.spacing.md },
  previewText: { color: theme.colors.primary },
});

export default ShareCreditProfileScreen;


