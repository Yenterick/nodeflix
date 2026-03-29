import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

// Module imports 
import colorScheme from '../assets/color/colorScheme';
import { funnelDisplay } from '../assets/fonts/funnelDisplay';

// Constants needed to get the button width
const { width } = Dimensions.get('window');
const BUTTON_COUNT = 4;
const BUTTON_WIDTH = width / BUTTON_COUNT;

const Footer = ({ state, navigation }) => {
    const insets = useSafeAreaInsets();

    // Shared value hook to animate
    const translateX = useSharedValue(0);

    useEffect(() => {
        translateX.value = withTiming(state.index * BUTTON_WIDTH, {
            duration: 250
        });
    }, [state.index]);

    // Translating the X position to slide
    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value }
        ]
    }));

    return (
        <View
            style={[
                styles.footer,
                { paddingBottom: insets.bottom }
            ]}
        >
            {/* Indicator */}
            <Animated.View
                style={[
                    styles.indicator,
                    { width: BUTTON_WIDTH },
                    animatedIndicatorStyle
                ]}
            />

            {/* Home */}
            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => navigation.navigate('Index')}
            >
                <MaterialIcons
                    name="home"
                    size={36}
                    color={state.index === 0 ? colorScheme.green : 'white'}
                />
                <Text style={[
                    funnelDisplay.semibold,
                    styles.footerButtonText,
                    { color: state.index === 0 ? colorScheme.green : 'white' }
                ]}>
                    Home
                </Text>
            </TouchableOpacity>

            {/* Movies */}
            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => navigation.navigate('Movies')}
            >
                <MaterialIcons
                    name="local-movies"
                    size={36}
                    color={state.index === 1 ? colorScheme.green : 'white'}
                />
                <Text style={[
                    funnelDisplay.semibold,
                    styles.footerButtonText,
                    { color: state.index === 1 ? colorScheme.green : 'white' }
                ]}>
                    Movies
                </Text>
            </TouchableOpacity>

            {/* Series */}
            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => navigation.navigate('Series')}
            >
                <MaterialIcons
                    name="smart-display"
                    size={36}
                    color={state.index === 2 ? colorScheme.green : 'white'}
                />
                <Text style={[
                    funnelDisplay.semibold,
                    styles.footerButtonText,
                    { color: state.index === 2 ? colorScheme.green : 'white' }
                ]}>
                    Series
                </Text>
            </TouchableOpacity>

            {/* Exit */}
            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Auth' }],
                    });
                }}
            >
                <MaterialIcons
                    name="logout"
                    size={36}
                    color="#FF6B6B"
                />
                <Text style={[
                    funnelDisplay.semibold,
                    styles.footerButtonText,
                    { color: '#FF6B6B' }
                ]}>
                    Exit
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    // General styles config
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: colorScheme.bgDarkGreen,
        position: 'relative'
    },

    indicator: {
        position: 'absolute',
        top: 0,
        height: 2,
        backgroundColor: colorScheme.green,
    },

    footerButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },

    footerButtonText: {
        textAlign: 'center',
    }
});

export default Footer;