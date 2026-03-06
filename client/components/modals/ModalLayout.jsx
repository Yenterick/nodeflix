import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Module imports
import colorScheme from '../../assets/color/colorScheme';

// Background for modals
const ModalLayout = ({ children }) => {
    // Insets hook
    const insets = useSafeAreaInsets();

    return(
        <View
            style={
                {   
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 100,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }   
        >
            {children}
        </View>
    );
}

export default ModalLayout