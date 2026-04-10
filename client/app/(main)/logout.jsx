import { useCallback } from 'react';
import { View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Find another method to logout so it doesn's acts like a tab
export default function Logout() {
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const doLogout = async () => {
                await AsyncStorage.clear();
                router.replace('/(auth)/login');
            };

            doLogout();
        }, [])
    );

    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
}
