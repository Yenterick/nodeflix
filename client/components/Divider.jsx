import { View } from 'react-native';

// Divider component that simulates <hr/> in HTML
const Divider = ({
        orientation = 'horizontal', 
        size = 1,
        length = '100%',
        color = 'black',
        opacity = 0.4,
        style
    }) => {

    // Orientation checker
    const isHorizontal = orientation === 'horizontal';

    return (
        <View
            style={[
                    {
                        backgroundColor: color,
                        opacity: opacity,
                        width: isHorizontal ? length : size,
                        height: isHorizontal ? size : length,
                        borderRadius: 50
                    },
                style
            ]}
        />
    );
};

export default Divider;