import { StyleSheet } from 'react-native';

export const historyScreenStyles = StyleSheet.create({
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
