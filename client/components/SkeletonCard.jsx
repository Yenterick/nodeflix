import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

// Module and components imports
import colorScheme from '../assets/color/colorScheme';

// Placeholder for charging cards
const SkeletonCard = ({ style }) => {
    const opacity = useSharedValue(0.35);

    useEffect(() => {
        opacity.value = withRepeat(withTiming(0.75, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View style={[styles.card, style]}>
            <Animated.View style={[
                StyleSheet.absoluteFill,
                styles.shimmer,
                animatedStyle
            ]} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 120,
        height: 180,
        borderRadius: 10,
        marginHorizontal: 6,
        backgroundColor: colorScheme.bgDarkGreen,
        overflow: 'hidden',
    },
    shimmer: {
        backgroundColor: 'white',
        borderRadius: 10,
    },
});

export default SkeletonCard;
