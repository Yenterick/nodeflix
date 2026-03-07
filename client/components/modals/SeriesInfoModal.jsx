import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react'

// Modules and components imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import Button from '../Button';
import ModalLayout from './ModalLayout';
import Divider from '../Divider';

// TODO: Check if i'll handle the interactions in the modal or in the screen
// Modal to show the series info
const SeriesInfoModal = ({ series, onClose, onPlay, onAddList, onLike, onDislike, interaction }) => {

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(1);

    const formatSeconds = (duration) => {
        const hours = Math.floor(duration / 60);
        const minutes = Math.floor(duration % 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    const seasonCount = series.seasons ? series.seasons.length : 0;
    const seasonText = seasonCount === 1 ? '1 Season' : `${seasonCount} Seasons`;

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
                >
                    {/* TODO: Use the video */}
                    <View style={styles.videoContainer}>

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
                            onPress={onPlay}
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
                            {`Genres:  ${series.genres.join(", ")}`}
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
                            {`Cast:  ${series.cast.join(", ")}`}
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
                            onPress={onAddList}
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
                            onPress={onLike}
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
                                    opacity: interaction == 'like' ? 1.0 : 0.5
                                }
                            ]}
                            onPress={onDislike}
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
                            .find(s => s.season_number === selectedSeason)
                            ?.episodes.map((episode) => (
                                <View 
                                    key={episode.episode_number} 
                                    style={styles.episodeCard}
                                >
                                    <View style={styles.episodeHeader}>
                                        <Image
                                            source={{ uri: episode.thumbnail_url }}
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
                                </View>
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
        backgroundColor: 'black'
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