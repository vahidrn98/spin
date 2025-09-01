import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import { historyScreenStyles } from '../styles';
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
    <View style={historyScreenStyles.spinItem}>
      <View style={historyScreenStyles.spinHeader}>
        <Text style={historyScreenStyles.spinLabel}>{item.label}</Text>
        <Text style={historyScreenStyles.spinIcon}>
          {getPrizeIcon(item.prize.type)}
        </Text>
      </View>
      <View style={historyScreenStyles.spinDetails}>
        <Text style={historyScreenStyles.spinAmount}>
          {item.prize.amount}
          {item.prize.type === 'coins' && ' Coins'}
          {item.prize.type === 'bonus' && 'x Multiplier'}
        </Text>
        <Text style={historyScreenStyles.spinDate}>{formatDate(item.timestamp)}</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={historyScreenStyles.emptyState}>
      {error ? (
        <>
          <Text style={historyScreenStyles.emptyStateText}>Unable to load history</Text>
          <Text style={historyScreenStyles.emptyStateSubtext}>
            {error}
          </Text>
          <TouchableOpacity style={historyScreenStyles.retryButton} onPress={() => fetchHistory(true)}>
            <Text style={historyScreenStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={historyScreenStyles.emptyStateText}>No spins yet</Text>
          <Text style={historyScreenStyles.emptyStateSubtext}>
            Start spinning to see your history here!
          </Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={historyScreenStyles.container}>
      <View style={historyScreenStyles.header}>
        <Text style={historyScreenStyles.title}>Spin History</Text>
        <Text style={historyScreenStyles.subtitle}>
          Your past {spins.length} spins
        </Text>
        {user && (
          <Text style={historyScreenStyles.userInfo}>
            User: {user.uid.substring(0, 8)}... ({user.isAnonymous ? 'Anonymous' : 'Authenticated'})
          </Text>
        )}
      </View>

      <FlatList
        data={spins}
        renderItem={renderSpinItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={historyScreenStyles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          loading && hasMore ? (
            <View style={historyScreenStyles.loadingFooter}>
              <Text style={historyScreenStyles.loadingText}>Loading more...</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};


