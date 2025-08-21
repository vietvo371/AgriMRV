import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import RecordCard from '../component/RecordCard';
import { deriveRecentBatches } from '../utils/mockData';
import LinearGradient from 'react-native-linear-gradient';

interface RecordListScreenProps { navigation: any }

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Verified', value: 'completed' },
  { label: 'Submitted', value: 'submitted' },
];


const RecordListScreen: React.FC<RecordListScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'submitted'>('all');
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const data = deriveRecentBatches();
    setRecords(data as any[]);
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchStatus = statusFilter === 'all' ? true : r.status === statusFilter;
      const matchSearch = searchQuery ? r.product_name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      return matchStatus && matchSearch;
    });
  }, [records, statusFilter, searchQuery]);

  const handleRecordPress = (recordId: string) => {
    navigation.navigate('RecordDetail', { recordId });
  };

  const renderHeader = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color={theme.colors.primary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by product name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.textLight}
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Icon name="close-circle" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filterChips}>
        {statusOptions.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, statusFilter === (opt.value as any) && styles.chipActive]}
            onPress={() => setStatusFilter(opt.value as any)}
          >
            <Text style={[styles.chipText, statusFilter === (opt.value as any) && styles.chipTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon
          name="package-variant"
          size={48}
          color={theme.colors.primary}
        />
      </View>
      <Text style={styles.emptyTitle}>No Batches Found</Text>
      <Text style={styles.emptyText}>
        Try adjusting your filters or create a new batch
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateBatch')}
      >
        <Icon name="plus" size={20} color={theme.colors.white} />
        <Text style={styles.createButtonText}>Create New Batch</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="All Records" onBack={() => navigation.goBack()} />
      <LinearGradient
        colors={[theme.colors.secondary + '30', theme.colors.white]}
        style={styles.gradient}>
      <FlatList
        data={filtered}
        renderItem={({ item }) => (
          <RecordCard
            record={item}
            onPress={() => handleRecordPress(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmpty : null}
        showsVerticalScrollIndicator={false}
      />
      </LinearGradient>
      {/* No network loading overlay needed for mock data */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  gradient: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.lg,
    gap: 12,
  },
  filtersContainer: {
    // marginBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
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
  searchInput: {
    flex: 1,
    height: 50,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  clearButton: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
    marginTop: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
  },
  chipActive: {
    backgroundColor: theme.colors.primary + '15',
  },
  chipText: {
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.medium,
  },
  chipTextActive: {
    color: theme.colors.primary,
  },
  filterItem: {
    flex: 1,
  },
  selectContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
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
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  resultsText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 4,
  },
  sortText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
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
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: 8,
  },
  createButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
  },
});

export default RecordListScreen; 