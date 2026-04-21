import { Pressable } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

// Module imports
import colorScheme from '../assets/color/colorScheme';

// Create animated component
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Button component
const Button = ({
    color = colorScheme.green,
    borderRadius = 12,
    onPress,
    style,
    children,
    disabled,
    testId
}) => {

    // Animation value
    const scale = useSharedValue(1);

    // Animated style
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // Handlers
    const onPressIn = () => {
        scale.value = withSpring(0.9, {
            mass: 1,
            damping: 10,
            stiffness: 150,
        });
    };

    const onPressOut = () => {
        scale.value = withSpring(1, {
            mass: 1,
            damping: 10,
            stiffness: 150,
        });
    };

    return (
        <AnimatedPressable
            accessibilityRole="button"
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPress}
            disabled={disabled}
            testID={testId}
            style={[
                {
                    alignSelf: 'auto',
                    backgroundColor: color,
                    borderRadius: borderRadius,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    gap: 8,
                    shadowColor: color,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 10,
                    minHeight: 46,
                    opacity: disabled ? 0.6 : 1
                },
                style,
                animatedStyle
            ]}
        >
            {children}
        </AnimatedPressable>
    );
};

export default Button;