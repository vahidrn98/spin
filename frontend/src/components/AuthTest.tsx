import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';

export const AuthTest: React.FC = () => {
  const { user, isAuthenticated, signIn, signOut } = useAuthStore();

  const handleSignIn = async () => {
    console.log('🔐 Manual sign in triggered');
    await signIn();
  };

  const handleSignOut = async () => {
    console.log('🔐 Manual sign out triggered');
    await signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Authentication Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[
          styles.statusValue,
          isAuthenticated ? styles.statusSuccess : styles.statusError
        ]}>
          {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
        </Text>
      </View>

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userLabel}>User ID:</Text>
          <Text style={styles.userValue}>{user.uid}</Text>
          <Text style={styles.userLabel}>Anonymous:</Text>
          <Text style={styles.userValue}>{user.isAnonymous ? 'Yes' : 'No'}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.signInButton]}
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.helpText}>
        💡 Check console logs for authentication details
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
