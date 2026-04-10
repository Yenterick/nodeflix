import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Module and componets imports
import colorScheme from '../../assets/color/colorScheme';
import { funnelDisplay } from '../../assets/fonts/funnelDisplay';
import ContentCard from '../../components/ContentCard';
import SkeletonCard from '../../components/SkeletonCard';
import InfoModal from '../../components/modals/InfoModal';
import ContentInfoModal from '../../components/modals/ContentInfoModal';
import useFetch from '../../hooks/useFetch';

const SeriesP = () => {
    // Placeholder array in case series don't charge
    const placeholders = Array.from({ length: 6 });

    // Navigation hook
    const router = useRouter();

    // Various hooks
    const insets = useSafeAreaInsets();
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('An error has ocurred while retrieving the series!');
    const { request, error, loading } = useFetch();

    // Series hooks
    const [series, setSeries] = useState([]);

    // Series info modal hooks
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [showSeriesInfoModal, setShowSeriesInfoModal] = useState(false);

    const handleSelectSeries = (item) => {
        setSelectedSeries(item);
        setShowSeriesInfoModal(true);
    }

    // Load the series from the backend
    const fetchSeries = async () => {
        try {
            const response = await request(
                `/series/${await AsyncStorage.getItem('isKid') === 'true' ? 'kid' : 'all'}`, 
                'GET'
            );

            if (response && response.success) {
                if (!response.data) {
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

    useEffect(() => {
        fetchSeries();
    }, [])

    return (
        <>
            {/* Error modal */}
            {hasError &&
                <InfoModal text={errorMessage} icon='error-outline' color='#FF6B6B' onExit={() => router.replace('/(auth)/login')} />
            }
            {showSeriesInfoModal &&
                <ContentInfoModal item={selectedSeries} contentType='series' onClose={() => setShowSeriesInfoModal(false)} />
            }
            <ScrollView 
                style={styles.background}
                contentInsetAdjustmentBehavior="automatic"
            >
                <Text style={[
                    styles.h1,
                    funnelDisplay.semibold
                ]}>
                    Trending...
                </Text>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={series.length ? series : placeholders}
                    renderItem={({ item, index }) =>
                        series.length ? (
                            <ContentCard
                                uriSource={process.env.EXPO_PUBLIC_CDN_URL + item.thumbnail_url}
                                onPress={() => handleSelectSeries(item)}
                            />
                        ) : (
                            <SkeletonCard style={{ opacity: 1 - index * 0.12 }} />
                        )
                    }
                    keyExtractor={(item, index) => series.length ? item._id : `placeholder-${index}`}
                />
                <Text style={[
                    styles.h1,
                    funnelDisplay.semibold
                ]}>
                    What's new?
                </Text>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={series.length ? series : placeholders}
                    renderItem={({ item, index }) =>
                        series.length ? (
                            <ContentCard
                                uriSource={process.env.EXPO_PUBLIC_CDN_URL + item.thumbnail_url}
                                onPress={() => handleSelectSeries(item)}
                            />
                        ) : (
                            <SkeletonCard style={{ opacity: 1 - index * 0.12 }} />
                        )
                    }
                    keyExtractor={(item, index) => series.length ? item._id : `placeholder-${index}`}
                />
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    // General styles config
    background: {
        flex: 1,
        backgroundColor: colorScheme.darkGreen,
        paddingLeft: 20,
        paddingRight: 20
    },

    h1: {
        color: 'white',
        margin: 10,
        fontSize: 24
    },

    // Placeholder style config removed - handled by SkeletonCard
});

export default SeriesP;
