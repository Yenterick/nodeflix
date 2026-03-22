import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Module and componets imports
import Button from '../Button';
import ModalLayout from './ModalLayout';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import colorScheme from '../../assets/color/colorScheme';

// TODO: Implement info modal in all screens

// Info Modal
const InfoModal = ({ text, icon, onExit, color = colorScheme.green }) => {
    return (
        <ModalLayout>
            <View style={[
                styles.modalContainer,
                {
                    shadowColor: color
                }
            ]}>
                <MaterialIcons
                    name={icon || 'check'}
                    size={64}
                    color={color || colorScheme.green}
                />
                <Text
                    style={[
                        funnelDisplay.bold,
                        styles.h1
                    ]}
                >
                    {text}
                </Text>
                <View style={styles.buttonsContainer}>
                    <Button
                        color={color}
                        style={styles.button}
                        onPress={() => onExit()}
                    >
                        <MaterialIcons
                            name="check"
                            size={16}
                            color="white"
                            style={
                                {
                                    marginBottom: -1
                                }
                            }
                        />
                        <Text style={[
                            funnelDisplay.bold,
                            styles.buttonText
                        ]}>
                            Accept
                        </Text>
                    </Button>
                </View>
            </View>
        </ModalLayout>
    )
}

const styles = StyleSheet.create({
    // General container styles config
    modalContainer: {
        width: 340,
        backgroundColor: colorScheme.bgDarkGreen,
        borderRadius: 30,
        padding: 24,
        gap: 12,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 20,
        zIndex: 30,
        alignItems: 'center'
    },

    h1: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
        marginBottom: 12
    },

    // Buttons container styles config
    buttonsContainer: {
        flexDirection: 'row'
    },

    button: {
        width: 120
    },

    buttonText: {
        color: 'white',
        fontSize: 16
    }
});

export default InfoModal;

