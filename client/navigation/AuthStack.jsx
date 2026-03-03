import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Modules and components imports
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ProfileSelector from '../screens/auth/ProfileSelector';

// Stack creation
const Stack = createNativeStackNavigator();

// Auth Stack (Login, Register and Profile Selector)
const AuthStack = ({ navigation }) => {

    // Checks if the user is already logged
    useEffect(() => {
        const checkSession = async () => {
            const userId = await AsyncStorage.getItem('userId');

            if (userId) {
                navigation.navigate('ProfileSelector');
            }
        };

        checkSession();
    }, []);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileSelector" component={ProfileSelector} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    );
}

export default AuthStack;