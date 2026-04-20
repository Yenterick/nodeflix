import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { useFonts } from '@expo-google-fonts/funnel-display';
import { View, StyleSheet } from 'react-native';

// Module imports
import { funnelDisplayFonts } from '../assets/fonts/funnelDisplay';
import { OrientationTransitionProvider, useOrientationTransition } from '../context/OrientationTransitionContext';

// Root layout
export default function RootLayout() {
    // Load custom fonts
    const loadedFont = useFonts(funnelDisplayFonts);

    return (
        <SafeAreaProvider>
            <ThemeProvider value={DarkTheme}>
                <OrientationTransitionProvider>
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
                    {/* Global black overlay for orientation transitions (e.g. exiting VideoPlayer) */}
                    <OrientationOverlay />
                </OrientationTransitionProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

// Reads showBlack from context and renders a full-screen black overlay when active
function OrientationOverlay() {
    const { showBlack } = useOrientationTransition();
    if (!showBlack) return null;
    return <View style={styles.blackOverlay} />;
}

const styles = StyleSheet.create({
    blackOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
        zIndex: 9999,
        elevation: 9999,
    }
});

