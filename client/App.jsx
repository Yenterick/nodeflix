import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Modules and components imports
import AuthStack from './navigation/AuthStack';
import MainStack from './navigation/MainStack';

export default function App() {

  // Main windows stack
  const RootStack = createNativeStackNavigator({
    screenOptions: {
      headerShown: false,
      gestureEnabled: false,
    },
    screens: {
      Auth: { screen: AuthStack },
      Main: { screen: MainStack },
    },
  });

  // Navigation component
  const Navigation = createStaticNavigation(RootStack);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Navigation />
    </SafeAreaProvider>
  );
}