import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens and components import
import Login from './screens/Login';
import Register from './screens/Register';
import ProfileSelector from './screens/ProfileSelector';

// Module Imports
import { funnelDisplayFonts } from './assets/fonts/funnelDisplay';

// Main function - component
export default function App() {
  // Hook to set the initial app route
  const [initialRoute, setInitialRoute] = useState(null);

  // Hook to load the fonts
  const [fontsLoaded] = useFonts(funnelDisplayFonts);

  // Check if the user is already logged
  useEffect(() => {
    const checkSession = async () => {
      const userId = await AsyncStorage.getItem('userId');
      setInitialRoute(userId ? 'ProfileSelector' : 'Login');
    };

    checkSession();
  }, []);

  // Creates the stack navigator layout
  const RootStack = createNativeStackNavigator({
    initialRouteName: initialRoute,
    screenOptions: { 
      headerShown: false, 
      gestureEnabled: false 
    },
    screens: {
      Login: { screen: Login },
      Register: { screen: Register },
      ProfileSelector: { screen: ProfileSelector },
    },
  });

  const Navigation = createStaticNavigation(RootStack);

  return (
    <SafeAreaProvider>
      <StatusBar style='light' />
      <Navigation />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  
});
