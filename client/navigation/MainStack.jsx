import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Module and components imports
import Index from '../screens/main/Index';

// Stack creation
const Stack = createNativeStackNavigator();

// Main Stack (Index ...)
const MainStack = ({}) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Index' component={Index} />
        </Stack.Navigator>
    );
}

export default MainStack;