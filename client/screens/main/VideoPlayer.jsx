import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { MaterialIcons } from '@expo/vector-icons';

// Module and components imports
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import colorScheme from '../../assets/color/colorScheme';
import useFetch from '../../hooks/useFetch';
import ModalLayout from '../../components/modals/ModalLayout';
import InfoModal from '../../components/modals/InfoModal';

const VideoPlayer = ({ route }) => {
    // Getting the route params
    const { contentId, contentType, episode, season } = route.params;  

    // Navigation hook
    const navigation = useNavigation();

    // Insets hook
    const insets = useSafeAreaInsets();

    // Various hooks
    const [ hasError, setHasError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('An error has ocurred while playing the content!');
    const [ content, setContent ] = useState(undefined);
    const [ currentSeason, setCurrentSeason ] = useState(season || 1);
    const [ currentEpisode, setCurrentEpisode ] = useState(episode || 1);
    const { request, loading, error } = useFetch();

    // Show video controls hook
    const [ showVideoControls, setShowVideoControls ] = useState(false);

    // Video controls reference
    const controlsTimeout = useRef(null);

    // Function to handle screen touch
    const handleScreenTouch = () => {
        if (showVideoControls) {
            setShowVideoControls(false);
            if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
            return;
        }

        setShowVideoControls(true);

        if (controlsTimeout.current) clearTimeout(controlsTimeout.current);

        controlsTimeout.current = setTimeout(() => {
            setShowVideoControls(false);
        }, 4000);
    };

    // Orientation state to prevent double change
    const [ orientationReady, setOrientationReady ] = useState(false);

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
                const response = await request(contentType == 'movie' ? `/movie/${contentId}` : `/series/${contentId}`);
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

    // TODO: Maybe change the episode finder later :D
    // Video player creation
    const videoUrl =
        contentType === 'movie'
            ? content?.stream_url
            : content?.seasons
                ?.find(s => s.season_number === currentSeason)
                ?.episodes
                ?.find(e => e.episode_number === currentEpisode)
                ?.stream_url;

    const player = useVideoPlayer(videoUrl ? `${process.env.EXPO_PUBLIC_CDN_URL}${videoUrl}` : null, player => {
        player.loop = false;
        player.play();
    }); 

    // Video playing event
    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player?.playing || false });

    if (!orientationReady) {
        return(
            <View
                style={styles.background}
            />
        )
    }

    return(
        // General container with all the screen
        <View 
            style={[
                styles.background,
                {
                    paddingLeft: insets.left,
                    paddingRight: insets.right
                }
            ]}
        >

        {/* Error modal */}
        {hasError && 
            <InfoModal 
                text={errorMessage} 
                icon='error-outline' 
                color='#FF6B6B' 
                onExit={() => navigation.goBack()}
            />
        }
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
                            name='arrow-back'
                            size={24} 
                            color='white'
                        />
                    </TouchableOpacity>  
                    <TouchableOpacity
                        style={styles.pauseButton}
                        onPress={() => {
                                    if (isPlaying) {
                                        player.pause();
                                    } else {
                                        player.play();
                                    }
                                }
                        }
                    >
                        <MaterialIcons 
                            name={isPlaying ? 'pause' : 'play-arrow'} 
                            size={128} 
                            color='white' 
                        />
                    </TouchableOpacity>                    
                </Pressable>
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
        padding: 5,
        backgroundColor: colorScheme.darkGreen,
        borderRadius: '50%',
        opacity: 0.5,
    },

    pauseButton: {
        position: 'absolute',
        padding: 10,
        backgroundColor: colorScheme.darkGreen,
        borderRadius: '50%',
        opacity: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
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

