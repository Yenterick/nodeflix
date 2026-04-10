import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

// New main stack layout simulating the deprecated one but using expo-router (LIQUID GLASS LET'S GOOOO)
export default function MainLayout() {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <Label>Home</Label>
                <Icon sf="house.fill" md="home" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="movies">
                <Label>Movies</Label>
                <Icon sf="play.rectangle.fill" md="movie" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="series">
                <Label>Series</Label>
                <Icon sf="tv.fill" md="tv" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="logout">
                <Label>Exit</Label>
                <Icon sf="arrow.right.square.fill" md="logout" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
