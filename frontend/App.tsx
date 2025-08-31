import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import { WheelScreen } from './src/pages/WheelScreen';
import { HistoryScreen } from './src/pages/HistoryScreen';
import { SettingsScreen } from './src/pages/SettingsScreen';
import { useAuthStore } from './src/store/authStore';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4ADE80', // Green
        tabBarInactiveTintColor: '#64748B', // Slate gray
        tabBarStyle: {
          backgroundColor: '#0F172A', // Navy
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60 + (Platform.OS === 'android' ? insets.bottom : 0),
          paddingBottom: Platform.OS === 'android' ? insets.bottom : 8,
          paddingTop: 8,
          paddingHorizontal: 0,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
        <Tab.Screen
          name="Wheel"
          component={WheelScreen}
          options={{
            title: 'Spin & Win',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? "game-controller" : "game-controller-outline"} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: 'History',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? "time" : "time-outline"} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? "settings" : "settings-outline"} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
}

export default function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize Firebase authentication
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
