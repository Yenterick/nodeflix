import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { useFonts } from '@expo-google-fonts/funnel-display';

// Module imports
import { funnelDisplayFonts } from '../assets/fonts/funnelDisplay';

// Root layout
export default function RootLayout() {
    // Load custom fonts
    const loadedFont = useFonts(funnelDisplayFonts);

    return (
        <SafeAreaProvider>
            <ThemeProvider value={DarkTheme}>
                <StatusBar style="light" />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        gestureEnabled: false,
                    }}
                >
                    {/* Splash Screen */}
                    <Stack.Screen name="index" options={{ animation: 'none' }} />

                    {/* Auth group: login, register, profile-selector */}
                    <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />

                    {/* Main group: NativeTabs (home, movies, series, logout) */}
                    <Stack.Screen name="(main)" />

                    {/* VideoPlayer */}
                    <Stack.Screen
                        name="video-player"
                        options={{
                            presentation: 'fullScreenModal',
                            animation: 'fade',
                        }}
                    />
                </Stack>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
