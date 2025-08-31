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
import { functions } from '../../firebase.config';

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
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, user } = useAuthStore();

  const fetchHistory = async (isRefresh = false) => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please sign in to view history.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('📚 Attempting to fetch history from Firebase...');
      console.log('🔐 Authentication status:', { isAuthenticated });
      console.log('👤 Current user:', user ? { uid: user.uid, isAnonymous: user.isAnonymous } : 'No user');
      
      const getHistory = functions().httpsCallable('getHistory');
      
      const currentOffset = isRefresh ? 0 : offset;
      console.log('📊 Requesting history with params:', { limit: 20, offset: currentOffset });
      
      const result = await getHistory({
        limit: 20,
        offset: currentOffset,
        userId: user?.uid, // Pass user ID for emulator testing
      });

      const data = result.data as any;
      console.log('✅ Firebase history result:', data);
      
             if (data.success) {
         const newSpins = data.spins.map((spin: any) => ({
           id: spin.id,
           segmentId: spin.segmentId,
           prize: spin.prize,
           timestamp: new Date(spin.timestamp),
           label: spin.prize.description,
         }));

         // Debug: Check for duplicate IDs
         const ids = newSpins.map(spin => spin.id);
         const uniqueIds = new Set(ids);
         if (ids.length !== uniqueIds.size) {
           console.warn('⚠️ Duplicate IDs detected:', ids.filter((id, index) => ids.indexOf(id) !== index));
         }

                 if (isRefresh) {
           setSpins(newSpins);
           setOffset(20);
         } else {
           // Prevent duplicate spins by filtering out existing IDs
           setSpins(prev => {
             const existingIds = new Set(prev.map(spin => spin.id));
             const uniqueNewSpins = newSpins.filter(spin => !existingIds.has(spin.id));
             return [...prev, ...uniqueNewSpins];
           });
           setOffset(prev => prev + 20);
         }
        
        setHasMore(data.hasMore);
        console.log('✅ History loaded from Firebase:', newSpins.length, 'spins');
      } else {
        throw new Error('Failed to load history from Firebase');
      }
      
    } catch (error: any) {
      console.error('❌ History fetch error:', error);
      setError('Failed to load history. Please try again.');
      
      // Clear spins on error to show empty state
      if (isRefresh) {
        setSpins([]);
        setOffset(0);
        setHasMore(false);
      }
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
    if (!loading && hasMore && !error) {
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
      {error ? (
        <>
          <Text style={styles.emptyStateText}>Unable to load history</Text>
          <Text style={styles.emptyStateSubtext}>
            {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchHistory(true)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.emptyStateText}>No spins yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start spinning to see your history here!
          </Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spin History</Text>
        <Text style={styles.subtitle}>
          Your past {spins.length} spins
        </Text>
        {user && (
          <Text style={styles.userInfo}>
            User: {user.uid.substring(0, 8)}... ({user.isAnonymous ? 'Anonymous' : 'Authenticated'})
          </Text>
        )}
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
    backgroundColor: '#0F172A', // Navy background
  },
  header: {
    padding: 20,
    backgroundColor: '#1E293B', // Dark slate background
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // Dark border
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC', // Light text
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8', // Light gray text
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 12,
    color: '#64748B', // Muted gray text
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'monospace',
  },
  listContainer: {
    padding: 20,
  },
  spinItem: {
    backgroundColor: '#1E293B', // Dark slate background
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#334155', // Dark border
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
    color: '#F8FAFC', // Light text
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
    color: '#4ADE80', // Green accent
  },
  spinDate: {
    fontSize: 12,
    color: '#94A3B8', // Light gray text
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#94A3B8', // Light gray text
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748B', // Muted gray text
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6', // Blue button
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#94A3B8', // Light gray text
  },
});
