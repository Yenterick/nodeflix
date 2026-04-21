import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// Module and components imports
import InfoModal from './InfoModal';
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import ConfirmationModal from './ConfirmationModal';
import ModalLayout from './ModalLayout';
import ProfilePictureModal from './ProfilePictureModal';
import Button from '../Button';
import Divider from '../Divider'
import useFetch from '../../hooks/useFetch';

// User settings modal
const UserSettingsModal = ({ onClose }) => {
    // Navigation hook
    const router = useRouter();

    // Various hooks
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('An error has ocurred while configuring the user!');
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showInformation, setShowInformation] = useState(false);

    const [userEmail, setUserEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureNew, setSecureNew] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);

    useEffect(() => {
        const fetchEmail = async () => {
            const email = await AsyncStorage.getItem('userEmail');
            if (email) setUserEmail(email);
        };
        fetchEmail();
    }, []);

    const { request, loading, error } = useFetch();

    const handleUserDelete = async () => {
        try {
            const response = await request(
                `/user/${await AsyncStorage.getItem('userId')}`,
                'DELETE',
            );

            if (response && response.success) {
                router.replace('/(auth)/login');
            } else {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error has ocurred while configuring the user!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
    }

    const handlePasswordUpdate = async () => {
        try {
            const response = await request(
                `/user/update/${await AsyncStorage.getItem('userId')}`,
                'POST',
                {
                    email: userEmail,
                    password: confirmPassword,
                    newPassword: newPassword
                }
            );

            setShowInformation(true);
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
    }

    return (
        <ModalLayout onClose={onClose}>
            {hasError &&
                <InfoModal text={errorMessage} icon='error-outline' color='#FF6B6B' onExit={() => setHasError(false)} />
            }
            {showInformation &&
                <InfoModal text={'Password successfully updated!'} icon='check' onExit={() => {
                    router.replace('/(auth)/login');
                }} />
            }
            {/* Delete confirmation modal */}
            {showConfirmation &&
                <ConfirmationModal
                    text={'Are you sure you want to delete this user?'}
                    onConfirm={() => handleUserDelete()}
                    onCancel={() => setShowConfirmation(false)}
                    loading={loading}
                />
            }
            {/* General container */}
            <View style={styles.modalContainer}>
                {/* Modal title */}
                <Text style={[
                    funnelDisplay.bold,
                    styles.h1
                ]}
                >
                    User Settings
                </Text>
                {/* User email */}
                <Text style={[
                    funnelDisplay.medium,
                    styles.emailText
                ]}>
                    {userEmail}
                </Text>
                {/* Password Form */}
                <View style={styles.formModal}>
                    <Text style={[funnelDisplay.semibold, styles.label]}>
                        New Password
                    </Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder='Insert new password...'
                            placeholderTextColor='gray'
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={secureNew}
                            keyboardAppearance='dark'
                            style={[funnelDisplay.medium, styles.passwordInput]}
                        />
                        <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
                            <Ionicons
                                name={secureNew ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color='gray'
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={[funnelDisplay.semibold, styles.label]}>
                        Old Password
                    </Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder='Insert old password...'
                            placeholderTextColor='gray'
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={secureConfirm}
                            keyboardAppearance='dark'
                            style={[funnelDisplay.medium, styles.passwordInput]}
                        />
                        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
                            <Ionicons
                                name={secureConfirm ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color='gray'
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Buttons container */}
                <View style={styles.buttonContainer}>
                    <Button
                        color={colorScheme.green}
                        disabled={loading}
                        onPress={() => handlePasswordUpdate()}
                    >
                        <Text style={[
                            funnelDisplay.bold,
                            styles.buttonText
                        ]}
                        >
                            Save
                        </Text>
                    </Button>
                    <Button
                        color={colorScheme.green}
                        onPress={() => onClose()}
                        disabled={loading}
                        style={styles.cancelButton}
                    >
                        <Text style={[
                            funnelDisplay.bold,
                            styles.buttonText,
                            {
                                color: colorScheme.green
                            }
                        ]}
                        >
                            Cancel
                        </Text>
                    </Button>
                    <Divider
                        orientation='horizontal'
                        size={2}
                        color={colorScheme.green}
                    />
                <Button
                    color='#FF6B6B'
                    onPress={() => { setShowConfirmation(true) }}
                    disabled={loading}
                >
                    <MaterialIcons
                        name="delete-forever"
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
                    ]}

                    >
                        Delete User
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
        alignItems: 'center',
        shadowColor: colorScheme.green,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
        zIndex: 20
    },

    h1: {
        fontSize: 24,
        color: 'white',
        marginBottom: 5,
        textAlign: 'center'
    },

    emailText: {
        fontSize: 16,
        color: 'white',
        opacity: 0.8,
        marginBottom: 20,
        textAlign: 'center'
    },

    // Profile styles config
    profileSection: {
        marginBottom: 25,
        alignItems: 'center'
    },

    profilePicWrapper: {
        position: 'relative'
    },

    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 15,
        backgroundColor: colorScheme.darkGreen
    },

    editIconContainer: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: colorScheme.green,
        padding: 6,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: colorScheme.bgDarkGreen
    },

    // Form container styles config
    formModal: {
        width: '100%',
        marginBottom: 20
    },

    label: {
        fontSize: 18,
        color: 'white',
        marginBottom: 8,
        paddingLeft: 4
    },

    input: {
        backgroundColor: colorScheme.beige,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 16,
        fontSize: 16
    },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colorScheme.beige,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16
    },

    passwordInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16
    },

    isKidContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 4
    },

    // Buttons container styles config
    buttonContainer: {
        width: '100%',
        gap: 12
    },

    cancelButton: {
        backgroundColor: colorScheme.bgDarkGreen,
        borderColor: colorScheme.green,
        borderWidth: 2
    },

    buttonText: {
        color: 'white',
        fontSize: 16
    }
})

export default UserSettingsModal;