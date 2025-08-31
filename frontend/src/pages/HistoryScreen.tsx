import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuthStore } from '../store/authStore';

interface SpinHistory {
  id: string;
  segmentId: number;
  prize: {
    type: string;
    amount: number;
    description: string;
  };
  timestamp: Date;
  label: string;
}

export const HistoryScreen: React.FC = () => {
  const [spins, setSpins] = useState<SpinHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  
  const { isAuthenticated } = useAuthStore();

  const fetchHistory = async (isRefresh = false) => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please sign in to view history.');
      return;
    }

    try {
      setLoading(true);
      
      const { getFunctions, httpsCallable } = await import('@react-native-firebase/functions');
      const functions = getFunctions();
      const getHistory = httpsCallable(functions, 'getHistory');

      const currentOffset = isRefresh ? 0 : offset;
      const result = await getHistory({
        limit: 20,
        offset: currentOffset,
      });

      const data = result.data as any;
      
      if (data.success) {
        const newSpins = data.spins.map((spin: any) => ({
          id: spin.id,
          segmentId: spin.segmentId,
          prize: spin.prize,
          timestamp: new Date(spin.timestamp),
          label: spin.prize.description,
        }));

        if (isRefresh) {
          setSpins(newSpins);
          setOffset(20);
        } else {
          setSpins(prev => [...prev, ...newSpins]);
          setOffset(prev => prev + 20);
        }
        
        setHasMore(data.hasMore);
      }
    } catch (error: any) {
      console.error('History fetch error:', error);
      Alert.alert('Error', 'Failed to load history. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory(true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchHistory();
    }
  };

  useEffect(() => {
    fetchHistory(true);
  }, [isAuthenticated]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPrizeIcon = (type: string) => {
    switch (type) {
      case 'coins':
        return '🪙';
      case 'special':
        return '💎';
      case 'bonus':
        return '⭐';
      case 'jackpot':
        return '🔥';
      default:
        return '🎁';
    }
  };

  const renderSpinItem = ({ item }: { item: SpinHistory }) => (
    <View style={styles.spinItem}>
      <View style={styles.spinHeader}>
        <Text style={styles.spinLabel}>{item.label}</Text>
        <Text style={styles.spinIcon}>
          {getPrizeIcon(item.prize.type)}
        </Text>
      </View>
      <View style={styles.spinDetails}>
        <Text style={styles.spinAmount}>
          {item.prize.amount}
          {item.prize.type === 'coins' && ' Coins'}
          {item.prize.type === 'bonus' && 'x Multiplier'}
        </Text>
        <Text style={styles.spinDate}>{formatDate(item.timestamp)}</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No spins yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Start spinning to see your history here!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spin History</Text>
        <Text style={styles.subtitle}>
          Your past {spins.length} spins
        </Text>
      </View>

      <FlatList
        data={spins}
        renderItem={renderSpinItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          loading && hasMore ? (
            <View style={styles.loadingFooter}>
              <Text style={styles.loadingText}>Loading more...</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 20,
  },
  spinItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  spinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spinLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  spinIcon: {
    fontSize: 20,
  },
  spinDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spinAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  spinDate: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
});
