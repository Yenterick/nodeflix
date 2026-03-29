import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Modules and components imports
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ProfileSelector from '../screens/auth/ProfileSelector';

// Stack creation
const Stack = createNativeStackNavigator();

// Auth Stack (Login, Register and Profile Selector)
const AuthStack = ({ Navigator }) => {

    // Hook for initial route
    const [initialRoute, setInitialRoute] = useState();

    // Checks if the user is already logged
    useEffect(() => {
        const checkSession = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                setInitialRoute(userId ? 'ProfileSelector' : 'Login');
            } catch (error) {
                setInitialRoute('Login');
            }
        };

        checkSession();
    }, []);

    // Wait until the initial route is loaded
    if (!initialRoute) {
        return null;
    }

    return (
        <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
                headerShown: false,
                gestureEnabled: false
            }}
        >
            <Stack.Screen 
                name='Login' 
                component={Login} 
                options={{ animation: 'none' }}
            />
            <Stack.Screen 
                name='ProfileSelector' 
                component={ProfileSelector} 
                options={{ animation: 'none' }}
            />
            <Stack.Screen 
                name='Register' 
                component={Register} 
                options={{ animation: 'none' }}
            />
        </Stack.Navigator>
    );
}

export default AuthStack;