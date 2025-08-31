import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { WheelScreen } from './src/pages/WheelScreen';
import { HistoryScreen } from './src/pages/HistoryScreen';
import { SettingsScreen } from './src/pages/SettingsScreen';
import { useAuthStore } from './src/store/authStore';

const Tab = createBottomTabNavigator();

export default function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize Firebase authentication
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
          },
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen
          name="Wheel"
          component={WheelScreen}
          options={{
            title: '🎰 Spin & Win',
            tabBarIcon: ({ color, size }) => (
              <span style={{ color, fontSize: size }}>🎰</span>
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: '📋 History',
            tabBarIcon: ({ color, size }) => (
              <span style={{ color, fontSize: size }}>📋</span>
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: '⚙️ Settings',
            tabBarIcon: ({ color, size }) => (
              <span style={{ color, fontSize: size }}>⚙️</span>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
