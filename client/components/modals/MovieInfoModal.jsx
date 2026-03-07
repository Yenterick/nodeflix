import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Modules and components imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import Button from '../Button';
import ModalLayout from './ModalLayout';
import Divider from '../Divider';

// Modal to show the movie info
const MovieInfoModal = ({ movie, onClose, onPlay, onAddList, onLike, onDislike, interaction }) => {

    const formatSeconds = (duration) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        return `${hours}h ${minutes}m`
    }

    return(
        // General container with all the screen
        <ModalLayout onClose={onClose}>
            {/* Modal container */}
            <View style={styles.modalContainer}>
                {/* TODO: Use the video */}
                <View style={styles.videoContainer}>

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
                                width: '100%',
                                opacity: 0.5,
                            }
                        ]}  
                    >
                        {`Genres:  ${movie.genres.join(", ")}`}
                    </Text>                    
                    <Text
                        style={[
                            funnelDisplay.regular,
                            {
                                color: 'white',
                                textAlign: 'left',
                                width: '100%',
                                opacity: 0.5,
                            }
                        ]}  
                    >
                        {`Cast:  ${movie.cast.join(", ")}`}
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
        elevation: 10
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