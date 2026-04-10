import { Stack } from 'expo-router';

// New auth stack layout simulating the deprecated one but using expo-router
export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                animation: 'none',
            }}
        />
    );
}
