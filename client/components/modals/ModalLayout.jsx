import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ModalLayout = ({ children, onClose }) => {
    const insets = useSafeAreaInsets();

    return (
        <Pressable
            style={[
                styles.overlay,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom
                }
            ]}
            onPress={onClose}
        >
            <View style={styles.modalContainer}>
                {children}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },

    // Prevents the window from closing the tab
    modalContainer: {
        
    }
});

export default ModalLayout;