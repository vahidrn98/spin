import { StyleSheet } from 'react-native';

export const settingsScreenStyles = StyleSheet.create({
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
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#1E293B', // Dark slate background
    marginTop: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC', // Light text
    marginVertical: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // Dark border
  },
  settingLabel: {
    fontSize: 16,
    color: '#F8FAFC', // Light text
  },
  settingValue: {
    fontSize: 16,
    color: '#94A3B8', // Light gray text
  },
  signOutButton: {
    backgroundColor: '#EF4444', // Red for sign out
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
