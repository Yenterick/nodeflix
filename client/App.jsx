import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens and components import
import Login from './screens/Login';
import Register from './screens/Register';

// Module Imports
import { funnelDisplayFonts } from './assets/fonts/funnelDisplay';

// Creating the Navigator
const rootStack = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  initialRouteName: 'Login',
  screens: {
    Login: { screen: Login },
    Register: { screen: Register }
  }
});

const Navigation = createStaticNavigation(rootStack);

// Main function - component
export default function App() {
  // Loads up the fonts
  const [] = useFonts(funnelDisplayFonts);

  return (
    <SafeAreaProvider>
      <StatusBar style='light' />
      <Navigation />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  
});
