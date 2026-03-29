import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

// Module and component imports
import ModalLayout from './ModalLayout';
import InfoModal from './InfoModal';
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import Button from '../Button';
import useFetch from '../../hooks/useFetch';

// Preferences selection modal
const PreferencesSelectionModal = ({ onClose, onSave }) => {

    // Various hooks
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('An error has ocurred while fetching the content!');

    const { error, loading, request } = useFetch();

    // Content hooks
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);

    const [selectedMovies, setSelectedMovies] = useState(new Set());
    const [selectedSeries, setSelectedSeries] = useState(new Set());

    // Function to fetch the movies
    const fetchMovies = async () => {
        try {
            const response = await request('/movie/names', 'GET');

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

    // Function to fetch the series
    const fetchSeries = async () => {
        try {
            const response = await request('/series/names', 'GET');

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

    // Function to handle the preference selection
    const handlePreferenceTouch = (contentType, itemId) => {
        if (contentType === 'movie') {
            setSelectedMovies(prev => {
                const newSet = new Set(prev);
                if (newSet.has(itemId)) {
                    newSet.delete(itemId);
                } else {
                    newSet.add(itemId);
                }
                return newSet;
            });
        } else {
            setSelectedSeries(prev => {
                const newSet = new Set(prev);
                if (newSet.has(itemId)) {
                    newSet.delete(itemId);
                } else {
                    newSet.add(itemId);
                }
                return newSet;
            });
        }
    }

    // Function to save the preferences
    const handleSave = () => {
        const moviesArray = Array.from(selectedMovies);
        const seriesArray = Array.from(selectedSeries);

        onSave({
            movies: moviesArray,
            series: seriesArray
        });

        onClose();
    }

    // Load movies and series
    useEffect(() => {
        fetchMovies();
        fetchSeries();
    }, [])

    const totalSelected = selectedMovies.size + selectedSeries.size;

    // Function to render a chip
    const renderChip = (item, isSelected, contentType) => (
        <TouchableOpacity
            style={[
                styles.chip,
                isSelected && styles.chipSelected
            ]}
            onPress={() => handlePreferenceTouch(contentType, item._id)}
            activeOpacity={0.75}
        >
            {isSelected && (
                <MaterialIcons
                    name="check"
                    size={13}
                    color="white"
                    style={styles.chipCheck}
                />
            )}
            <Text
                style={[
                    funnelDisplay.medium,
                    styles.chipText,
                    isSelected && styles.chipTextSelected
                ]}
            >
                {item.title}
            </Text>
        </TouchableOpacity>
    );

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

            {/* Preferences selection container */}
            <View style={styles.preferencesContainer}>

                {/* Header section */}
                <View style={styles.header}>
                    <Text
                        style={[
                            funnelDisplay.bold,
                            styles.headerTitle
                        ]}
                    >
                        What have you seen?
                    </Text>
                    <Text
                        style={[
                            funnelDisplay.medium,
                            styles.headerSubtitle
                        ]}
                    >
                        Help us personalise your experience
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
                        <Text
                            style={[
                                funnelDisplay.medium,
                                styles.loadingText
                            ]}
                        >
                            Loading content…
                        </Text>
                    </View>
                    :
                    <>
                        {/* Movies section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <MaterialIcons
                                    name="movie"
                                    size={16}
                                    color={colorScheme.lightGreen}
                                />
                                <Text
                                    style={[
                                        funnelDisplay.bold,
                                        styles.sectionLabel
                                    ]}
                                >
                                    Movies
                                </Text>
                                {selectedMovies.size > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {selectedMovies.size}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={movies}
                                contentContainerStyle={styles.chipList}
                                renderItem={({ item }) => renderChip(item, selectedMovies.has(item._id), 'movie')}
                                keyExtractor={(item) => item._id}
                            />
                        </View>

                        {/* Series section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <MaterialIcons
                                    name="tv"
                                    size={16}
                                    color={colorScheme.lightGreen}
                                />
                                <Text
                                    style={[
                                        funnelDisplay.bold,
                                        styles.sectionLabel
                                    ]}
                                >
                                    Series
                                </Text>
                                {selectedSeries.size > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {selectedSeries.size}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={series}
                                contentContainerStyle={styles.chipList}
                                renderItem={({ item }) => renderChip(item, selectedSeries.has(item._id), 'series')}
                                keyExtractor={(item) => item._id}
                            />
                        </View>

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
                                <Text
                                    style={[
                                        funnelDisplay.bold,
                                        styles.buttonText,
                                        { color: colorScheme.lightGreen }
                                    ]}
                                >
                                    Skip
                                </Text>
                            </Button>
                            <Button
                                onPress={handleSave}
                                style={{ flex: 1 }}
                            >
                                <Text
                                    style={[
                                        funnelDisplay.bold,
                                        styles.buttonText
                                    ]}
                                >
                                    {totalSelected > 0 ? `Save (${totalSelected})` : 'Save'}
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
    // Preferences container styles config
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

    // Header styles config
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

    // Section styles config
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

    badge: {
        backgroundColor: colorScheme.green,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5
    },

    badgeText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold'
    },

    // Chips styles config
    chipList: {
        paddingVertical: 4,
        gap: 8,
        paddingHorizontal: 2
    },

    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colorScheme.green,
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 20,
        gap: 4
    },

    chipSelected: {
        backgroundColor: colorScheme.green,
        borderColor: colorScheme.green
    },

    chipCheck: {
        marginRight: 1
    },

    chipText: {
        color: colorScheme.lightGreen,
        fontSize: 13
    },

    chipTextSelected: {
        color: 'white'
    },

    // Action buttons styles config
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

export default PreferencesSelectionModal;