import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useEvent } from 'expo'
import { useVideoPlayer, VideoView } from 'expo-video';
import { useNavigation } from '@react-navigation/native';

// Modules and components imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import Button from '../Button';
import ModalLayout from './ModalLayout';
import Divider from '../Divider';

// TODO: Check if i'll handle the interactions in the modal or in the screen
// Modal to show the movie info
const MovieInfoModal = ({ movie, onClose }) => {

    // Navigation hook
    const navigation = useNavigation();

    // Interaction hook
    const [interaction, setInteraction] = useState(undefined);

    // Video player hooks
    const player = useVideoPlayer(process.env.EXPO_PUBLIC_CDN_URL + movie.stream_url, player => {
        player.loop = true;
        player.muted = true;
        player.play();
    });

    // Video playing events
    const { status } = useEvent(player, 'statusChange', { status: player.status });

    // Loading checker
    const isBufferLoading = status === 'idle' || status === 'loading';
    const isLoading = isBufferLoading;

    // FIXME: FKN NUCLEAR SCREEN ALTERNATIVE
    const [nuke, setNuke] = useState(false);

    // FIXME: Link with mute status
    const [mutedIcon, setMutedIcon] = useState(true);

    const toggleMute = () => {
        if (!player) return;
        player.muted = !player.muted;
        setMutedIcon(player.muted);
    };

    // Function to format the raw seconds to hours and minutes
    const formatSeconds = (duration) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        if (hours === 0) return `${minutes}m`;
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
    }

    // Function to redirect to VideoPlayer
    const handlePlay = () => {
        setNuke(true);

        setTimeout(() => {
            navigation.navigate('VideoPlayer', {
                contentId: movie._id,
                contentType: 'movie'
            });
            onClose();
        }, 50);
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
                    maxHeight: '100%'
                }
            ]}>
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
                    {/* Movie header */}
                    <View style={styles.movieHeader}>
                        <Text
                            style={[
                                funnelDisplay.bold,
                                styles.h1
                            ]}
                        >
                            {movie.title}
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
                                {movie.release_year}
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
                                {formatSeconds(movie.duration)}
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
                                Play
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
                            {movie.description}
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
                            {`Genres: ${movie.genres.join(", ").replace(/(^|\s)\S/g, match => match.toUpperCase())}`}
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
                            {`Cast: ${movie.cast.join(", ")}`}
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
                        // TODO: Add On Press
                        >
                            <MaterialIcons
                                name="add"
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
                                    opacity: interaction == 'like' ? 1.0 : 0.5
                                }
                            ]}
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
                                    opacity: interaction == 'dislike' ? 1.0 : 0.5
                                }
                            ]}
                        // TODO: Add onPress
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
                </ScrollView>
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

    // Movie header styles config
    movieHeader: {
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
        gap: 20
    },

    extraButton: {
        justifyContent: 'center',
        alignItems: 'center'
    }

});

export default MovieInfoModal;