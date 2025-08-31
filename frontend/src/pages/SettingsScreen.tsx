import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuthStore } from '../store/authStore';

export const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>User ID</Text>
          <Text style={styles.settingValue}>{user?.uid || 'Not signed in'}</Text>
        </View>
        {user?.email && (
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Email</Text>
            <Text style={styles.settingValue}>{user.email}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Build</Text>
          <Text style={styles.settingValue}>1</Text>
        </View>
      </View>

      {/* <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity> */}
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
