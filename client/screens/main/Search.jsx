import { View, Text, StyleSheet, TextInput, FlatList, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { FadeIn, useSharedValue, withSpring, useAnimatedStyle, Layout } from 'react-native-reanimated';

// Module and component imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import ContentCard from '../../components/ContentCard';
import InfoModal from '../../components/modals/InfoModal';
import ContentInfoModal from '../../components/modals/ContentInfoModal';
import Button from '../../components/Button';
import useFetch from '../../hooks/useFetch';

// Genre list
const GENRES = [
    'All',
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi',
    'Thriller',
    'Romance',
    'Documentary',
    'Animation',
    'Family',
    'Fantasy',
    'Crime',
];

// Content type tabs
const CONTENT_TYPES = ['All', 'Movies', 'Series'];

const Search = () => {
    const insets = useSafeAreaInsets();
    const searchInputRef = useRef(null);

    // Animation values
    const searchScale = useSharedValue(1);
    const searchIconScale = useSharedValue(1);

    const searchAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(searchScale.value) }]
    }));

    const searchIconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(searchIconScale.value) }]
    }));

    // Fetch hooks
    const { request: requestMovies, loading: loadingMovies } = useFetch();
    const { request: requestSeries, loading: loadingSeries } = useFetch();

    // Filter states
    const [query, setQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedGenre, setSelectedGenre] = useState('All');

    // Results state
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isDebouncing, setIsDebouncing] = useState(false);

    // Error state
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('An error has ocurred while searching!');

    // Content info modal
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedContentType, setSelectedContentType] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);

    // Debounce timer ref
    const debounceRef = useRef(null);

    const handleSelectItem = (item, contentType) => {
        setSelectedItem(item);
        setSelectedContentType(contentType);
        setShowInfoModal(true);
    };

    // Build the query string for the API call
    const buildParams = (q, genre) => {
        const params = new URLSearchParams();
        if (q && q.trim() !== '') params.set('q', q.trim());
        if (genre && genre !== 'All') params.set('genre', genre);
        return params.toString() ? `?${params.toString()}` : '';
    };

    // Fetch results from both endpoints in parallel
    const fetchResults = useCallback(async (q, genre, type) => {
        try {
            const isKid = await AsyncStorage.getItem('isKid') === 'true';
            const kidCheck = isKid ? 'kid' : 'all';
            const qs = buildParams(q, genre);

            const shouldFetchMovies = type === 'All' || type === 'Movies';
            const shouldFetchSeries = type === 'All' || type === 'Series';

            const [moviesRes, seriesRes] = await Promise.all([
                shouldFetchMovies
                    ? requestMovies(`/movie/search/${kidCheck}${qs}`, 'GET')
                    : Promise.resolve({ success: true, data: [] }),
                shouldFetchSeries
                    ? requestSeries(`/series/search/${kidCheck}${qs}`, 'GET')
                    : Promise.resolve({ success: true, data: [] }),
            ]);

            if (moviesRes && moviesRes.success) {
                setMovies(moviesRes.data || []);
            } else {
                setHasError(true);
                setErrorMessage(moviesRes?.msg || 'Error fetching movies!');
            }

            if (seriesRes && seriesRes.success) {
                setSeries(seriesRes.data || []);
            } else {
                setHasError(true);
                setErrorMessage(seriesRes?.msg || 'Error fetching series!');
            }

            setHasSearched(true);
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
    }, [requestMovies, requestSeries]);

    // Trigger search whenever query, genre or type changes (debounced for text)
    useEffect(() => {
        setIsDebouncing(true);
        searchIconScale.value = 1.3;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchResults(query, selectedGenre, selectedType).finally(() => {
                setIsDebouncing(false);
                searchIconScale.value = 1;
            });
        }, 350);
        return () => clearTimeout(debounceRef.current);
    }, [query, selectedGenre, selectedType]);

    // Merge and interleave results (movies first, then series) or just one type
    const results = [
        ...(selectedType !== 'Series' ? movies.map(m => ({ ...m, _contentType: 'movie' })) : []),
        ...(selectedType !== 'Movies' ? series.map(s => ({ ...s, _contentType: 'series' })) : []),
    ];

    const isLoading = loadingMovies || loadingSeries || isDebouncing;

    return (
        <>
            {/* Error modal */}
            {hasError && (
                <InfoModal
                    text={errorMessage}
                    icon='error-outline'
                    color='#FF6B6B'
                    onExit={() => setHasError(false)}
                />
            )}

            {/* Content info modal */}
            {showInfoModal && selectedItem && (
                <ContentInfoModal
                    item={selectedItem}
                    contentType={selectedContentType}
                    onClose={() => setShowInfoModal(false)}
                />
            )}

            <View style={styles.background}>
                {/* Search header */}
                <View style={[styles.searchHeader, {
                    paddingTop: Platform.select({
                        web: 16,
                        android: insets.top + 16,
                        ios: Math.max(insets.top, 16)
                    })
                }]}>
                    {/* Search bar */}
                    <Animated.View style={[styles.searchBarContainer, searchAnimatedStyle]}>
                        <Animated.View style={searchIconAnimatedStyle}>
                            <MaterialIcons
                                name="search"
                                size={22}
                                color={'gray'}
                                style={styles.searchIcon}
                            />
                        </Animated.View>
                        <TextInput
                            ref={searchInputRef}
                            id="search-input"
                            style={[funnelDisplay.regular, styles.searchInput]}
                            placeholder="Search movies & series..."
                            placeholderTextColor="gray"
                            value={query}
                            onChangeText={setQuery}
                            returnKeyType="search"
                            clearButtonMode="while-editing"
                            autoCorrect={false}
                            keyboardAppearance="dark"
                            onFocus={() => { searchScale.value = 1.03 }}
                            onBlur={() => { searchScale.value = 1 }}
                        />
                        {query.length > 0 && Platform.OS !== 'ios' && (
                            <TouchableOpacity
                                onPress={() => setQuery('')}
                                style={styles.clearButton}
                            >
                                <MaterialIcons name="close" size={18} color="gray" />
                            </TouchableOpacity>
                        )}
                    </Animated.View>

                    {/* Content type pills */}
                    <View style={styles.typePillsRow}>
                        {CONTENT_TYPES.map(type => (
                            <TouchableOpacity
                                key={type}
                                id={`type-filter-${type.toLowerCase()}`}
                                style={[
                                    styles.typePill,
                                    selectedType === type && styles.typePillActive,
                                ]}
                                onPress={() => setSelectedType(type)}
                            >
                                <Text style={[
                                    funnelDisplay.semibold,
                                    styles.typePillText,
                                    selectedType === type && styles.typePillTextActive,
                                ]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentInsetAdjustmentBehavior="never"
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Genre horizontal scroll with chips */}
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={GENRES}
                        keyExtractor={item => item}
                        contentContainerStyle={styles.genreList}
                        renderItem={({ item: genre }) => (
                            <TouchableOpacity
                                id={`genre-filter-${genre.toLowerCase().replace(/[^a-z]/g, '-')}`}
                                style={[
                                    styles.genreChip,
                                    selectedGenre === genre && styles.genreChipActive,
                                ]}
                                onPress={() => setSelectedGenre(genre)}
                            >
                                <Text style={[
                                    funnelDisplay.regular,
                                    styles.genreChipText,
                                    selectedGenre === genre && styles.genreChipTextActive,
                                ]}>
                                    {genre}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />

                    {/* Results section */}
                    <View style={styles.resultsSection}>
                        {/* Results header */}
                        <View style={styles.resultsHeader}>
                            <Text style={[funnelDisplay.semibold, styles.resultsTitle]}>
                                {!hasSearched
                                    ? 'Loading...'
                                    : isLoading
                                        ? 'Searching...'
                                        : results.length === 0
                                            ? 'No results found'
                                            : `${results.length} Result${results.length !== 1 ? 's' : ''}`}
                            </Text>
                        </View>

                        {/* Results grid */}
                        {isLoading ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 }}>
                                <ActivityIndicator size="large" color='white' />
                            </View>
                        ) : results.length === 0 && hasSearched ? (
                            <Animated.View
                                entering={FadeIn.duration(300)}
                                style={styles.emptyState}
                            >
                                <MaterialIcons
                                    name="search-off"
                                    size={64}
                                    color={'white'}
                                />
                                <Text style={[funnelDisplay.regular, styles.emptyStateText]}>
                                    {query.trim() !== ''
                                        ? `No results for "${query}"`
                                        : 'No content available for these filters'}
                                </Text>
                                {(selectedGenre !== 'All' || selectedType !== 'All') && (
                                    <Button
                                        onPress={() => {
                                            setSelectedGenre('All');
                                            setSelectedType('All');
                                        }}
                                    >
                                        <Text style={[funnelDisplay.semibold, { color: 'white' }]}>
                                            Clear filters
                                        </Text>
                                    </Button>
                                )}
                            </Animated.View>
                        ) : (
                            <Animated.View
                                entering={FadeIn.duration(200)}
                                style={styles.resultsGrid}
                            >
                                {results.map((item, index) => (
                                    <Animated.View
                                        key={`${item._contentType}-${item._id}`}
                                        entering={FadeIn.delay(index * 40).duration(400)}
                                        layout={Layout.springify().damping(15)}
                                    >
                                        <ContentCard
                                            uriSource={process.env.EXPO_PUBLIC_CDN_URL + item.thumbnail_url}
                                            onPress={() => handleSelectItem(item, item._contentType)}
                                            title={item.title}
                                            contentType={item._contentType}
                                        />
                                    </Animated.View>
                                ))}
                            </Animated.View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: colorScheme.darkGreen,
    },

    // Search header
    searchHeader: {
        backgroundColor: colorScheme.darkGreen,
        paddingTop: 16,
        paddingHorizontal: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(98, 129, 65, 0.15)',
        zIndex: 10,
    },

    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colorScheme.beige,
        borderRadius: 14,
        paddingHorizontal: 14,
    },

    searchIcon: {
        marginRight: 10,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
        outlineStyle: 'none',
    },

    clearButton: {
        padding: 4,
        marginLeft: 6,
    },

    // Type pills
    typePillsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 16,
    },

    typePill: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(98, 129, 65, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(98, 129, 65, 0.25)',
    },

    typePillActive: {
        backgroundColor: colorScheme.green,
        borderColor: colorScheme.green,
    },

    typePillText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },

    typePillTextActive: {
        color: 'white',
    },

    // Genre chips
    genreList: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        gap: 8,
    },

    genreChip: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: colorScheme.bgDarkGreen,
        borderWidth: 1,
        borderColor: 'rgba(98, 129, 65, 0.2)',
        marginRight: 2,
    },

    genreChipActive: {
        backgroundColor: 'rgba(98, 129, 65, 0.25)',
        borderColor: colorScheme.green,
    },

    genreChipText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
    },

    genreChipTextActive: {
        color: colorScheme.lightGreen,
    },

    // Results section
    resultsSection: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    resultsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    resultsTitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        letterSpacing: 1,
    },

    // Results grid
    resultsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 1,
        rowGap: 16,
        justifyContent: 'center',
    },

    // Empty state
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 16,
    },

    emptyStateText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
    },


});

export default Search;
