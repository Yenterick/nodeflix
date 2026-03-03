import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useEffect } from 'react';

// Module imports
import Button from '../../components/Button';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import colorScheme from '../../assets/color/colorScheme';

// Debugging mock profile list
// TODO: Implement API fetch
const profiles = [
    {
        profileId: 1,
        name: 'Yenterick',
        profilePic: 'https://i.pravatar.cc/300?img=1'
    },    
    {
        profileId: 2,
        name: 'GhostPem',
        profilePic: 'https://i.pravatar.cc/300?img=2'
    },
    {
        profileId: 3,
        name: 'Sedkee',
        profilePic: 'https://i.pravatar.cc/300?img=3'
    },    
    {
        profileId: 4,
        name: 'Le Moun',
        profilePic: 'https://i.pravatar.cc/300?img=4'
    },
]

const ProfileSelector = () => {
    // Navigation hook
    const navigation = useNavigation();

    // Various hooks
    const insets = useSafeAreaInsets();
    const [ hasError, setHasError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('An error has ocurred while logging in!');

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
                ['profilePic', profilePic],
                ['ProfileName', profileName]
            ]);  
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        } catch (error) {
            setErrorMessage(error);
            setHasError(true);
        }
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
                onPress={() => {handleLogout()}}
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
                            key={profile.profileId} 
                            style={styles.profile}
                            onPress={() => {handleProfileSelect(String(profile.profileId), profile.profilePic, profile.name)}}
                        >
                            <Image 
                                source={{ uri: profile.profilePic }} 
                                style={styles.profilePic}
                            />
                            <Text style={[
                                funnelDisplay.medium,
                                styles.profileName
                                ]}>
                                {profile.name}
                            </Text>
                        </Pressable>
                    ))
                }
            </View>
            {/* Manage Profiles Button */}
            {/* TODO: Implement functionality */}
            <Button 
                style={styles.profileButton}
                onPress={() => {}}
            >
                <Text
                    style={[
                        funnelDisplay.semibold,
                        styles.profileButtonText
                    ]}
                >
                    Manage Profiles
                </Text>
            </Button>
        </View>
    )
}

export default ProfileSelector

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
        padding: 20
    },

    profile: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 10,
    },

    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 15
    },

    profileName: {
        marginTop: 5,
        fontSize: 16,
        color: 'white'
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