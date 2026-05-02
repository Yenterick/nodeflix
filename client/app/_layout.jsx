import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { useFonts } from '@expo-google-fonts/funnel-display';
import { View, StyleSheet, Platform } from 'react-native';

// Module imports
import { funnelDisplayFonts } from '../assets/fonts/funnelDisplay';
import { OrientationTransitionProvider, useOrientationTransition } from '../context/OrientationTransitionContext';
import colorScheme from '../assets/color/colorScheme';

// Root layout
export default function RootLayout() {
    // Load custom fonts
    const loadedFont = useFonts(funnelDisplayFonts);

    return (
        <>
            <GlobalWebStyles />
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
        </>
    );
}

// Injects global CSS only on Web for styling scrollbars
function GlobalWebStyles() {
    if (Platform.OS !== 'web') return null;

    // Convert rgb() to rgba() helper
    const addAlpha = (rgbStr, alpha) => rgbStr.replace('rgb', 'rgba').replace(')', `, ${alpha})`);

    return (
        <style type="text/css">
            {`
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                    background: transparent;
                }
                ::-webkit-scrollbar-track {
                    background: ${addAlpha(colorScheme.bgDarkGreen, 0.3)};
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb {
                    background: ${addAlpha(colorScheme.green, 0.8)};
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: ${colorScheme.lightGreen};
                }
                * {
                    scrollbar-width: thin;
                    scrollbar-color: ${addAlpha(colorScheme.green, 0.8)} ${addAlpha(colorScheme.bgDarkGreen, 0.3)};
                }
            `}
        </style>
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

