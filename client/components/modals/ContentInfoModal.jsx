import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useRouter } from 'expo-router';

// Modules and components imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import useFetch from '../../hooks/useFetch';
import InfoModal from './InfoModal';
import Button from '../Button';
import ModalLayout from './ModalLayout';
import Divider from '../Divider';

// Modal to show the content info
const ContentInfoModal = ({ item, contentType, onClose }) => {

    const isSeries = contentType === 'series';

    // Router hook
    const router = useRouter();

    // Various hooks
    const { error, loading, request } = useFetch();
    const [interaction, setInteraction] = useState(undefined);
    const [myList, setMyList] = useState(undefined);
    const [watchedProgress, setWatchedProgress] = useState(undefined);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('An error has ocurred while fetching profile context!');

    const [nuke, setNuke] = useState(false);

    const videoUrl = isSeries
        ? item.seasons
            ?.find(season => season.season_number === 1)
            ?.episodes?.find(episode => episode.episode_number === 1)
            ?.stream_url
        : item.stream_url;

    // Video player hooks
    const player = useVideoPlayer(videoUrl ? process.env.EXPO_PUBLIC_CDN_URL + videoUrl : null, player => {
        player.loop = true;
        player.muted = true;
    });

    // Video playing events
    const { status } = useEvent(player, 'statusChange', { status: player.status });

    useEffect(() => {
        if (status === 'readyToPlay') {
            player.play();
        }
    }, [status]);

    // Loading checker
    const isBufferLoading = status === 'idle' || status === 'loading';
    const isLoading = isBufferLoading;

    const [mutedIcon, setMutedIcon] = useState(true);

    const toggleMute = () => {
        if (!player) return;
        player.muted = !player.muted;
        setMutedIcon(player.muted);
    };

    // Hooks for the season selection dropdown (only used if isSeries is true)
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(1);

    // Function to format raw seconds to hours and minutes
    const formatSeconds = (duration) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        if (hours === 0) return `${minutes}m`;
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
    }

    const seasonCount = isSeries ? (item.seasons ? item.seasons.length : 0) : 0;
    const seasonText = seasonCount === 1 ? '1 Season' : `${seasonCount} Seasons`;

    // Function to redirect to VideoPlayer
    const handlePlay = (seasonNumber, episodeNumber) => {
        setNuke(true);

        setTimeout(() => {
            router.push({
                pathname: '/video-player',
                params: {
                    contentId: item._id,
                    contentType: isSeries ? 'series' : 'movie',
                    ...(isSeries && {
                        season: String(seasonNumber || watchedProgress?.season || 1),
                        episode: String(episodeNumber || watchedProgress?.episode || 1),
                    }),
                    watchedProgress: watchedProgress ? JSON.stringify(watchedProgress) : '',
                },
            });
            onClose();
        }, 50);
    }

    const fetchProfileContext = async () => {
        try {
            const profileId = await AsyncStorage.getItem('profileId');
            const response = await request(
                `/${contentType}/${item._id}/${profileId}`,
                'GET'
            );
            if (response && response.success) {
                setMyList(response?.data?.isInList);
                setInteraction(response?.data?.interaction);
                setWatchedProgress(response?.data?.watchedProgress);
            } else {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error has ocurred while fetching profile context!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
    }

    // Profile context fetch 
    useEffect(() => {
        fetchProfileContext();
    }, []);

    // Adding to my list handle
    const handleAddToMyList = async () => {
        try {
            const profileId = await AsyncStorage.getItem('profileId');
            const response = await request(
                `/listEvent`,
                'POST',
                {
                    contentId: item._id,
                    contentType: contentType,
                    profileId: profileId
                }
            );
            if (!response || !response.success) {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error has ocurred while adding to my list!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
        fetchProfileContext();
    }

    // Remove from my list handle
    const handleRemoveFromMyList = async () => {
        try {
            const profileId = await AsyncStorage.getItem('profileId');
            const response = await request(
                `/listEvent`,
                'DELETE',
                {
                    contentId: item._id,
                    contentType: contentType,
                    profileId: profileId
                }
            );
            if (!response || !response.success) {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error has ocurred while removing from my list!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
        fetchProfileContext();
    }

    // Handle interactions
    const handleInteraction = async (targetInteraction) => {
        try {
            const profileId = await AsyncStorage.getItem('profileId');
            const method = interaction === undefined ? 'POST' : 'PUT';

            const response = await request(
                `/interactionEvent`,
                method,
                {
                    contentId: item._id,
                    contentType: contentType,
                    profileId: profileId,
                    interactionType: targetInteraction
                }
            );

            if (!response || !response.success) {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error has ocurred while interacting!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
        fetchProfileContext();
    }

    const handleRemoveInteraction = async () => {
        try {
            const profileId = await AsyncStorage.getItem('profileId');
            const response = await request(
                `/interactionEvent`,
                'DELETE',
                {
                    contentId: item._id,
                    contentType: contentType,
                    profileId: profileId
                }
            );
            if (!response || !response.success) {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error has ocurred while removing interaction!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
        fetchProfileContext();
    }

    if (nuke) {
        return (
            <View
                style={
                    {
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'black',
                        zIndex: 9999,
                        elevation: 9999
                    }
                }
            />
        )
    }

    return (
        // General container with all the screen
        <ModalLayout onClose={onClose}>
            {/* Modal container */}
            <View style={[
                styles.modalContainer,
                {
                    maxHeight: isSeries ? '88%' : '100%',
                }
            ]}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                >
                    <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
                {/* Error modal */}
                {hasError &&
                    <InfoModal text={errorMessage} icon='error-outline' color='#FF6B6B' onExit={() => {
                        setHasError(false);
                        onClose();
                    }} />
                }
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                >
                    <View style={styles.videoContainer}>
                        {isLoading && (
                            <View
                                style={styles.loaderContainer}
                                pointerEvents="none"
                            >
                                <ActivityIndicator
                                    size="large"
                                    color="white"
                                    style={
                                        {
                                            transform: [{ scale: 1.5 }]
                                        }
                                    }
                                />
                            </View>
                        )}
                        <VideoView
                            style={styles.video}
                            player={player}
                            fullscreenOptions={{ allowFullscreen: false }}
                            nativeControls={false}
                        />
                        <TouchableOpacity
                            style={styles.muteButton}
                            onPress={() => toggleMute()}
                            disabled={isLoading}
                        >
                            <MaterialIcons
                                name={mutedIcon ? 'volume-off' : 'volume-up'}
                                size={18}
                                color='white'
                            />
                        </TouchableOpacity>
                    </View>
                    {/* Content header */}
                    <View style={styles.contentHeader}>
                        <Text
                            style={[
                                funnelDisplay.bold,
                                styles.h1
                            ]}
                        >
                            {item.title}
                        </Text>
                        {/* Subtitle with useful information */}
                        <View
                            style={styles.subTitles}
                        >
                            <Text
                                style={[
                                    funnelDisplay.light,
                                    {
                                        fontSize: 12,
                                        color: 'white'
                                    }
                                ]}
                            >
                                {item.release_year}
                            </Text>
                            <Text
                                style={[
                                    funnelDisplay.light,
                                    {
                                        fontSize: 12,
                                        color: 'white'
                                    }
                                ]}
                            >
                                {isSeries ? seasonText : formatSeconds(item.duration)}
                            </Text>
                        </View>
                    </View>
                    <Divider
                        color={colorScheme.green}
                        size={2}
                    />
                    <View style={styles.buttonsContainer}>
                        <Button
                            onPress={() => handlePlay()}
                        >
                            <MaterialIcons
                                name='play-arrow'
                                size={24}
                                color='white'
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
                                {loading ?
                                    <ActivityIndicator
                                        color='white'
                                        size='small'
                                    />
                                    :
                                    <>
                                        {watchedProgress && !watchedProgress.completed ? 'Continue Watching' : 'Play'}
                                    </>
                                }

                            </Text>
                        </Button>
                    </View>
                    <Divider
                        color={colorScheme.green}
                        size={2}
                    />
                    <View
                        style={styles.descriptionContainer}
                    >
                        <Text
                            style={[
                                funnelDisplay.regular,
                                {
                                    color: 'white',
                                    textAlign: 'left',
                                    flexShrink: 1,
                                }
                            ]}
                        >
                            {item.description}
                        </Text>
                    </View>
                    <Divider
                        color={colorScheme.green}
                        size={2}
                    />
                    <View
                        style={styles.extraInfo}
                    >
                        <Text
                            style={[
                                funnelDisplay.regular,
                                {
                                    color: 'white',
                                    textAlign: 'left',
                                    flexShrink: 1,
                                    opacity: 0.5,
                                }
                            ]}
                        >
                            {`Genres: ${item.genres?.join(", ").replace(/(^|\s)\S/g, match => match.toUpperCase()) || ''}`}
                        </Text>
                        <Text
                            style={[
                                funnelDisplay.regular,
                                {
                                    color: 'white',
                                    textAlign: 'left',
                                    flexShrink: 1,
                                    opacity: 0.5,
                                }
                            ]}
                        >
                            {`Cast: ${item.cast?.join(", ") || ''}`}
                        </Text>
                    </View>
                    <Divider
                        color={colorScheme.green}
                        size={2}
                    />
                    <View
                        style={styles.extraButtons}
                    >
                        <TouchableOpacity
                            style={styles.extraButton}
                            onPress={() => {
                                if (myList === true) handleRemoveFromMyList();
                                else handleAddToMyList();
                            }}
                            disabled={loading}
                        >
                            <MaterialIcons
                                name={myList === true ? 'check' : 'add'}
                                size={36}
                                color="white"
                            />
                            <Text
                                style={[
                                    funnelDisplay.regular,
                                    {
                                        color: 'white',
                                        textAlign: 'left',
                                    }
                                ]}
                            >
                                My List
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.extraButton,
                                {
                                    opacity: interaction === 'like' ? 1.0 : 0.5
                                }
                            ]}
                            onPress={() => {
                                if (interaction === 'like') handleRemoveInteraction();
                                else handleInteraction('like');
                            }}
                            disabled={loading}
                        >
                            <MaterialIcons
                                name="thumb-up-off-alt"
                                size={36}
                                color="white"
                            />
                            <Text
                                style={[
                                    funnelDisplay.regular,
                                    {
                                        color: 'white',
                                        textAlign: 'left',
                                    }
                                ]}
                            >
                                Like
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.extraButton,
                                {
                                    opacity: interaction === 'dislike' ? 1.0 : 0.5
                                }
                            ]}
                            onPress={() => {
                                if (interaction === 'dislike') handleRemoveInteraction();
                                else handleInteraction('dislike');
                            }}
                            disabled={loading}
                        >
                            <MaterialIcons
                                name="thumb-down-off-alt"
                                size={36}
                                color="white"
                            />
                            <Text
                                style={[
                                    funnelDisplay.regular,
                                    {
                                        color: 'white',
                                        textAlign: 'left',
                                    }
                                ]}
                            >
                                Dislike
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {isSeries && (
                        <>
                            <Divider
                                color={colorScheme.green}
                                size={2}
                            />
                            {/* Season dropdown button */}
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setShowDropdown(!showDropdown)}
                            >
                                <Text
                                    style={[
                                        funnelDisplay.bold,
                                        { color: 'white' }
                                    ]}
                                >
                                    {`Season ${selectedSeason}`}
                                </Text>

                                <MaterialIcons
                                    name={showDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                    size={24}
                                    color="white"
                                />
                            </TouchableOpacity>
                            {/* Dropdown for seasons */}
                            {showDropdown && (
                                <View style={styles.dropdown}>
                                    {item.seasons?.map((season) => (
                                        <Button
                                            key={season.season_number}
                                            onPress={() => {
                                                setSelectedSeason(season.season_number)
                                                setShowDropdown(false);
                                            }}
                                            style={{
                                                shadowOpacity: 0
                                            }}
                                        >
                                            <View style={styles.dropdownButtonOverride}>
                                                <Text
                                                    style={[
                                                        funnelDisplay.semibold,
                                                        { color: 'white' }
                                                    ]}
                                                >
                                                    Season {season.season_number}
                                                </Text>
                                            </View>
                                        </Button>
                                    ))}
                                </View>
                            )}

                            {/* Episodes List */}
                            <View style={styles.episodesContainer}>
                                {item.seasons
                                    ?.find(season => season.season_number === selectedSeason)
                                    ?.episodes?.map((episode) => (
                                        <TouchableOpacity
                                            key={episode.episode_number}
                                            style={styles.episodeCard}
                                            onPress={() => handlePlay(selectedSeason, episode.episode_number)}
                                        >
                                            <View style={styles.episodeHeader}>
                                                <Image
                                                    source={{ uri: process.env.EXPO_PUBLIC_CDN_URL + episode.thumbnail_url }}
                                                    style={styles.episodeThumbnail}
                                                />
                                                <View style={styles.episodeMainInfo}>
                                                    <Text style={[
                                                        funnelDisplay.bold,
                                                        styles.episodeTitle
                                                    ]}
                                                    >
                                                        {`${episode.episode_number}. ${episode.title}`}
                                                    </Text>
                                                    <Text style={[
                                                        funnelDisplay.regular,
                                                        styles.episodeDuration
                                                    ]}
                                                    >
                                                        {`${formatSeconds(episode.duration)}`}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text style={[
                                                funnelDisplay.regular,
                                                styles.episodeDescription
                                            ]}
                                            >
                                                {episode.description}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                            </View>
                        </>
                    )}
                </ScrollView>
            </View>
        </ModalLayout>
    )
}

const styles = StyleSheet.create({
    // General container styles config
    modalContainer: {
        width: '90%',
        maxWidth: 500,
        backgroundColor: colorScheme.bgDarkGreen,
        borderRadius: 30,
        padding: 24,
        alignItems: 'center',
        shadowColor: colorScheme.green,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
        zIndex: 20,
        flexShrink: 1,
        cursor: 'auto'
    },

    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 8,
        zIndex: 99,
        elevation: 99,
    },

    // Loading icon styles config
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        elevation: 999
    },

    //Video container styles config
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: 'black',
        marginBottom: 10,
        borderRadius: 25,
        shadowColor: colorScheme.green,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10
    },

    video: {
        width: '100%',
        height: '100%',
        borderRadius: 25
    },

    muteButton: {
        position: 'absolute',
        right: 15,
        bottom: 15,
        padding: 5,
        backgroundColor: colorScheme.darkGreen,
        borderRadius: 25,
        opacity: 0.8
    },

    // Content header styles config
    contentHeader: {
        width: '100%',
        marginBottom: 10
    },

    h1: {
        fontSize: 24,
        color: 'white',
        marginBottom: 0,
        textAlign: 'left'
    },

    subTitles: {
        flexDirection: 'row',
        gap: 5,
    },

    // Buttons styles config
    buttonsContainer: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10
    },

    buttonText: {
        color: 'white'
    },

    // Description styles config
    descriptionContainer: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10
    },

    // Extra info styles config
    extraInfo: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10
    },

    // Extra buttons styles config
    extraButtons: {
        width: '100%',
        marginTop: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 20,
        marginBottom: 10
    },

    extraButton: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Series dropdown styles config
    dropdownButton: {
        width: '100%',
        marginTop: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    dropdown: {
        width: '100%',
        marginTop: 10,
        overflow: 'hidden',
        gap: 12
    },

    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: colorScheme.green
    },

    // Episodes section styles config
    episodesContainer: {
        width: '100%',
        marginTop: 20,
        gap: 20
    },

    episodeCard: {
        width: '100%',
        backgroundColor: colorScheme.darkGreen,
        borderRadius: 15,
        padding: 24,
        gap: 10
    },

    episodeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },

    episodeThumbnail: {
        width: 100,
        height: 56,
        borderRadius: 8,
    },

    episodeMainInfo: {
        flex: 1,
        gap: 4
    },

    episodeTitle: {
        color: 'white',
        fontSize: 14,
        flexShrink: 1
    },

    episodeDuration: {
        color: colorScheme.lightGreen,
        fontSize: 12,
        opacity: 0.8
    },

    episodeDescription: {
        color: 'white',
        fontSize: 12,
        opacity: 0.6,
        lineHeight: 18,
        flexShrink: 1
    }
});

export default ContentInfoModal;
