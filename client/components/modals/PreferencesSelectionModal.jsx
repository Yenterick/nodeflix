import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

// Module and component imports
import ModalLayout from './ModalLayout';
import InfoModal from './InfoModal';
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import Button from '../Button';
import useFetch from '../../hooks/useFetch';

// Modal to let the user select the content thas has already watched
const PreferencesSelectionModal = ({ onClose }) => {

    // Various hooks
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('An error has ocurred while fetching the content!');

    // Content hooks
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);

    const { error, loading, request } = useFetch();

    const fetchMovies = async () => {
        try {
            const response = await request(`/movie/names`, 'GET');

            if (response && response.success) {
                if (!response.data || response.data.length === 0) {
                    setHasError(true);
                    setErrorMessage('An error has ocurred while retrieving the movies!');
                    return;
                }
                setMovies(response.data);
            } else {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error has ocurred while retrieving the movies!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
    }

    const fetchSeries = async () => {
        try {
            const response = await request(`/series/names`, 'GET');

            if (response && response.success) {
                if (!response.data || response.data.length === 0) {
                    setHasError(true);
                    setErrorMessage('An error has ocurred while retrieving the series!');
                    return;
                }
                setSeries(response.data);
            } else {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'An error has ocurred while retrieving the series!');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
    }

    // Load movies and series
    useEffect(() => {
        fetchMovies();
        fetchSeries();
    }, [])

    return (
        <ModalLayout onClose={onClose}>
            {/* Error modal */}
            {hasError &&
                <InfoModal text={errorMessage} icon='error-outline' color='#FF6B6B' onExit={() => setHasError(false)} />
            }

            {/* General container with the modal */}
            <View style={styles.preferencesContainer}>
                {loading ? 
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator
                            color='white'
                            size='large'
                            style={{ transform: [{ scale: 3 }] }}
                        />
                    </View>
                :
                    <>
                        <View style={styles.moviesSection}>
                            <Text
                                style={[
                                    funnelDisplay.bold,
                                    styles.label
                                ]}
                            >
                                Have you seen any of these movies?
                            </Text>
                            <View style={styles.moviesContainer}>
                                <FlatList
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={movies}
                                    contentContainerStyle={styles.moviesList}
                                    renderItem={({ item, index }) => (
                                        <View style={styles.movies}>
                                            <Text
                                                style={[
                                                    funnelDisplay.medium,
                                                    styles.contentTitle
                                                ]}
                                            >
                                                {item.title}
                                            </Text>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => item._id}
                                />
                            </View>
                        </View>
                        <View style={styles.seriesSection}>
                            <Text
                                style={[
                                    funnelDisplay.bold,
                                    styles.label
                                ]}
                            >
                                What about these series?
                            </Text>
                            <View style={styles.seriesContainer}>
                                <FlatList
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={series}
                                    contentContainerStyle={styles.seriesList}
                                    renderItem={({ item, index }) => (
                                        <View style={styles.series}>
                                            <Text
                                                style={[
                                                    funnelDisplay.medium,
                                                    styles.contentTitle
                                                ]}
                                            >
                                                {item.title}
                                            </Text>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => item._id}
                                >

                                </FlatList>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                onPress={onClose}
                                color={colorScheme.bgDarkGreen}
                                style={[
                                    styles.cancelButton,
                                    {
                                        flex: 1
                                    }
                                ]}
                            >
                                {loading ?
                                    <ActivityIndicator
                                        size="small"
                                        color="white"
                                    />
                                    :
                                    <Text style={[
                                        funnelDisplay.bold,
                                        styles.buttonText,
                                        {
                                            color: colorScheme.green
                                        }
                                    ]}
                                    >
                                        Skip
                                    </Text>
                                }
                            </Button>
                            <Button
                                style={
                                    {
                                        flex: 1
                                    }
                                }
                            >
                                {loading ?
                                    <ActivityIndicator
                                        size="small"
                                        color="white"
                                    />
                                    :
                                    <Text style={[
                                        funnelDisplay.bold,
                                        styles.buttonText
                                    ]}
                                    >
                                        Save
                                    </Text>
                                }
                            </Button>
                        </View>
                    </>
                }
            </View>
            
        </ModalLayout>
    );
}

const styles = StyleSheet.create({
    // General styles configuration
    preferencesContainer: {
        width: 340,
        height: 410,
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

    // Titles styles config
    label: {
        fontSize: 24,
        textAlign: 'left',
        color: 'white'
    },

    contentTitle: {
        color: 'white',
        fontSize: 12
    },

    // Movies section styles config
    moviesSection: {
        marginBottom: 36,
    },

    moviesList: {
        alignItems: 'center',
        paddingHorizontal: 4
    },

    moviesContainer: {
        height: 60,
        borderColor: 'yellow',
    },

    movie: {
        
    },

    // Series section styles config
    seriesSection: {
        marginBottom: 36
    },

    seriesContainer: {
        height: 60
    },

    seriesList: {
        alignItems: 'center',
        paddingHorizontal: 4
    },

    series: {

    },

    // Button styles config
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12
    },

    cancelButton: {
        borderColor: colorScheme.green,
        borderWidth: 2
    },

    buttonText: {
        color: 'white',
        fontSize: 16
    }
});

export default PreferencesSelectionModal;