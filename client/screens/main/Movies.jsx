import { View, Text, StyleSheet, FlatList, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Module and componets imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import ContentCard from '../../components/ContentCard';
import InfoModal from '../../components/modals/InfoModal';
import ContentInfoModal from '../../components/modals/ContentInfoModal';
import useFetch from '../../hooks/useFetch';

const GENRE_TITLES = {
    'Action': 'Adrenaline Rush',
    'Comedy': 'Laugh Out Loud',
    'Drama': 'Critically Acclaimed Dramas',
    'Horror': 'Keep the Lights On',
    'Sci-Fi': 'Out of this World',
    'Thriller': 'Edge of Your Seat',
    'Romance': 'Swoon-Worthy Romance',
    'Documentary': 'Real Life Stories',
    'Animation': 'Animated Masterpieces',
    'Family': 'Fun for the Whole Family',
    'Fantasy': 'Magical Worlds',
    'Crime': 'Unsolved Mysteries',
};

const Movies = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { request, loading, error } = useFetch();

    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [moviesByGenre, setMoviesByGenre] = useState({});

    // Movie info modal hooks
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showMovieInfoModal, setShowMovieInfoModal] = useState(false);

    const handleSelectMovie = (item) => {
        setSelectedMovie(item);
        setShowMovieInfoModal(true);
    };

    const fetchMovies = async () => {
        try {
            const isKid = await AsyncStorage.getItem('isKid') === 'true';
            const response = await request(`/movie/${isKid ? 'kid' : 'all'}`, 'GET');

            if (response && response.success && response.data) {
                const grouped = response.data.reduce((acc, movie) => {
                    if (movie.genres) {
                        movie.genres.forEach(genre => {
                            if (!acc[genre]) acc[genre] = [];
                            acc[genre].push(movie);
                        });
                    }
                    return acc;
                }, {});
                setMoviesByGenre(grouped);
            } else {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'Failed to load movies.');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const renderGenreRow = (genre, data) => {
        if (!data || data.length === 0) return null;
        const title = GENRE_TITLES[genre] || `${genre} Movies`;

        return (
            <View style={styles.rowContainer} key={genre}>
                <Text style={[funnelDisplay.semibold, styles.rowTitle]}>{title}</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={Platform.OS === 'web'}
                    data={data}
                    keyExtractor={(item, index) => `${item._id}-${index}`}
                    contentContainerStyle={styles.rowList}
                    renderItem={({ item }) => (
                        <ContentCard
                            uriSource={process.env.EXPO_PUBLIC_CDN_URL + item.thumbnail_url}
                            onPress={() => handleSelectMovie(item)}
                            title={item.title}
                            contentType="movie"
                        />
                    )}
                />
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom, paddingTop: insets.top }]}>
            {hasError && (
                <InfoModal
                    text={errorMessage}
                    icon='error-outline'
                    color='#FF6B6B'
                    onExit={() => { setHasError(false); router.replace('/(auth)/login'); }}
                />
            )}

            {showMovieInfoModal && selectedMovie && (
                <ContentInfoModal
                    item={selectedMovie}
                    contentType='movie'
                    onClose={() => setShowMovieInfoModal(false)}
                />
            )}

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            ) : (
                <ScrollView
                    style={styles.background}
                    contentContainerStyle={{ paddingVertical: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    {Object.keys(moviesByGenre).map(genre => renderGenreRow(genre, moviesByGenre[genre]))}

                    {Object.keys(moviesByGenre).length === 0 && (
                        <Text style={[funnelDisplay.medium, { color: 'gray', textAlign: 'center', marginTop: 50 }]}>
                            No movies available right now.
                        </Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme.darkGreen,
    },
    background: {
        flex: 1,
    },
    rowContainer: {
        marginBottom: 24,
    },
    rowTitle: {
        color: 'white',
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    rowList: {
        paddingHorizontal: 10,
        paddingVertical: 15,
    }
});

export default Movies;