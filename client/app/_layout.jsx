import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from '@expo-google-fonts/funnel-display';

// Module imports
import { funnelDisplayFonts } from '../assets/fonts/funnelDisplay';

// Root layout — wraps ALL routes with providers and a Stack navigator
export default function RootLayout() {
    // Load custom fonts
    const loadedFont = useFonts(funnelDisplayFonts);

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            >
                {/* Redirect/splash screen */}
                <Stack.Screen name="index" options={{ animation: 'none' }} />

                {/* Auth group: login, register, profile-selector */}
                <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />

                {/* Main group: NativeTabs (home, movies, series, logout) */}
                <Stack.Screen name="(main)" />

                {/* VideoPlayer presented as full-screen modal */}
                <Stack.Screen
                    name="video-player"
                    options={{
                        presentation: 'fullScreenModal',
                        animation: 'fade',
                    }}
                />
            </Stack>
        </SafeAreaProvider>
    );
}
