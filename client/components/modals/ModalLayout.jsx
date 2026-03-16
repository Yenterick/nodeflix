import { Pressable, StyleSheet, Modal, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ModalLayout = ({ children, onClose }) => {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            transparent={true}
            visible={true}
            statusBarTranslucent={true}
            navigationBarTranslucent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View
                style={[
                    styles.overlay,
                    {
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom
                    }
                ]}
            >
                <Pressable
                    style={StyleSheet.absoluteFillObject}
                    onPress={onClose}
                />
                <View
                    style={styles.modalContainer}
                >
                    {children}
                </View>
            </View>
        </Modal>
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
        zIndex: 10,
    },

    // Prevents the window from closing the tab
    modalContainer: {

    }
});

export default ModalLayout;