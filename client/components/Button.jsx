import { View, Pressable } from 'react-native';

// Module imports
import { funnelDisplay } from '../assets/fonts/funnelDisplay';
import colorScheme from '../assets/color/colorScheme';

// Button component
const Button  = ({
        color = colorScheme.green,
        borderRadius = 12,
        onPress,
        style,
        children
    }) => {

    return(
        <Pressable
            style={[
                {
                    width: '100%',
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
                }
            , style]}
            onPress={onPress}
        >
            {children}
        </Pressable>
    );
}

export default Button;

