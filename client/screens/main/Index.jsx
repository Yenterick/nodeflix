import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Module and components imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';

const Index = () => {

    // Hooks
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View
            style={[
                styles.background,
                {
                    flex: 1,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom
                }
            ]}
        >
            {Platform.OS === 'ios' && (
                <TouchableOpacity 
                    style={[styles.logoutButton, { top: insets.top + 10 }]}
                    onPress={() => router.replace('/(auth)/profile-selector')}
                >
                    <MaterialIcons name="logout" size={36} color="#FF6B6B" />
                </TouchableOpacity>
            )}

            <Text
                style={[
                    funnelDisplay.bold,
                    {
                        color: 'white',
                        fontSize: 36,
                        textAlign: 'center'
                    }
                ]}
            >
                WIP: Navigate to movies or series to start watching!
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    // General styles config
    background: {
        backgroundColor: colorScheme.darkGreen,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    logoutButton: {
        position: 'absolute',
        right: 20,
        zIndex: 10,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 4, // Visually centers the asymmetrical logout icon
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 50,
    }
})

export default Index;