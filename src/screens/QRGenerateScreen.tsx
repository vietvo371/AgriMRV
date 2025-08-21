import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Share,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import QRCode from '../component/QRCode';
import Card from '../component/Card';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import api from '../utils/Api';

interface QRGenerateScreenProps {
  navigation: any;
  route: {
    params: {
      batch: any;
    };
  };
}

const QRGenerateScreen: React.FC<QRGenerateScreenProps> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(false);
  const { batch } = route.params;
  console.log(batch);
  const convertDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const qrValue =` ${"https://agritrace.dzfullstack.com/qr-code"}-${batch.traceability.batch_code}-${batch.id}`;

  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my agricultural product: ${qrValue}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleViewBatch = () => {
    navigation.replace('BatchDetail', { batchId: batch.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="QR Code Generated"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Your QR code has been generated successfully!
          </Text>
          <Text style={styles.subtitle}>
            Share this QR code with your customers to let them track the origin of
            your products.
          </Text>

          <View style={styles.qrContainer}>
            <QRCode
              value={qrValue}
              size={250}
              showShare
              showDownload
              onDownload={() => {}}
            />
          </View>

          <Card variant="outlined" style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Batch Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Product:</Text>
              <Text style={styles.summaryValue}>{batch.product_name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Category:</Text>
              <Text style={styles.summaryValue}>{batch.category}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Weight:</Text>
              <Text style={styles.summaryValue}>{batch.weight} kg</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Harvest Date:</Text>
              <Text style={styles.summaryValue}>{convertDate(batch.harvest_date)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Method:</Text>
              <Text style={styles.summaryValue}>
                {batch.cultivation_method}
              </Text>
            </View>
          </Card>

          <View style={styles.actions}>
            <ButtonCustom
              title="Share QR Code"
              onPress={handleShare}
              variant="outline"
              style={styles.actionButton}
            />
            <ButtonCustom
              title="View Batch Details"
              onPress={handleViewBatch}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
      <LoadingOverlay visible={loading} message="Downloading QR code..." />
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
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  summaryCard: {
    marginBottom: theme.spacing.xl,
  },
  summaryTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
  summaryValue: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  actions: {
    marginTop: theme.spacing.md,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
});

export default QRGenerateScreen; 