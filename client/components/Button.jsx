import { View, Pressable } from 'react-native';

// Module imports
import { funnelDisplay } from '../assets/fonts/funnelDisplay';
import colorScheme from '../assets/color/colorScheme';

// Button component
const Button  = ({
        color = colorScheme.lightGreen,
        borderRadius = 12,
        onPress,
        style,
        children
    }) => {

    return(
        <View>
            <Pressable
                style={[
                    {
                        width: '100%',
                        backgroundColor: color,
                        borderRadius: borderRadius,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        gap: 8
                    }
                , style]}
                onPress={() => {onPress()}}
            >
                {children}
            </Pressable>
        </View>
    );
}

export default Button;

