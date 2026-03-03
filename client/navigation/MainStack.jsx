import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Module and components imports
import MainLayout from '../components/MainLayout';
import Index from '../screens/main/Index';

// Stack creation
const Stack = createNativeStackNavigator();

// Main Stack (Index ...)
const MainStack = ({}) => {
    return (
        <MainLayout>
            <Stack.Navigator screenOptions={{ 
                    headerShown: false,
                    unmountOnBlur: false,
                    contentStyle: { backgroundColor: 'transparent' }
            }}>
                    <Stack.Screen name='Index' component={Index} />  
            </Stack.Navigator>
        </MainLayout>
    );
}

export default MainStack;