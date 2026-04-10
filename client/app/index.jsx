import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// New entry point for the app
export default function RedirectIndex() {
    const [target, setTarget] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                setTarget(userId ? '/(auth)/profile-selector' : '/(auth)/login');
            } catch {
                setTarget('/(auth)/login');
            }
        };

        checkSession();
    }, []);

    if (!target) return <View style={{ flex: 1, backgroundColor: '#000' }} />;
    return <Redirect href={target} />;
}
