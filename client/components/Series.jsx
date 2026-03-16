import { View, Pressable, Image } from 'react-native';

// Module and components imports
import colorScheme from '../assets/color/colorScheme';
import { funnelDisplay } from '../assets/fonts/funnelDisplay';

const Series = ({ uriSource, onPress, style }) => {
    return (
        <Pressable
            onPress={onPress}
            style={[
                {
                    width: 120,
                    height: 180,
                    marginHorizontal: 10
                }
            , style]}
        >
            <Image
                source={{ uri: uriSource }}
                style={
                    {
                        width: '100%',
                        height: '100%',
                        borderRadius: 10
                    }
                }
            >
            </Image>
        </Pressable>
    )
}

export default Series;

