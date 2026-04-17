import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Tabs } from 'expo-router';
import { DynamicColorIOS } from 'react-native';

// Module and components imports
import colorScheme from '../../assets/color/colorScheme';
import Footer from '../../components/Footer';

// New main stack layout simulating the deprecated one but using expo-router (LIQUID GLASS LET'S GOOOO)
export default function MainLayout() {
    // Android fallback bc NativeTabs on Android is pretty unstable
    if (Platform.OS !== 'ios') {
        return (
            <Tabs
                tabBar={(props) => <Footer {...props} />}
                screenOptions={{ headerShown: false }}
            >
                <Tabs.Screen name='index' />
                <Tabs.Screen name='movies' />
                <Tabs.Screen name='series' />
                <Tabs.Screen name='search' />
            </Tabs>
        );
    }

    // iOS and others NativeTabs
    return (
        <NativeTabs
            minimizeBehavior='onScrollDown'
            labelStyle={{
                color: DynamicColorIOS({
                    dark: colorScheme.green,
                    light: colorScheme.green,
                }),
            }}
            tintColor={DynamicColorIOS({
                dark: colorScheme.green,
                light: colorScheme.green,
            })}
        >
            <NativeTabs.Trigger name="index">
                <Label>Home</Label>
                <Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="movies">
                <Label>Movies</Label>
                <Icon sf={{ default: 'play.rectangle', selected: 'play.rectangle.fill' }} md="movie" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="series">
                <Label>Series</Label>
                <Icon sf={{ default: 'tv', selected: 'tv.fill' }} md="tv" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="search" role="search">
                <Label>Search</Label>
                <Icon sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }} md="search" />
            </NativeTabs.Trigger>

            {/* <NativeTabs.Trigger name="logout">
                <Label>Exit</Label>
                <Icon sf="arrow.right.square.fill" md="logout" />
            </NativeTabs.Trigger> */}
        </NativeTabs>
    );
}
