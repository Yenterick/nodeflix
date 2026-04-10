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

const getIconName = (routeName) => {
    switch (routeName) {
        case 'index': return 'home';
        case 'movies': return 'local-movies';
        case 'series': return 'smart-display';
        case 'search': return 'search';
        case 'logout': return 'logout';
        default: return 'circle';
    }
}

const getLabelName = (routeName) => {
    switch (routeName) {
        case 'index': return 'Home';
        case 'movies': return 'Movies';
        case 'series': return 'Series';
        case 'search': return 'Search';
        case 'logout': return 'Exit';
        default: return routeName;
    }
}

const Footer = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();
    const BUTTON_COUNT = state.routes.length;
    const BUTTON_WIDTH = width / BUTTON_COUNT;

    // Shared value hook to animate
    const translateX = useSharedValue(0);

    useEffect(() => {
        translateX.value = withTiming(state.index * BUTTON_WIDTH, {
            duration: 250
        });
    }, [state.index, BUTTON_WIDTH]);

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

            {state.routes.map((route, index) => {
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        style={styles.footerButton}
                        onPress={onPress}
                    >
                        <MaterialIcons
                            name={getIconName(route.name)}
                            size={24}
                            color={isFocused ? colorScheme.green : 'white'}
                        />
                        <Text style={[
                            funnelDisplay.semibold,
                            styles.footerButtonText,
                            { color: isFocused ? colorScheme.green : 'white' }
                        ]}>
                            {getLabelName(route.name)}
                        </Text>
                    </TouchableOpacity>
                );
            })}
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
        fontSize: 12
    }
});

export default Footer;