import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { settingsScreenStyles } from '../styles';
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
    <SafeAreaView style={settingsScreenStyles.container}>
      <View style={settingsScreenStyles.header}>
        <Text style={settingsScreenStyles.title}>Settings</Text>
      </View>

      <View style={settingsScreenStyles.section}>
        <Text style={settingsScreenStyles.sectionTitle}>Account</Text>
        <View style={settingsScreenStyles.settingItem}>
          <Text style={settingsScreenStyles.settingLabel}>User ID</Text>
          <Text style={settingsScreenStyles.settingValue}>{user?.uid || 'Not signed in'}</Text>
        </View>
        {user?.email && (
          <View style={settingsScreenStyles.settingItem}>
            <Text style={settingsScreenStyles.settingLabel}>Email</Text>
            <Text style={settingsScreenStyles.settingValue}>{user.email}</Text>
          </View>
        )}
      </View>

      <View style={settingsScreenStyles.section}>
        <Text style={settingsScreenStyles.sectionTitle}>App</Text>
        <View style={settingsScreenStyles.settingItem}>
          <Text style={settingsScreenStyles.settingLabel}>Version</Text>
          <Text style={settingsScreenStyles.settingValue}>1.0.0</Text>
        </View>
        <View style={settingsScreenStyles.settingItem}>
          <Text style={settingsScreenStyles.settingLabel}>Build</Text>
          <Text style={settingsScreenStyles.settingValue}>1</Text>
        </View>
      </View>

      {/* <TouchableOpacity style={settingsScreenStyles.signOutButton} onPress={handleSignOut}>
        <Text style={settingsScreenStyles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};


