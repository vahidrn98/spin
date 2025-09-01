import { StyleSheet } from 'react-native';

export const authTestStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 15,
    margin: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#273544',
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusSuccess: {
    color: '#4ADE80',
  },
  statusError: {
    color: '#EF4444',
  },
  userInfo: {
    backgroundColor: '#273544',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  userLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 5,
  },
  userValue: {
    fontSize: 14,
    color: '#F8FAFC',
    fontWeight: '500',
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#4ADE80',
  },
  signOutButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  helpText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
