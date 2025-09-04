import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, SafeAreaView, Platform } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList, TabScreenProps } from '../navigation/types';
import { theme } from '../theme/colors';
import ButtonCustom from '../component/ButtonCustom';
import Card from '../component/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../component/Header';
import InputCustom from '../component/InputCustom';
import SelectCustom from '../component/SelectCustom';
type Props = CompositeScreenProps<
  TabScreenProps<'Applications'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type LoanApprovalScreenProps = Props;

const LoanApprovalScreen: React.FC<Props> = ({ navigation, route }) => {
  const [amount, setAmount] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [farmDetails, setFarmDetails] = useState<string>('');
  const [collateral, setCollateral] = useState<string>('');
  const [repaymentPlan, setRepaymentPlan] = useState<string>('');
  const purposes = ['Working capital', 'Equipment', 'Seeds & inputs', 'Irrigation'];
  const purposeOptions = purposes.map(p => ({ label: p, value: p }));


  const creditScore = 742;
  const bank = {
    name: 'AgriBank Plus',
    rate: '4.5%-7.2%',
    max: '$500K',
  };

  const onSubmit = () => {
    // basic validation
    if (!amount || !purpose) {
      // use simple alert; in your app you may use Toast
      console.warn('Please enter amount and select purpose');
      return;
    }
    (navigation as any).navigate('Applications');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <LinearGradient colors={[theme.colors.secondary + '30', theme.colors.white]} style={{ flex: 1 }}>
        <Header title="Loan Approval" onBack={() => (navigation as any).goBack?.()} />
        <ScrollView contentContainerStyle={styles.container}>
          {/* Selected bank summary */}
          <View style={[styles.headerCard, styles.elevation]}>
            <View style={styles.headerRow}>
              <View style={styles.logoBox}>
                <Icon name="bank" size={20} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bankName}>{bank.name}</Text>
                <View style={styles.rowStart}>
                  <Text style={styles.muted}>Rate: {bank.rate}</Text>
                  <Text style={[styles.muted, { marginLeft: 14 }]}>Max: {bank.max}</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Score hint */}
          <View style={[styles.section, styles.infoSection, styles.elevation]}>
            <View style={styles.rowTop}>
              <View style={styles.badgeIcon}>
                <Icon name="shield-check" size={18} color={theme.colors.success} />
              </View>
              <View style={styles.infoTextWrap}>
                <Text style={styles.scoreTitle}>Your Credit Score: {creditScore}</Text>
                <Text style={styles.muted}>You qualify for this lender's best rates based on your AgriCred score.</Text>
              </View>
            </View>
          </View>
          {/* Loan details form */}
          <View style={[styles.section, styles.elevation]}>
            <View style={styles.sectionHeader}>
              <Icon name="file-document-edit-outline" size={22} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Loan Details</Text>
            </View>

            <View style={styles.inlineRow}>
              <InputCustom
                label="Loan Amount"
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                keyboardType="numeric"
                required
                leftIcon="currency-usd"
                containerStyle={{ flex: 1, marginBottom: 0 }}
              />
              <View style={{ width: 12 }} />
              <SelectCustom
                label="Purpose"
                value={purpose}
                onChange={setPurpose}
                options={purposeOptions}
                placeholder="Select purpose"
                containerStyle={{ flex: 1 }}
              />
            </View>

            <InputCustom
              label="Farm Details"
              value={farmDetails}
              onChangeText={setFarmDetails}
              placeholder="Describe your farming operation, crops, and current status..."
              multiline
              inputStyle={{ minHeight: 100, textAlignVertical: 'top' }}
            />

            <InputCustom
              label="Collateral Information"
              value={collateral}
              onChangeText={setCollateral}
              placeholder="Describe assets you can offer as collateral..."
              multiline
              inputStyle={{ minHeight: 100, textAlignVertical: 'top' }}
            />

            <InputCustom
              label="Repayment Plan"
              value={repaymentPlan}
              onChangeText={setRepaymentPlan}
              placeholder="Describe your expected repayment timeline and cash flow..."
              multiline
              inputStyle={{ minHeight: 100, textAlignVertical: 'top' }}
            />
          </View>
          <ButtonCustom
            title="Submit Application"
            icon="send"
            onPress={onSubmit}
            style={styles.submitBtn}
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: theme.spacing.lg },
  rowStart: { flexDirection: 'row', alignItems: 'center' },
  rowTop: { flexDirection: 'row', alignItems: 'flex-start' },

  muted: { color: theme.colors.textLight, fontSize: theme.typography.fontSize.sm },
  headerCard: { backgroundColor: theme.colors.white, borderRadius: 16, padding: theme.spacing.md, marginBottom: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border },
  elevation: { ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 3 } }) },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.border,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bankName: { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.text },
  section: { backgroundColor: theme.colors.white, borderRadius: 16, padding: theme.spacing.md, marginBottom: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.text },
  label: { color: theme.colors.text, marginBottom: 6, fontSize: theme.typography.fontSize.sm },
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  selectInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  inlineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: theme.spacing.sm },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip: { backgroundColor: theme.colors.background, color: theme.colors.text, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  chipActive: { backgroundColor: theme.colors.primary + '15', color: theme.colors.primary },

  infoSection: { backgroundColor: theme.colors.successLight, borderColor: theme.colors.success + '30' },
  badgeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.success + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoTextWrap: { flex: 1, marginRight: 8 },
  scoreTitle: { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.text },

  submitBtn: { marginTop: theme.spacing.sm },
});

export default LoanApprovalScreen;