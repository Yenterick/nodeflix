import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Module and components imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';

const Index = () => {

    // insets hook
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.background,
                {
                    flex: 1,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom
                }
            ]}
        >
            <Text
                style={[
                    funnelDisplay.bold,
                    {
                        color: 'white',
                        fontSize: 36,
                        textAlign: 'center'
                    }
                ]}
            >
                WIP: Navigate to movies or series to start watching!
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    // General styles config
    background: {
        backgroundColor: colorScheme.darkGreen,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Index;