import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Tabs } from 'expo-router';
import { DynamicColorIOS } from 'react-native';

// Module and components imports
import colorScheme from '../../../assets/color/colorScheme';
import Footer from '../../../components/Footer';

export default function TabLayout() {
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
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <Label>Search</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}