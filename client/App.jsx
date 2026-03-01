import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Module Imports
import Login from './screens/Login';
import { funnelDisplayFonts } from './assets/fonts/funnelDisplay';

// Main function - component
export default function App() {
  // Loads up the fonts
  const [] = useFonts(funnelDisplayFonts);

  return (
    <SafeAreaProvider>
      <StatusBar style='light' />
      <Login/>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  
});
