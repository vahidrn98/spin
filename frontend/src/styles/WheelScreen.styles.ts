import { StyleSheet } from 'react-native';

export const wheelScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Navy background
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#94A3B8', // Light gray text
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC', // Light text
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 22,
    color: '#94A3B8', // Light gray text
    textAlign: 'center',
    paddingTop: 20,
  },
  wheelContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  spinButton: {
    backgroundColor: '#4ADE80', // Green
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#4ADE80',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  spinButtonDisabled: {
    backgroundColor: '#334155', // Dark gray when disabled
    shadowOpacity: 0,
    elevation: 0,
  },
  spinButtonText: {
    color: '#0F172A', // Dark text on green button
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastSpinContainer: {
    backgroundColor: '#1E293B', // Dark slate background
    padding: 20,
    borderRadius: 15,
    marginTop: 20
  },
  lastSpinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  lastSpinIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  lastSpinTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC', // Light text
  },
  lastSpinContent: {
    backgroundColor: '#273544', // Slightly lighter background for content
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3F4A5C',
  },
  lastSpinMessage: {
    fontSize: 16,
    color: '#E2E8F0', // Lighter text for better readability
    marginBottom: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  lastSpinDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastSpinDetail: {
    flex: 1,
    marginRight: 15,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  lastSpinDetailLabel: {
    fontSize: 12,
    color: '#94A3B8', // Light gray text
    marginBottom: 5,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lastSpinDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ADE80', // Green text for values
    textAlign: 'center',
  },
});
