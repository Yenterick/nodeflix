import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Switch } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Module and components imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import ModalLayout from './ModalLayout';
import Button from '../Button';
import useFetch from '../../hooks/useFetch';

// Profile add modal
const ProfileAddModal = ({ onClose }) => {
    // Various hooks
    const [ hasError, setHasError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('An error has ocurred while creating the profile!');

    const { request, loading, error } = useFetch();

    // Profile hooks
    const [ profileName, setProfileName ] = useState('');
    const [ profilePic, setProfilePic ] = useState('https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png');
    const [ isKid, setIsKid ] = useState(false);

    // Function to handle the profile creation
    const handleProfileAdd = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await request(
                '/api/profile',
                'POST',
                {
                    userId: userId,
                    name: profileName,
                    // TODO: Change uploaded pfp
                    profilePic: '',
                    isKid: isKid
                }
            );

            if (response && response.success) {
                onClose();
            } else {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error ocurred while creating the profile!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        } finally {
            onClose();
        }
    }

    return (
        <ModalLayout onClose={onClose}>
            <View style={styles.modalContainer}>
                {/* Modal title */}
                <Text style={[
                    funnelDisplay.bold,
                    styles.h1
                ]}
                >
                    Add Profile
                </Text>

                {/* Profile picture section */}
                <View style={styles.profileSection}>
                    <TouchableOpacity
                        style={styles.profilePicWrapper}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={{ uri: profilePic }}
                            style={styles.profilePic}
                        />
                        <View style={styles.editIconContainer}>
                            <MaterialIcons
                                name="edit"
                                size={20}
                                color="white"
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Form container */}
                <View style={styles.formModal}>
                    <Text style={[
                        funnelDisplay.semibold,
                        styles.label
                    ]}
                    >
                        Profile Name
                    </Text>
                    <TextInput
                        placeholder='Enter profile name...'
                        placeholderTextColor={'gray'}
                        value={profileName}
                        maxLength={12}
                        onChangeText={setProfileName}
                        keyboardAppearance='dark'
                        style={[funnelDisplay.medium, styles.input]}
                    />

                    {/* Kid profile container */}
                    <View style={styles.isKidContainer}>
                        <Text style={[
                            funnelDisplay.semibold,
                            styles.label,
                            { marginBottom: 0 }
                        ]}
                        >
                            Kid Profile
                        </Text>
                        <Switch
                            trackColor={{ false: '#3e3e3e', true: colorScheme.green }}
                            thumbColor={isKid ? 'white' : '#f4f3f4'}
                            onValueChange={() => setIsKid(!isKid)}
                            value={isKid}
                        />
                    </View>
                </View>

                {/* Action buttons */}
                <View style={styles.buttonContainer}>
                    <Button
                        color={colorScheme.green}
                        onPress={() => { handleProfileAdd() }}
                    >
                        <Text style={[
                            funnelDisplay.bold,
                            styles.buttonText
                        ]}
                        >
                            Add
                        </Text>
                    </Button>
                    <Button
                        color={colorScheme.bgDarkGreen}
                        onPress={() => onClose()}
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
        elevation: 10
    },

    h1: {
        fontSize: 24,
        color: 'white',
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
        borderColor: colorScheme.green,
        borderWidth: 2
    },

    buttonText: {
        color: 'white',
        fontSize: 16
    }
})

export default ProfileAddModal;
