import { useCallback } from 'react';
import { View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Logout handler that acts like a page bc I have free will hehe
export default function Logout() {
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const doLogout = async () => {
                router.replace('/(auth)/profile-selector');
            };

            doLogout();
        }, [])
    );

    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
}
