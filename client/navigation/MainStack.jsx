import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Module and components imports
import Footer from '../components/Footer';
import Index from '../screens/main/Index';
import Movies from '../screens/main/Movies';

// Stack creation
const Tab = createBottomTabNavigator();

// Main Stack (Index, Movies, Series, Log Out)
const MainStack = ({}) => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <Footer {...props} />}
        >
            <Tab.Screen name="Index" component={Index} />
            <Tab.Screen name="Movies" component={Movies} />
            {/* TODO: Implement series Tab */}
        </Tab.Navigator>
    );
}

export default MainStack;