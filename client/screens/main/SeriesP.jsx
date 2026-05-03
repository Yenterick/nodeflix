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

const SeriesP = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { request, loading, error } = useFetch();

    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [seriesByGenre, setSeriesByGenre] = useState({});

    // Series info modal hooks
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [showSeriesInfoModal, setShowSeriesInfoModal] = useState(false);

    const handleSelectSeries = (item) => {
        setSelectedSeries(item);
        setShowSeriesInfoModal(true);
    };

    const fetchSeries = async () => {
        try {
            const isKid = await AsyncStorage.getItem('isKid') === 'true';
            const response = await request(`/series/${isKid ? 'kid' : 'all'}`, 'GET');

            if (response && response.success && response.data) {
                const grouped = response.data.reduce((acc, series) => {
                    if (series.genres) {
                        series.genres.forEach(genre => {
                            if (!acc[genre]) acc[genre] = [];
                            acc[genre].push(series);
                        });
                    }
                    return acc;
                }, {});
                setSeriesByGenre(grouped);
            } else {
                setHasError(true);
                setErrorMessage(error || response?.msg || 'Failed to load series.');
            }
        } catch (error) {
            setHasError(true);
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchSeries();
    }, []);

    const renderGenreRow = (genre, data) => {
        if (!data || data.length === 0) return null;
        const title = GENRE_TITLES[genre] || `${genre} Series`;

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
                            onPress={() => handleSelectSeries(item)}
                            title={item.title}
                            contentType="series"
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

            {showSeriesInfoModal && selectedSeries && (
                <ContentInfoModal
                    item={selectedSeries}
                    contentType='series'
                    onClose={() => setShowSeriesInfoModal(false)}
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
                    {Object.keys(seriesByGenre).map(genre => renderGenreRow(genre, seriesByGenre[genre]))}

                    {Object.keys(seriesByGenre).length === 0 && (
                        <Text style={[funnelDisplay.medium, { color: 'gray', textAlign: 'center', marginTop: 50 }]}>
                            No series available right now.
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

export default SeriesP;
