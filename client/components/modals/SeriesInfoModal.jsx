import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useNavigation } from '@react-navigation/native';

// Modules and components imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import Button from '../Button';
import ModalLayout from './ModalLayout';
import Divider from '../Divider';

// TODO: Check if i'll handle the interactions in the modal or in the screen
// Modal to show the series info
const SeriesInfoModal = ({ series, onClose }) => {

    // Navigation hook
    const navigation = useNavigation();

    // Interaction hook
    const [interaction, setInteraction] = useState(undefined);

    // FIXME: FKN NUCLEAR SCREEN ALTERNATIVE
    const [nuke, setNuke] = useState(false);

    const videoUrl = series.seasons
        ?.find(season => season.season_number === 1)
        ?.episodes?.find(episode => episode.episode_number === 1)
        ?.stream_url;

    // Video player hooks
    const player = useVideoPlayer(process.env.EXPO_PUBLIC_CDN_URL + videoUrl, player => {
        player.loop = true;
        player.muted = true;
        player.play();
    });

    // Video playing events
    const { status } = useEvent(player, 'statusChange', { status: player.status });

    // Loading checker
    const isBufferLoading = status === 'idle' || status === 'loading';
    const isLoading = isBufferLoading;

    const [mutedIcon, setMutedIcon] = useState(true);

    // FIXME: Link with mute status
    const toggleMute = () => {
        if (!player) return;
        player.muted = !player.muted;
        setMutedIcon(player.muted);
    };


    // Hooks for the season selection dropdown
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

    const seasonCount = series.seasons ? series.seasons.length : 0;
    const seasonText = seasonCount === 1 ? '1 Season' : `${seasonCount} Seasons`;

    // Function to redirect to VideoPlayer
    const handlePlay = (seasonNumber, episodeNumber) => {
        setNuke(true);

        setTimeout(() => {
            navigation.navigate('VideoPlayer', {
                contentId: series._id,
                contentType: 'series',
                season: seasonNumber || 1,
                episode: episodeNumber || 1
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
                    {/* Series header */}
                    <View style={styles.seriesHeader}>
                        <Text
                            style={[
                                funnelDisplay.bold,
                                styles.h1
                            ]}
                        >
                            {series.title}
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
                                {series.release_year}
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
                                {seasonText}
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
                            {series.description}
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
                            {`Genres: ${series.genres.join(", ").replace(/(^|\s)\S/g, match => match.toUpperCase())}`}
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
                            {`Cast: ${series.cast.join(", ")}`}
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
                            onPress={() => console.log('Add to list')}
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
                            onPress={() => setInteraction(interaction === 'like' ? undefined : 'like')}
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
                            onPress={() => setInteraction(interaction === 'dislike' ? undefined : 'dislike')}
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
                            {series.seasons.map((season) => (
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
                        {series.seasons
                            .find(season => season.season_number === selectedSeason)
                            ?.episodes.map((episode) => (
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

    // Series header styles config
    seriesHeader: {
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

export default SeriesInfoModal;