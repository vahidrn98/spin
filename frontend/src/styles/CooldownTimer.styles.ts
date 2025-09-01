import { StyleSheet } from 'react-native';

export const cooldownTimerStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000',
  },
});
