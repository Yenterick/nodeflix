import { View, Text, TouchableOpacity, StyleSheet, Pressable, ScrollView, Image, ActivityIndicator, Platform, BackHandler, Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown, FadeOutDown, FadeIn, FadeOut } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';

// Module and components imports
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import colorScheme from '../../assets/color/colorScheme';
import useFetch from '../../hooks/useFetch';
import Button from '../../components/Button';
import InfoModal from '../../components/modals/InfoModal';
import { useOrientationTransition } from '../../context/OrientationTransitionContext';

const VideoPlayer = () => {
    // Getting route params via Expo Router
    const {
        contentId,
        contentType,
        season: seasonParam,
        episode: episodeParam,
        watchedProgress: watchedProgressStr,
    } = useLocalSearchParams();

    // Parse params from URL strings
    const season = seasonParam ? Number(seasonParam) : undefined;
    const episode = episodeParam ? Number(episodeParam) : undefined;
    const watchedProgress = watchedProgressStr ? JSON.parse(watchedProgressStr) : undefined;

    // Router hook
    const router = useRouter();

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

    // Double-tap seek state
    const lastTapLeft = useRef(0);
    const lastTapRight = useRef(0);
    const [seekFeedback, setSeekFeedback] = useState(null);
    const seekFeedbackTimeout = useRef(null);

    // Single tap handler
    const handleTap = (event) => {
        const x = event?.nativeEvent?.pageX ?? event?.nativeEvent?.locationX ?? 0;
        const screenW = Dimensions.get('window').width || 1;
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (x < screenW * 0.35) {
            // Left zone
            if (now - lastTapLeft.current < DOUBLE_TAP_DELAY) {
                player.currentTime = Math.max(0, player.currentTime - 10);
                resetControlsTimer();
                if (seekFeedbackTimeout.current) clearTimeout(seekFeedbackTimeout.current);
                setSeekFeedback('left');
                seekFeedbackTimeout.current = setTimeout(() => setSeekFeedback(null), 700);
                lastTapLeft.current = 0;
            } else {
                lastTapLeft.current = now;
                handleScreenTouch();
            }
        } else if (x > screenW * 0.65) {
            // Right zone
            if (now - lastTapRight.current < DOUBLE_TAP_DELAY) {
                player.currentTime = Math.min(duration, player.currentTime + 10);
                resetControlsTimer();
                if (seekFeedbackTimeout.current) clearTimeout(seekFeedbackTimeout.current);
                setSeekFeedback('right');
                seekFeedbackTimeout.current = setTimeout(() => setSeekFeedback(null), 700);
                lastTapRight.current = 0;
            } else {
                lastTapRight.current = now;
                handleScreenTouch();
            }
        } else {
            // Center zone
            handleScreenTouch();
        }
    };

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

    // Orientation state to prevent double change (Avoiding it on web bc it goes crazy)
    const [orientationReady, setOrientationReady] = useState(Platform.OS === 'web');

    // Global overlay context: persists through navigation so the previous screen doesn't flash in landscape
    const { startExitTransition } = useOrientationTransition();

    // Went nuclear again type shi
    const [isExiting, setIsExiting] = useState(false);

    // Handle NUCLEAR back
    const handleBack = () => {
        if (isExiting) return;
        setIsExiting(true);
        startExitTransition();
        router.back();
    };

    // Screen orientation config
    useEffect(() => {
        if (Platform.OS !== 'web') {
            const lockOrientation = async () => {
                try {
                    await ScreenOrientation.lockAsync(
                        ScreenOrientation.OrientationLock.LANDSCAPE
                    );
                } catch (e) {
                    // Pass
                }
                setOrientationReady(true);
            };

            lockOrientation();
        }

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
        };

        getContent();

        // Cleanup
        return () => {
            if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
            if (seekFeedbackTimeout.current) clearTimeout(seekFeedbackTimeout.current);
        };

    }, [contentId, contentType, currentEpisode, currentSeason]);

    // Ugly ass Android button handler 
    useEffect(() => {
        if (Platform.OS === 'android') {
            const sub = BackHandler.addEventListener('hardwareBackPress', () => {
                handleBack();
                return true;
            });
            return () => sub.remove();
        }
    }, [isExiting]);

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
    const { duration: durationFromLoad } = useEvent(player, 'sourceLoad', { duration: player.duration });

    // And again, in web it doesn't detect the duration correctly so I needed to use player.duration directly
    const duration = durationFromLoad || player.duration || 0;

    // Loading checker
    const isBufferLoading = status === 'idle' || status === 'loading';
    const isLoading = loading || isBufferLoading;

    // Detect if video has ended 
    const videoEnded = !isPlaying && !isBufferLoading && duration > 0 && currentTime >= duration - 0.5;

    // Next episode 
    const nextEpisodeInfo = (() => {
        if (contentType === 'movie' || !content?.seasons) return null;
        const sortedSeasons = [...content.seasons].sort((a, b) => a.season_number - b.season_number);
        const currentSeasonData = sortedSeasons.find(s => s.season_number === currentSeason);
        if (!currentSeasonData) return null;
        const sortedEpisodes = [...currentSeasonData.episodes].sort((a, b) => a.episode_number - b.episode_number);
        const currentEpIndex = sortedEpisodes.findIndex(e => e.episode_number === currentEpisode);
        // Has next episode in this season
        if (currentEpIndex !== -1 && currentEpIndex < sortedEpisodes.length - 1) {
            return { season: currentSeason, episode: sortedEpisodes[currentEpIndex + 1].episode_number };
        }
        // Last episode of season 
        const currentSeasonIndex = sortedSeasons.findIndex(s => s.season_number === currentSeason);
        if (currentSeasonIndex !== -1 && currentSeasonIndex < sortedSeasons.length - 1) {
            const nextSeason = sortedSeasons[currentSeasonIndex + 1];
            const nextSeasonEpisodes = [...nextSeason.episodes].sort((a, b) => a.episode_number - b.episode_number);
            if (nextSeasonEpisodes.length > 0) {
                return { season: nextSeason.season_number, episode: nextSeasonEpisodes[0].episode_number };
            }
        }
        // Last episode of the last season — no next
        return null;
    })();

    // Show next episode button in last 30 seconds, but only if there is a next episode
    const showNextEpisodeButton = nextEpisodeInfo !== null && duration > 0 && currentTime >= duration - 30 && !isBufferLoading;

    // Function to navigate to next episode
    const handleNextEpisode = () => {
        if (!nextEpisodeInfo) return;
        handlePlay(nextEpisodeInfo.season, nextEpisodeInfo.episode);
    };

    // Idk why on web it doesn't start playing automatically but I needed to force it
    useEffect(() => {
        if (Platform.OS === 'web' && status === 'readyToPlay' && !isPlaying) {
            player.play();
        }
    }, [status]);

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

    // Nuke black screen while exiting
    if (isExiting) {
        return <View style={styles.background} />;
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
                    onExit={() => router.back()}
                />
            }
            {/* Video player render */}
            {videoUrl && player &&
                <VideoView
                    style={styles.video}
                    player={player}
                    fullscreenOptions={{ allowFullscreen: false }}
                    nativeControls={false}
                    contentFit='contain'
                />
            }
            {/* Full-screen tap zone */}
            <Pressable
                style={styles.fullscreenTapZone}
                onPress={handleTap}
            />
            {/* Seek feedback indicators */}
            {seekFeedback === 'left' && (
                <Animated.View
                    style={styles.seekFeedbackLeft}
                    entering={FadeIn
                        .springify()
                        .duration(500)}
                    exiting={FadeOut
                        .springify()
                        .duration(500)}
                    pointerEvents="none"
                >
                    <MaterialIcons 
                        name='replay-10' 
                        size={120}
                        color='rgba(255, 255, 255, 0.6)' 
                    />
                </Animated.View>
            )}
            {seekFeedback === 'right' && (
                <Animated.View
                    style={styles.seekFeedbackRight}
                    entering={FadeIn
                        .springify()
                        .duration(300)}
                    exiting={FadeOut
                        .springify()
                        .duration(300)}
                    pointerEvents="none"
                >
                    <MaterialIcons 
                        name='forward-10' 
                        size={120} 
                        color='rgba(255, 255, 255, 0.6)' 
                    />
                </Animated.View>
            )}
            {/* Next episode button */}
            {showNextEpisodeButton && contentType !== 'movie' && !showDropdown && (
                <Animated.View
                    style={styles.nextEpisodeAbsolute}
                    entering={FadeIn.springify().duration(500)}
                    exiting={FadeOut.springify().duration(500)}
                    pointerEvents="box-none"
                >
                    <TouchableOpacity
                        style={styles.nextEpisodeButton}
                        onPress={() => {
                            resetControlsTimer();
                            handleNextEpisode();
                        }}
                    >
                        <MaterialIcons name='skip-next' size={20} color='black' />
                        <Text style={[funnelDisplay.bold, styles.nextEpisodeText]}>
                            {nextEpisodeInfo?.season !== currentSeason
                                ? `Season ${nextEpisodeInfo?.season} · Episode ${nextEpisodeInfo?.episode}`
                                : `Next · Episode ${nextEpisodeInfo?.episode}`
                            }
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
            {/* Video controls */}
            {showVideoControls &&
                <Animated.View
                    style={styles.controlsOverlayContainer}
                    entering={FadeIn
                        .springify()
                        .duration(500)
                    }
                    exiting={
                        FadeOut
                            .springify()
                            .duration(500)
                    }
                    pointerEvents="box-none"
                >
                    <Animated.View
                        style={styles.controlsOverlay}
                        entering={FadeInDown
                            .springify()
                            .duration(500)
                        }
                        exiting={FadeOutDown
                            .springify()
                            .duration(500)
                        }
                        pointerEvents="box-none"
                    >
                        <View
                            style={styles.videoControls}
                            pointerEvents="box-none"
                        >
                            <TouchableOpacity
                                style={styles.exitButton}
                                onPress={handleBack}
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
                                        if (videoEnded) {
                                            player.currentTime = 0;
                                            player.play();
                                        } else if (isPlaying) {
                                            player.pause();
                                        } else {
                                            player.play();
                                        }
                                    }}
                                >
                                    <MaterialIcons
                                        name={videoEnded ? 'replay' : isPlaying ? 'pause' : 'play-arrow'}
                                        size={256}
                                        color='white'
                                    />
                                </TouchableOpacity>
                            }
                        </View>
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
                    </Animated.View>
                </Animated.View>
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

    controlsOverlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        elevation: 10,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },

    controlsOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        right: 25,
        top: 25,
        alignItems: 'flex-end',
    },

    seasonsButton: {
        width: 64,
        opacity: 0.55,
    },

    // Next episode button
    nextEpisodeAbsolute: {
        position: 'absolute',
        right: 25,
        bottom: 100,
        zIndex: 20,
        elevation: 20,
    },

    nextEpisodeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
    },

    nextEpisodeText: {
        color: 'black',
        fontSize: 14,
    },

    // Double-tap seek
    seekFeedbackLeft: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '35%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 25,
        elevation: 25,
        pointerEvents: 'none',
    },

    seekFeedbackRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '35%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 25,
        elevation: 25,
        pointerEvents: 'none',
    },

    // Full-screen tap zone
    fullscreenTapZone: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 8,
        elevation: 8,
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
    video: Platform.OS === 'web'
        ? {
            width: '100%',
            height: '100%',
            flex: 1,
        }
        : {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        }
});

export default VideoPlayer;

