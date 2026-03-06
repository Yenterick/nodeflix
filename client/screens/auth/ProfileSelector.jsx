import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useEffect } from 'react';

// Module imports
import useFetch from '../../hooks/useFetch';
import ProfileEditModal from '../../components/modals/ProfileEditModal';
import ProfileAddModal from '../../components/modals/ProfileAddModal';
import Button from '../../components/Button';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import colorScheme from '../../assets/color/colorScheme';

// TODO: Remove static Netflix pfp image

const ProfileSelector = () => {
    // Navigation hook
    const navigation = useNavigation();

    // Various hooks
    const { request, loading, error } = useFetch();
    const insets = useSafeAreaInsets();

    const [ hasError, setHasError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('An error has ocurred while fetching profiles!');
    const [ management, setManagement ] = useState(false);
    const [ profiles, setProfiles ] = useState([]);

    // Edit states
    const [ selectedProfile, setSelectedProfile ] = useState(null);
    const [ showProfileEditModal, setShowProfileEditModal ] = useState(false);

    // Add states
    const [ showProfileAddModal, setshowProfileAddModal ] = useState(false);

    // Function to load the user's profiles
    const fetchProfiles = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const response = await request(`/api/user/profiles/${userId}`, 'GET');

            if (response && response.success) {
                setProfiles(response.data);
            } else {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error ocurred while fetching profiles!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
    }

    useEffect(() => {
        fetchProfiles();
    }, [showProfileEditModal, showProfileAddModal]);

    // Function to clear the cache and go back to the login page
    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.navigate('Login');
    }

    // Function to save in cache all the needed data and redirect to index
    const handleProfileSelect = async (profileId, profilePic, profileName) => {
        try {
            await AsyncStorage.multiSet([
                ['profileId', profileId],
                ['profilePic', profilePic || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'],
                ['profileName', profileName]
            ]);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        } catch (error) {
            setErrorMessage(error.message);
            setHasError(true);
        }
    }

    const handleEdit = (profile) => {
        setSelectedProfile(profile);
        setShowProfileEditModal(true);
    }

    return (
        // General container with all the screen
        <View
            style={[
                styles.background,
                {
                    paddingBottom: insets.bottom,
                    paddingTop: insets.top
                }
            ]}
        >
            {/* Edit Modal */}
            {showProfileEditModal &&
                <ProfileEditModal
                    profile={selectedProfile}
                    onClose={() => setShowProfileEditModal(false)}
                />
            }
            {/* Add Modal */}
            {showProfileAddModal && profiles.length < 4 &&
                <ProfileAddModal  
                    onClose={() => setshowProfileAddModal(false)}
                />
            }
            {/* Logout button */}
            <Button
                style={[
                    styles.logoutButton,
                    {
                        top: insets.top + 10,
                        left: 20
                    }
                ]}
                color='#FF6B6B'
                onPress={() => { handleLogout() }}
            >
                <MaterialIcons
                    name='logout'
                    size={36}
                    color='white'
                />
            </Button>
            {/* Main title */}
            <Text style={[
                funnelDisplay.bold,
                styles.h1
            ]}
            >
                Who's watching?
            </Text>
            {/* Profiles container */}
            <View style={styles.profiles}>
                {
                    // Profiles map
                    profiles.map((profile) => (
                        <Pressable
                            key={String(profile.profile_id)}
                            style={styles.profile}
                            onPress={() => {
                                if (management) {
                                    handleEdit(profile);
                                } else {
                                    handleProfileSelect(String(profile.profile_id), profile.profile_pic, profile.name);
                                }
                            }}
                        >
                            <View style={styles.profilePicContainer}>
                                <Image
                                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png' || profile.profile_pic }}
                                    style={[
                                        styles.profilePic,
                                        management && styles.profilePicEdit
                                    ]}
                                />
                                {management &&
                                    <View style={styles.editOverlay}>
                                        <MaterialIcons
                                            name="edit"
                                            size={64}
                                            color="white"
                                        />
                                    </View>
                                }
                            </View>
                            <Text style={[
                                funnelDisplay.medium,
                                styles.profileName
                            ]}>
                                {profile.name}
                            </Text>
                        </Pressable>
                    ))
                }
                {profiles.length < 4 &&
                    <Pressable
                        style={[
                            styles.profile,
                            styles.addProfile
                        ]}
                        onPress={() => setshowProfileAddModal(true)}
                    >
                        <MaterialIcons
                            style={styles.profilePic}
                            name="add"
                            size={120}
                            color={colorScheme.green}
                        />
                        <Text style={[
                            funnelDisplay.medium,
                            styles.profileName
                        ]}>
                            New Profile
                        </Text>
                    </Pressable>
                }
            </View>
            {/* Manage Profiles Button */}
            {/* TODO: Implement functionality */}
            <Button
                style={styles.profileButton}
                onPress={() => { setManagement(!management) }}
            >
                <Text
                    style={[
                        funnelDisplay.semibold,
                        styles.profileButtonText
                    ]}
                >
                    {management ? 'Cancel' : 'Manage Profiles'}
                </Text>
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    // Background style config
    background: {
        flex: 1,
        backgroundColor: colorScheme.darkGreen,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Logout button style config
    logoutButton: {
        position: 'absolute',
        zIndex: 1,
        width: 64,
        height: 64
    },

    // Main title style config
    h1: {
        fontSize: 28,
        textAlign: 'center',
        lineHeight: 32,
        color: 'white',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
    },

    // Profiles container style config
    profiles: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        width: '80%',
        height: 360,
        backgroundColor: colorScheme.bgDarkGreen,
        borderRadius: 25,
        padding: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
    },

    profile: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 10,
    },

    addProfile: {
        opacity: 0.5,
    },

    profilePicContainer: {
        position: 'relative'
    },

    profilePicEdit: {
        opacity: 0.5,
    },

    editOverlay: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },

    profilePic: {
        backgroundColor: colorScheme.darkGreen,
        width: 120,
        height: 120,
        borderRadius: 15
    },

    profileName: {
        marginTop: 5,
        fontSize: 16,
        color: 'white'
    },

    // Error message style config
    errorMessage: {
        marginTop: 20
    },

    // Manage profile button style config
    profileButton: {
        marginTop: 20,
        width: '40%'
    },

    profileButtonText: {
        textAlign: 'center',
        color: 'white'
    }
});

export default ProfileSelector;