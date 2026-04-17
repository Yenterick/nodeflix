import { Pressable, StyleSheet, Modal, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const ModalLayout = ({ children, onClose }) => {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            transparent
            visible={true}
            statusBarTranslucent
            navigationBarTranslucent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Animated.View 
                style={{ flex: 1 }} 
                entering={FadeIn.duration(300)}
            >
                <BlurView
                    intensity={80}
                    tint="dark"
                    style={styles.overlay}
                >
                    <Pressable
                        style={StyleSheet.absoluteFillObject}
                        onPress={onClose}
                    />
                    <Animated.View 
                        style={styles.contentContainer}
                        pointerEvents="box-none"
                        entering={FadeInDown
                            .delay(100)
                            .duration(400)}
                    >
                        {children}
                    </Animated.View>
                </BlurView>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },

    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 1,
        width: '100%',
        maxHeight: '100%',
        paddingVertical: 20
    }
});

export default ModalLayout;