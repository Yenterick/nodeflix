import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from '@expo-google-fonts/funnel-display';

// Modules and components imports
import AuthStack from './navigation/AuthStack';
import MainStack from './navigation/MainStack';
import VideoPlayer from './screens/main/VideoPlayer';
import { funnelDisplayFonts } from './assets/fonts/funnelDisplay';

export default function App() {
  //Load fonts
  const loadedFont = useFonts(funnelDisplayFonts);

  // Main windows stack
  const RootStack = createNativeStackNavigator({
    screenOptions: {
      headerShown: false,
      gestureEnabled: false,
    },
    screens: {
      Auth: { screen: AuthStack },
      Main: { screen: MainStack },
      VideoPlayer: {
        screen: VideoPlayer,
        options: {
          headerShown: false,
          presentation: 'fullScreenModal',
          animation: 'fade'
        }
      }
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