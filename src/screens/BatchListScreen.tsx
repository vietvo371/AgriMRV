import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import BatchCard from '../component/BatchCard';
import SelectCustom from '../component/SelectCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import api from '../utils/Api';

interface BatchListScreenProps {
  navigation: any;
}

interface BatchListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'completed' | 'cancelled';
  sort?: 'newest' | 'oldest';
}

interface BatchListResponse {
  data: {
    items: Array<{
      id: string;
      product_name: string;
      category: string;
      weight: number;
      harvest_date: string;
      cultivation_method: string;
      status: 'active' | 'completed' | 'cancelled';
      stats: {
        total_scans: number;
        unique_customers: number;
        average_rating: number;
      };
      images: {
        product: string | null;
      };
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      total_pages: number;
    };
  };
  message: string;
}


const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];


const BatchListScreen: React.FC<BatchListScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [batches, setBatches] = useState<BatchListResponse['data']['items']>([]);
  const [pagination, setPagination] = useState<BatchListResponse['data']['pagination']>({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 0
  });
  const [sortOptions, setSortOptions] = useState<any[]>([]);
  const fetchSortOptions = async () => {
    try {
      const response = await api.get<any>('/categories/all-public');
      console.log(response.data);
      setSortOptions(response.data.data.map((item: any) => ({
        label: item.name,
        value: item.id
      })));
    } catch (error: any) {
      console.error('Error fetching categories:', error.response);
    }
  };

  useEffect(() => {
    fetchSortOptions();
  }, []);

  const fetchBatches = async (page = currentPage) => {
    setLoading(true);
    try {
      const response = await api.get<BatchListResponse>('/batches/all-farmer', {
        params: {
          page,
          limit: 10,
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchQuery || undefined,
          sort: sortOrder
        }
      });
      console.log(response.data);
      setBatches(response.data.data.items);
      setPagination(response.data.data.pagination);
    } catch (error: any) {
      console.error('Error fetching batches:', error.response);
      // TODO: Show error message
    } finally {
      setLoading(false);
    }
  };

  // Fetch when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page
    fetchBatches(1);
  }, [statusFilter, searchQuery, sortOrder]);

  // Handle pagination
  const handleLoadMore = () => {
    if (currentPage < pagination.total_pages && !loading) {
      setCurrentPage(prev => prev + 1);
      fetchBatches(currentPage + 1);
    }
  };

  const handleBatchPress = (batchId: string) => {
    navigation.navigate('BatchDetail', { batchId });
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

      <View style={styles.filterRow}>
        <View style={styles.filterItem}>
          <SelectCustom
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="Status"
            containerStyle={styles.selectContainer}
          />
        </View>
        <View style={styles.filterItem}>
          <SelectCustom
            value={sortOrder}
            onChange={(value) => setSortOrder(value as any)}
            options={sortOptions}
            placeholder="Sort by"
            containerStyle={styles.selectContainer}
          />
        </View>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {pagination.total} {pagination.total === 1 ? 'batch' : 'batches'} found
        </Text>
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
      <Header
        title="My Batches"
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={batches}
        renderItem={({ item }) => (
          <BatchCard
            batch={item as any}
            onPress={() => handleBatchPress(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmpty : null}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={loading && currentPage === 1}
        onRefresh={() => {
          setCurrentPage(1);
          fetchBatches(1);
        }}
      />
      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    // marginBottom: theme.spacing.md,
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

export default BatchListScreen; 