import { View, Text, TouchableOpacity, StyleSheet, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';

// Module and components imports
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import colorScheme from '../../assets/color/colorScheme';
import useFetch from '../../hooks/useFetch';
import Button from '../../components/Button';
import InfoModal from '../../components/modals/InfoModal';

// FIXME: Loading and error screen without breaking the entire app peepo clown
const VideoPlayer = ({ route }) => {
    // Getting the route params
    const { contentId, contentType, season, episode, watchedProgress } = route.params;

    // Navigation hook
    const navigation = useNavigation();

    // Insets hook
    const insets = useSafeAreaInsets();

    // Various hooks
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('An error has ocurred while playing the content!');
    const [method, setMethod] = useState(watchedProgress?.watchedSeconds ? 'PUT' : 'POST');
    const [content, setContent] = useState(undefined);
    const [currentSeason, setCurrentSeason] = useState(season || watchedProgress?.season || 1);
    const [currentEpisode, setCurrentEpisode] = useState(episode || watchedProgress?.episode || 1);
    const [showDropdown, setShowDropdown] = useState(null); // 'seasons' | 'episodes' | null
    const { request, loading, error } = useFetch();

    // Seeking hook
    const [isSeeking, setIsSeeking] = useState(false);

    // Show video controls hook
    const [showVideoControls, setShowVideoControls] = useState(false);

    // Video controls reference
    const controlsTimeout = useRef(null);

    // Function to handle episode selection
    const handlePlay = (seasonNumber, episodeNumber) => {
        setCurrentSeason(seasonNumber);
        setCurrentEpisode(episodeNumber);
        setShowDropdown(null);
        setShowVideoControls(false);
    };

    // Functions to handle screen touch
    const resetControlsTimer = () => {
        setShowVideoControls(true);

        if (controlsTimeout.current) {
            clearTimeout(controlsTimeout.current);
        }

        controlsTimeout.current = setTimeout(() => {
            setShowVideoControls(false);
        }, 4000);
    };

    // Function to show the video controls when the screen is touched
    const handleScreenTouch = () => {
        if (showVideoControls) {
            setShowVideoControls(false);

            if (controlsTimeout.current) {
                clearTimeout(controlsTimeout.current);
            }
            return;
        }

        resetControlsTimer();
    };

    // Orientation state to prevent double change
    const [orientationReady, setOrientationReady] = useState(false);

    // Screen orientation config
    useEffect(() => {
        // Orientation Lock
        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE
            );

            setOrientationReady(true);
        };

        lockOrientation();

        // Content getter
        const getContent = async () => {
            try {
                const response = await request(contentType == 'movie' ? `/movie/details/${contentId}` : `/series/details/${contentId}`);
                if (response && response.success) {
                    setContent(response.data);
                } else {
                    setHasError(true);
                    setErrorMessage(error || response?.msg || 'An error has ocurred while playing the content!');
                }
            } catch (error) {
                setHasError(true);
                setErrorMessage(error.message);
            }
        }

        getContent();

        // Free screens orientation and clear timeouts
        return () => {
            ScreenOrientation.unlockAsync();
            if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
        };

    }, [contentId, contentType, currentEpisode, currentSeason]);

    // Video player creation
    const videoUrl =
        contentType === 'movie'
            ? content?.stream_url
            : content?.seasons
                ?.find(s => s.season_number === currentSeason)
                ?.episodes
                ?.find(e => e.episode_number === currentEpisode)
                ?.stream_url;

    // Creating video player
    const player = useVideoPlayer(videoUrl ? `${process.env.EXPO_PUBLIC_CDN_URL}${videoUrl}` : null, player => {
        player.loop = false;
        player.play();
        player.currentTime = watchedProgress?.watchedSeconds || 0;
        player.timeUpdateEventInterval = 0.5;
    });

    // Video playing events
    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
    const { status } = useEvent(player, 'statusChange', { status: player.status });
    const { currentTime } = useEvent(player, 'timeUpdate', { currentTime: player.currentTime });
    const { duration } = useEvent(player, 'sourceLoad', { duration: player.duration });

    // Loading checker
    const isBufferLoading = status === 'idle' || status === 'loading';
    const isLoading = loading || isBufferLoading;

    // Function to format the timestamps
    const formatSecondsVideo = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const padToTwoDigits = (num) => num.toString().padStart(2, '0');

        const formattedHours = padToTwoDigits(hours);
        const formattedMinutes = padToTwoDigits(minutes);
        const formattedSeconds = padToTwoDigits(seconds);

        if (formattedHours > 0) return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    // Function to format raw seconds to hours and minutes
    const formatSeconds = (duration) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        if (hours === 0) return `${minutes}m`;
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
    }

    // View event updater to save
    const handleViewEvent = async () => {
        try {
            const profileId = await AsyncStorage.getItem('profileId');
            if (!profileId || !player || !content) return;

            let isCompleted = (player.currentTime / player.duration) > 0.95;

            if (contentType === 'series' && content.seasons) {
                const maxSeason = Math.max(...content.seasons.map(s => s.season_number));
                const lastSeason = content.seasons.find(s => s.season_number === maxSeason);
                const maxEpisode = Math.max(...lastSeason.episodes.map(e => e.episode_number));

                isCompleted = isCompleted && currentSeason === maxSeason && currentEpisode === maxEpisode;
            }

            const updateData = {
                contentId: contentId,
                contentType: contentType,
                profileId: profileId,
                watchedSeconds: Math.floor(player.currentTime),
                completed: isCompleted,
                ...(contentType === 'series' && {
                    season: currentSeason,
                    episode: currentEpisode
                })
            };

            const response = await request('/viewEvent', method, updateData);
            if (response && response.success) {
                if (method === 'POST') setMethod('PUT');
            } else {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error has ocurred while updating view progress!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
    }

    // Interval to update progress every 5 seconds
    useEffect(() => {
        let interval;

        if (isPlaying) {
            interval = setInterval(() => {
                handleViewEvent();
            }, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, status, currentSeason, currentEpisode, method]);

    // Black bg till the orientation is applied
    if (!orientationReady) {
        return (
            <View
                style={styles.background}
            />
        )
    }

    return (
        // General container with all the screen
        <View
            style={[
                styles.background,
                {
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                }
            ]}
        >
            {isBufferLoading && (
                <View
                    style={styles.loaderContainer}
                    pointerEvents="none"
                >
                    <ActivityIndicator
                        size="large"
                        color="white"
                        style={
                            {
                                transform: [{ scale: 3 }]
                            }
                        }
                    />
                </View>
            )}
            {/* Error modal */}
            {hasError &&
                <InfoModal
                    text={errorMessage}
                    icon='error-outline'
                    color='#FF6B6B'
                    onExit={() => navigation.goBack()}
                />
            }
            {/* Video player render */}
            {videoUrl && player &&
                <Pressable
                    style={
                        {
                            flex: 1
                        }
                    }
                    onPress={() => handleScreenTouch()}
                >
                    <VideoView
                        style={styles.video}
                        player={player}
                        fullscreenOptions={{ allowFullscreen: false }}
                        nativeControls={false}
                        contentFit='contain'
                    />
                </Pressable>
            }
            {/* Video controls */}
            {showVideoControls &&
                <View
                    style={styles.controlsOverlay}
                >
                    <Pressable
                        style={styles.videoControls}
                        onPress={() => handleScreenTouch()}
                    >
                        {/* FIXME: It blinks when I go back to the movies screen (Maybe go nuclear again) :D */}
                        <TouchableOpacity
                            style={styles.exitButton}
                            onPress={() => navigation.goBack()}
                        >
                            <MaterialIcons
                                name='arrow-back-ios-new'
                                size={48}
                                color='white'
                            />
                        </TouchableOpacity>
                        {!isSeeking && !isBufferLoading &&
                            <TouchableOpacity
                                style={styles.pauseButton}
                                onPress={() => {
                                    resetControlsTimer();
                                    if (isPlaying) {
                                        player.pause();
                                    } else {
                                        player.play();
                                    }
                                }}
                            >
                                <MaterialIcons
                                    name={isPlaying ? 'pause' : 'play-arrow'}
                                    size={256}
                                    color='white'
                                />
                            </TouchableOpacity>
                        }
                    </Pressable>
                    {/* Slider and timestamps */}
                    <View style={styles.seekingSliderContainer}>
                        <View style={styles.timeStamps}>
                            <Text style={[
                                funnelDisplay.medium,
                                {
                                    color: 'white',
                                    fontSize: 16
                                }
                            ]}>
                                {formatSecondsVideo(currentTime)}
                            </Text>
                            <Text style={[
                                funnelDisplay.medium,
                                {
                                    color: 'white',
                                    fontSize: 16
                                }
                            ]}>
                                {formatSecondsVideo(duration)}
                            </Text>
                        </View>
                        <Slider
                            minimumValue={0}
                            maximumValue={duration}
                            value={currentTime}
                            tapToSeek={true}
                            minimumTrackTintColor={colorScheme.green}
                            maximumTrackTintColor={'#ffffff'}
                            onValueChange={(value) => {
                                resetControlsTimer();
                                player.currentTime = value;
                            }}
                            onSlidingStart={() => setIsSeeking(true)}
                            onSlidingComplete={() => setIsSeeking(false)}
                        />
                    </View>
                    {/* Button to change episode and season */}
                    {contentType !== 'movie' && !showDropdown && (
                        <View style={styles.browseSeasons}>
                            <Button
                                style={styles.seasonsButton}
                                onPress={() => {
                                    resetControlsTimer();
                                    setShowDropdown('seasons');
                                }}
                            >
                                <MaterialIcons
                                    name='more-horiz'
                                    size={24}
                                    color='white'
                                />
                            </Button>
                        </View>
                    )}
                    {/* Season dropdown */}
                    {showDropdown === 'seasons' && (
                        <View style={styles.panelContainer}>
                            <View style={styles.panelHeader}>
                                <Text style={[
                                    funnelDisplay.bold,
                                    styles.panelTitle
                                ]}>
                                    Seasons
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowDropdown(null)}
                                    style={styles.panelCloseButton}
                                >
                                    <MaterialIcons
                                        name='close'
                                        size={24}
                                        color='white'
                                    />
                                </TouchableOpacity>
                            </View>
                            <ScrollView
                                scrollEventThrottle={16}
                                onScroll={() => resetControlsTimer()}
                                showsVerticalScrollIndicator={false}
                            >
                                {content.seasons.map((season) => (
                                    <TouchableOpacity
                                        key={season.season_number}
                                        style={[
                                            styles.seasonCard,
                                            currentSeason === season.season_number && styles.seasonCardActive
                                        ]}
                                        onPress={() => {
                                            setCurrentSeason(season.season_number);
                                            setShowDropdown('episodes');
                                        }}
                                    >
                                        <MaterialIcons
                                            name='airplay'
                                            size={20}
                                            color={currentSeason === season.season_number ? colorScheme.lightGreen : 'white'}
                                        />
                                        <Text style={[
                                            funnelDisplay.bold,
                                            styles.seasonTitle,
                                            currentSeason === season.season_number && { color: colorScheme.lightGreen }
                                        ]}>
                                            Season {season.season_number}
                                        </Text>
                                        <Text style={[
                                            funnelDisplay.regular,
                                            styles.seasonEpCount
                                        ]}>
                                            {season.episodes?.length ?? 0} Ep.
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                    {/* Episodes dropdown */}
                    {showDropdown === 'episodes' && (
                        <View style={styles.panelContainer}>
                            <View style={styles.panelHeader}>
                                <TouchableOpacity
                                    onPress={() => setShowDropdown('seasons')}
                                    style={styles.panelBackButton}
                                >
                                    <MaterialIcons name='arrow-back-ios-new' size={18} color='white' />
                                </TouchableOpacity>
                                <Text style={[
                                    funnelDisplay.bold,
                                    styles.panelTitle
                                ]}>
                                    Season {currentSeason}
                                </Text>
                            </View>
                            <ScrollView
                                scrollEventThrottle={16}
                                onScroll={() => resetControlsTimer()}
                                showsVerticalScrollIndicator={false}
                            >
                                {content.seasons
                                    .find(s => s.season_number === currentSeason)
                                    ?.episodes.map((episode) => (
                                        <TouchableOpacity
                                            key={episode.episode_number}
                                            style={[
                                                styles.episodeCard,
                                                currentEpisode === episode.episode_number && styles.episodeCardActive
                                            ]}
                                            onPress={() => handlePlay(currentSeason, episode.episode_number)}
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
                                                    ]}>
                                                        {`${episode.episode_number}. ${episode.title}`}
                                                    </Text>
                                                    <Text style={[
                                                        funnelDisplay.regular,
                                                        styles.episodeDuration
                                                    ]}>
                                                        {formatSeconds(episode.duration)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text style={[
                                                funnelDisplay.regular,
                                                styles.episodeDescription
                                            ]}>
                                                {episode.description}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    // Video controls style config
    videoControls: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    controlsOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 10,
        elevation: 10
    },

    exitButton: {
        position: 'absolute',
        left: 25,
        top: 25,
        borderRadius: '50%',
        opacity: 0.5,
    },

    pauseButton: {
        position: 'absolute',
        opacity: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
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

    // Seeking slider container style config
    seekingSliderContainer: {
        position: 'absolute',
        bottom: 18,
        left: 36,
        right: 36
    },

    timeStamps: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    // Episode select styles config
    browseSeasons: {
        position: 'absolute',
        width: 256,
        right: 25,
        top: 25,
        opacity: 0.5,
        alignItems: 'flex-end'
    },

    seasonsButton: {
        width: 64
    },

    panelContainer: {
        zIndex: 999,
        elevation: 999,
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: '40%',
        backgroundColor: colorScheme.bgDarkGreen,
        padding: 16,
    },

    panelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12,
        gap: 8,
    },

    panelTitle: {
        color: 'white',
        fontSize: 15,
        flex: 1,
    },

    panelCloseButton: {
        padding: 4,
        opacity: 0.7,
    },

    panelBackButton: {
        padding: 4,
        opacity: 0.7,
    },

    seasonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colorScheme.darkGreen,
        borderRadius: 12,
        padding: 14,
        gap: 10,
        marginVertical: 4,
        borderWidth: 1,
        borderColor: 'transparent',
    },

    seasonCardActive: {
        borderColor: colorScheme.green,
    },

    seasonTitle: {
        color: 'white',
        fontSize: 14,
        flex: 1,
    },

    seasonEpCount: {
        color: colorScheme.green,
        fontSize: 12,
        opacity: 0.8,
    },

    episodeCard: {
        width: '100%',
        backgroundColor: colorScheme.darkGreen,
        borderRadius: 15,
        padding: 16,
        gap: 10,
        marginVertical: 4
    },

    episodeCardActive: {
        borderWidth: 1,
        borderColor: colorScheme.green,
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
    },

    // Background style config
    background: {
        flex: 1,
        backgroundColor: 'black'
    },

    // Video style config
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
});

export default VideoPlayer;

