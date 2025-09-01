import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { authTestStyles } from '../styles';

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
    <View style={authTestStyles.container}>
      <Text style={authTestStyles.title}>🔐 Authentication Test</Text>
      
      <View style={authTestStyles.statusContainer}>
        <Text style={authTestStyles.statusLabel}>Status:</Text>
        <Text style={[
          authTestStyles.statusValue,
          isAuthenticated ? authTestStyles.statusSuccess : authTestStyles.statusError
        ]}>
          {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
        </Text>
      </View>

      {user && (
        <View style={authTestStyles.userInfo}>
          <Text style={authTestStyles.userLabel}>User ID:</Text>
          <Text style={authTestStyles.userValue}>{user.uid}</Text>
          <Text style={authTestStyles.userLabel}>Anonymous:</Text>
          <Text style={authTestStyles.userValue}>{user.isAnonymous ? 'Yes' : 'No'}</Text>
        </View>
      )}

      <View style={authTestStyles.buttonContainer}>
        <TouchableOpacity
          style={[authTestStyles.button, authTestStyles.signInButton]}
          onPress={handleSignIn}
        >
          <Text style={authTestStyles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[authTestStyles.button, authTestStyles.signOutButton]}
          onPress={handleSignOut}
        >
          <Text style={authTestStyles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={authTestStyles.helpText}>
        💡 Check console logs for authentication details
      </Text>
    </View>
  );
};


