import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

// Module and component imports
import ModalLayout from './ModalLayout';
import InfoModal from './InfoModal';
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import Button from '../Button';
import useFetch from '../../hooks/useFetch';

// Profile Picture Modal
const ProfilePictureModal = ({ onClose, onSave, currentPic }) => {
    // Various hooks
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('An error has ocurred while fetching the content!');

    const { error, loading, request } = useFetch();

    // Content hooks
    const [profilePicturesList, setProfilePicturesList] = useState([]);
    const [selectedPic, setSelectedPic] = useState(currentPic);

    // Function to fetch the profile pictures
    const fetchPictures = async () => {
        try {
            const response = await request('/profilePicture', 'GET');

            if (response && response.success) {
                if (!response.data || response.data.length === 0) {
                    setHasError(true);
                    setErrorMessage('An error has ocurred while retrieving the profile pictures!');
                    return;
                }
                setProfilePicturesList(response.data);
            } else {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error has ocurred while retrieving the profile pictures!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
    }

    // Load pictures
    useEffect(() => {
        fetchPictures();
    }, [])

    const handleSave = () => {
        onSave(selectedPic);
    }

    // Function to render a picture chip
    const renderPicture = (picUri) => {
        const isSelected = selectedPic === picUri;
        return (
            <TouchableOpacity
                style={[
                    styles.picContainer,
                    isSelected && styles.picContainerSelected
                ]}
                onPress={() => setSelectedPic(picUri)}
                activeOpacity={0.75}
            >
                <Image 
                    source={{ uri: `${process.env.EXPO_PUBLIC_CDN_URL}${picUri}` }} 
                    style={styles.picImage} 
                />
                {isSelected && (
                    <View style={styles.checkBadge}>
                        <MaterialIcons name="check" size={14} color="white" />
                    </View>
                )}
            </TouchableOpacity>
        );
    }

    return (
        <ModalLayout onClose={onClose}>
            {/* Error modal */}
            {hasError &&
                <InfoModal
                    text={errorMessage}
                    icon='error-outline'
                    color='#FF6B6B'
                    onExit={() => setHasError(false)}
                />
            }

            {/* Container */}
            <View style={styles.preferencesContainer}>
                
                {/* Header section */}
                <View style={styles.header}>
                    <Text
                        style={[
                            funnelDisplay.bold,
                            styles.headerTitle
                        ]}
                    >
                        Choose Profile Picture
                    </Text>
                    <Text
                        style={[
                            funnelDisplay.medium,
                            styles.headerSubtitle
                        ]}
                    >
                        Select your favorite character
                    </Text>
                </View>

                {/* Divider section */}
                <View style={styles.divider} />

                {loading ?
                    <View style={styles.loaderWrapper}>
                        <ActivityIndicator
                            color={colorScheme.lightGreen}
                            size='large'
                        />
                        <Text style={[funnelDisplay.medium, styles.loadingText]}>
                            Loading pictures…
                        </Text>
                    </View>
                    :
                    <>
                        <ScrollView style={{ width: '100%', maxHeight: 400 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                            {profilePicturesList.map((category) => (
                                <View style={styles.section} key={category._id}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={[funnelDisplay.bold, styles.sectionLabel]}>
                                            {category.content_name}
                                        </Text>
                                    </View>
                                    <FlatList
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        data={category.pictures}
                                        contentContainerStyle={styles.picList}
                                        renderItem={({ item }) => renderPicture(item)}
                                        keyExtractor={(item) => item}
                                    />
                                </View>
                            ))}
                        </ScrollView>

                        {/* Buttons section */}
                        <View style={styles.buttonContainer}>
                            <Button
                                onPress={onClose}
                                color={colorScheme.bgDarkGreen}
                                style={[
                                    styles.cancelButton,
                                    { flex: 1 }
                                ]}
                            >
                                <Text style={[funnelDisplay.bold, styles.buttonText, { color: colorScheme.lightGreen }]}>
                                    Cancel
                                </Text>
                            </Button>
                            <Button
                                onPress={handleSave}
                                style={{ flex: 1 }}
                            >
                                <Text style={[funnelDisplay.bold, styles.buttonText]}>
                                    Save
                                </Text>
                            </Button>
                        </View>
                    </>
                }
            </View>
        </ModalLayout>
    )
}

const styles = StyleSheet.create({
    // Profile pictures container styles config
    preferencesContainer: {
        width: 340,
        backgroundColor: colorScheme.bgDarkGreen,
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        shadowColor: colorScheme.green,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 12,
        zIndex: 20,
        gap: 16
    },
    // Header style config
    header: {
        alignItems: 'center',
        gap: 6,
        width: '100%'
    },
    headerTitle: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    headerSubtitle: {
        fontSize: 13,
        color: colorScheme.lightGreen,
        textAlign: 'center',
        opacity: 0.9
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: colorScheme.darkGreen
    },
    // Images sections styles config
    loaderWrapper: {
        paddingVertical: 32,
        alignItems: 'center',
        gap: 12
    },
    loadingText: {
        color: colorScheme.lightGreen,
        fontSize: 14,
        opacity: 0.8
    },
    section: {
        width: '100%',
        gap: 10
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    sectionLabel: {
        fontSize: 15,
        color: 'white'
    },
    picList: {
        paddingVertical: 4,
        gap: 12,
        paddingHorizontal: 2
    },
    picContainer: {
        position: 'relative',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent'
    },
    picContainerSelected: {
        borderColor: colorScheme.green
    },
    picImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: colorScheme.darkGreen
    },
    checkBadge: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: colorScheme.green,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colorScheme.bgDarkGreen
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
        marginTop: 4
    },
    cancelButton: {
        borderColor: colorScheme.green,
        borderWidth: 1.5
    },
    buttonText: {
        color: 'white',
        fontSize: 15
    }
});

export default ProfilePictureModal;